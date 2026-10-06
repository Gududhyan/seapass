// SeaPass data layer.
//
//  - Sailings: generated from the timetable rules in data.js (departures per day, operating weekdays,
//    monsoon pause, weekend fares, seats left). No free public API exists for Indian ferry timetables,
//    so this is the one place to swap in an operator's API: replace listSailings() with a fetch().
//  - Sea conditions: REAL data from the Open-Meteo Marine API (free, no key, CORS enabled).
import { routes } from "../data.js";

// ---------- dates (always local time; toISOString() would shift by the UTC offset) ----------
export const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const fromISO = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
export const todayISO = () => toISO(new Date());
export const addDays = (iso, n) => { const d = fromISO(iso); d.setDate(d.getDate() + n); return toISO(d); };
export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fmtDate = (iso) => { const d = fromISO(iso); return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`; };

// ---------- timetable engine ----------
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const toMins = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const toHM = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const monsoonPause = (iso) => { const d = fromISO(iso), m = d.getMonth(); return (m >= 5 && m <= 7) || (m === 8 && d.getDate() <= 15); };

// Why a service does not run on a date, or null if it does.
export function pauseReason(route, iso) {
  if (route.monsoon && monsoonPause(iso)) return "paused for the monsoon season (1 Jun to 15 Sep)";
  const dow = fromISO(iso).getDay();
  if (!route.days.includes(dow)) return `does not sail on ${["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"][dow]}`;
  return null;
}

// Seats sold through this browser reduce availability, so booking visibly changes the numbers.
const readSold = () => { try { return JSON.parse(localStorage.getItem("seapass_sold") || "{}"); } catch { return {}; } };
export function holdSeats(key, n) {
  try { const s = readSold(); s[key] = (s[key] || 0) + n; localStorage.setItem("seapass_sold", JSON.stringify(s)); } catch { /* storage unavailable */ }
}

function buildSailing(route, date, dep, sold) {
  const key = `${route.id}|${date}|${dep}`;
  const start = toMins(dep), end = start + route.dur;
  const dow = fromISO(date).getDay();
  const weekend = dow === 0 || dow === 6;
  const filled = 0.25 + ((hash(key) % 1000) / 1000) * 0.75; // 25% to 100% booked
  return {
    key, routeId: route.id, from: route.from, to: route.to, date, dep, arr: toHM(end), nextDay: end >= 1440,
    dur: route.dur, price: Math.round((route.price * (weekend ? 1.1 : 1)) / 10) * 10, vehicle: route.vehicle,
    capacity: route.capacity, seats: Math.max(0, Math.round(route.capacity * (1 - filled)) - (sold[key] || 0)),
    img: route.img, tags: route.tags,
  };
}

// Synchronous core: every sailing on a date for the given filters.
export function listSailings({ from = "", to = "", routeId = null, date }) {
  const now = new Date();
  const cutoff = now.getHours() * 60 + now.getMinutes() + 30; // check-in closes 30 min before departure
  const isToday = date === todayISO();
  const sold = readSold();
  const sailings = [], paused = [];
  for (const r of routes) {
    if ((routeId && r.id !== routeId) || (from && r.from !== from) || (to && r.to !== to)) continue;
    const why = pauseReason(r, date);
    if (why) { paused.push({ route: r, reason: why }); continue; }
    for (const dep of r.deps) {
      if (isToday && toMins(dep) < cutoff) continue;
      sailings.push(buildSailing(r, date, dep, sold));
    }
  }
  sailings.sort((a, b) => a.dep.localeCompare(b.dep));
  return { date, sailings, paused };
}

export const countSailings = (params) => listSailings(params).sailings.length;

// First date (within 60 days) that has at least one sailing.
export function nextAvailable(params) {
  const start = params.date || todayISO();
  for (let i = 1; i <= 60; i++) { const d = addDays(start, i); if (countSailings({ ...params, date: d })) return d; }
  return null;
}

// Async wrapper so the UI handles loading like it would with a real network call.
export async function getSailings(params) {
  await new Promise((r) => setTimeout(r, 220 + Math.random() * 180));
  return listSailings(params);
}

// ---------- real sea conditions: Open-Meteo Marine API ----------
export const PORT_GEO = { // offshore points next to each port, where the wave model has data
  Mumbai: [18.90, 72.78], Alibag: [18.65, 72.80], Elephanta: [18.95, 72.95], Goa: [15.50, 73.70],
  Karwar: [14.80, 74.00], Kochi: [9.95, 76.15], Lakshadweep: [10.57, 72.50],
};
const forecasts = new Map();

// Resolves to { "YYYY-MM-DD": { wave, period } } (about 9 days of data), or null if the request failed.
export function getSeaForecast(port) {
  if (forecasts.has(port)) return forecasts.get(port);
  const geo = PORT_GEO[port];
  const p = (async () => {
    if (!geo) return null;
    try {
      const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${geo[0]}&longitude=${geo[1]}&daily=wave_height_max,wave_period_max&timezone=Asia%2FKolkata&forecast_days=16`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      const out = {};
      j.daily.time.forEach((t, i) => { if (j.daily.wave_height_max[i] != null) out[t] = { wave: j.daily.wave_height_max[i], period: j.daily.wave_period_max[i] }; });
      return out;
    } catch { return null; }
  })().then((r) => { if (!r) forecasts.delete(port); return r; }); // failed lookups can be retried
  forecasts.set(port, p);
  return p;
}

// Turn the forecast map into a display state for one port and date.
export function seaState(map, port, date) {
  const f = map[port];
  if (f === undefined) return { status: "loading" };
  if (f === false) return { status: "unavailable", reason: "Sea data could not be loaded" };
  const d = f[date];
  if (!d) return { status: "unavailable", reason: "Sea forecast covers about the next 9 days" };
  const level = d.wave < 1.0 ? "calm" : d.wave < 2.0 ? "moderate" : "rough";
  return { status: "ok", level, label: { calm: "Calm seas", moderate: "Moderate seas", rough: "Rough seas" }[level], wave: d.wave, period: d.period };
}
