// Real ferry terminals from OpenStreetMap, through the free Photon geocoder (photon.komoot.io, CORS enabled).
import { PORT_GEO } from "./ferryApi.js";

const BASE = "https://photon.komoot.io/api/";
const INDIA_BOX = "68,6,98,36"; // lon/lat box around India; results are then filtered to country code IN

const cache = new Map();
let known = {}; // place name -> { lat, lon }, kept for the tab so other pages can find a picked place again
try { known = JSON.parse(sessionStorage.getItem("seapass_places") || "{}"); } catch { known = {}; }
const remember = (p) => {
  known[p.name] = { lat: p.lat, lon: p.lon };
  try { sessionStorage.setItem("seapass_places", JSON.stringify(known)); } catch { /* storage unavailable */ }
};

function toPlace(f) {
  const p = f.properties || {};
  if (!p.name || p.countrycode !== "IN") return null;
  const [lon, lat] = f.geometry.coordinates;
  const area = p.city || p.district || p.county || "";
  const showArea = area && !p.name.toLowerCase().includes(area.toLowerCase());
  return { name: showArea ? `${p.name}, ${area}` : p.name, state: p.state || "", lat, lon };
}

// Ferry terminals in India matching `q` (empty q lists general ferry terminals). Resolves to null on failure.
export function searchTerminals(q = "") {
  const term = q.trim().toLowerCase() || "ferry";
  if (cache.has(term)) return cache.get(term);
  const url = `${BASE}?q=${encodeURIComponent(term)}&osm_tag=amenity:ferry_terminal&bbox=${INDIA_BOX}&limit=50&lang=en`;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000); // the free server can be slow; give up after 20 s
  const p = fetch(url, { signal: ctl.signal })
    .then((r) => { clearTimeout(timer); if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then((j) => {
      const seen = new Set(), out = [];
      for (const f of j.features || []) {
        const pl = toPlace(f);
        if (pl && !seen.has(pl.name)) { seen.add(pl.name); remember(pl); out.push(pl); }
      }
      return out;
    })
    .catch(() => { cache.delete(term); return null; }); // failed lookups can be retried
  cache.set(term, p);
  return p;
}

// Coordinates for a place name picked earlier, or a best-effort lookup if this tab has not seen it.
export async function resolvePlace(name) {
  if (known[name]) return known[name];
  try {
    const r = await fetch(`${BASE}?q=${encodeURIComponent(name)}&bbox=${INDIA_BOX}&limit=5&lang=en`);
    const j = await r.json();
    const f = (j.features || []).find((x) => x.properties?.countrycode === "IN");
    if (f) return { lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] };
  } catch { /* offline or blocked */ }
  return null;
}

const rad = (d) => (d * Math.PI) / 180;
export const distanceKm = (a, b) => {
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};

// The SeaPass port closest to a point, { port, km }.
export function nearestServed(point) {
  let best = null;
  for (const [port, [lat, lon]] of Object.entries(PORT_GEO)) {
    const km = distanceKm(point, { lat, lon });
    if (!best || km < best.km) best = { port, km: Math.round(km) };
  }
  return best;
}
