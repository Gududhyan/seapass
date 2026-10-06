import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { routes, ports, fmtDur, slotOf } from "../data.js";
import { resolvePlace, nearestServed } from "../api/portsApi.js";
import PortSelect from "../components/PortSelect.jsx";
import { getSailings, countSailings, nextAvailable, seaState, todayISO, addDays, fmtDate } from "../api/ferryApi.js";
import { useSeaForecasts } from "../api/useSea.js";
import PageBanner from "../components/PageBanner.jsx";
import DateStrip from "../components/DateStrip.jsx";
import { SeaBadge, SeatBadge } from "../components/Badges.jsx";
import Icon from "../components/Icon.jsx";

const SLOTS = ["Morning", "Afternoon", "Evening"];
const fromPorts = [...new Set(routes.map((r) => r.from))];
const toPorts = [...new Set(routes.map((r) => r.to))];
const MAX = Math.max(...routes.map((r) => r.price * 1.1));

export default function Schedules() {
  const [sp] = useSearchParams();
  const pax = Number(sp.get("pax")) || 1;
  const wanted = sp.get("date");
  const [date, setDate] = useState(wanted && wanted >= todayISO() ? wanted : todayISO());
  const [from, setFrom] = useState(sp.get("from") || "");
  const [to, setTo] = useState(sp.get("to") || "");
  const [max, setMax] = useState(MAX);
  const [slots, setSlots] = useState([]);
  const [sort, setSort] = useState("dep");
  const [data, setData] = useState(null); // null while loading

  useEffect(() => {
    let live = true;
    setData(null);
    getSailings({ from, to, date }).then((r) => live && setData(r));
    return () => { live = false; };
  }, [from, to, date]);

  // A terminal picked from the OpenStreetMap list that we do not serve has no sailings: find the nearest port we do serve.
  const unserved = [from, to].find((p) => p && !ports.includes(p)) || "";
  const [near, setNear] = useState(null);
  useEffect(() => {
    let live = true;
    setNear(null);
    if (unserved) resolvePlace(unserved).then((c) => live && c && setNear(nearestServed(c)));
    return () => { live = false; };
  }, [unserved]);
  const useNearest = () => { if (from === unserved) setFrom(near.port); if (to === unserved) setTo(near.port); };

  // How many sailings run on each of the next 14 days for the current port filters.
  const counts = useMemo(() => Object.fromEntries(Array.from({ length: 14 }, (_, i) => {
    const d = addDays(todayISO(), i);
    return [d, countSailings({ from, to, date: d })];
  })), [from, to]);

  const sea = useSeaForecasts(data ? data.sailings.map((s) => s.from) : []);

  const list = useMemo(() => {
    if (!data) return [];
    const l = data.sailings.filter((s) => s.price <= max && (!slots.length || slots.includes(slotOf(s.dep))));
    const by = { dep: (a, b) => a.dep.localeCompare(b.dep), price: (a, b) => a.price - b.price, dur: (a, b) => a.dur - b.dur };
    return [...l].sort(by[sort]);
  }, [data, max, slots, sort]);

  const reset = () => { setFrom(""); setTo(""); setMax(MAX); setSlots([]); };
  const toggle = (s) => setSlots(slots.includes(s) ? slots.filter((x) => x !== s) : [...slots, s]);
  const next = data && !data.sailings.length ? nextAvailable({ from, to, date }) : null;

  return (
    <div className="page-bg">
      <PageBanner img="rocks" title="Ferry Schedules" sub="Live departures by date, with real sea conditions." />
      <div className="container section">
        <DateStrip value={date} onChange={setDate} counts={counts} />
        <div className="results">
          <aside className="filters">
            <div className="f-head"><h3>Filters</h3><button onClick={reset}>Reset</button></div>
            <div className="f-group"><span>From</span><PortSelect variant="plain" value={from} onChange={setFrom} served={fromPorts} /></div>
            <div className="f-group"><span>To</span><PortSelect variant="plain" value={to} onChange={setTo} served={toPorts} /></div>
            <div className="f-group"><span>Max fare <b>₹{Math.round(max).toLocaleString()}</b></span>
              <input type="range" min="300" max={Math.round(MAX)} step="50" value={Math.min(max, Math.round(MAX))} onChange={(e) => setMax(Number(e.target.value))} /></div>
            <div className="f-group"><span>Departure time</span>
              <div className="chips">{SLOTS.map((s) => <button key={s} type="button" className={slots.includes(s) ? "on" : ""} onClick={() => toggle(s)}>{s}</button>)}</div></div>
            <p className="sea-note">Sea conditions come from the Open-Meteo Marine API.</p>
          </aside>

          <div>
            <div className="res-head">
              <span>{data ? <><b>{list.length}</b> sailing{list.length !== 1 ? "s" : ""} on <b>{fmtDate(date)}</b></> : "Loading sailings…"}</span>
              <label>Sort by <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="dep">Earliest departure</option><option value="price">Lowest fare</option><option value="dur">Shortest trip</option></select></label>
            </div>

            {!data && [0, 1, 2, 3].map((i) => <div className="skel" key={i} />)}

            {data && data.sailings.length === 0 && (
              <div className="empty">
                {unserved ? (<>
                  <b>SeaPass has no sailings to or from {unserved} yet.</b>
                  <p className="near">It is a real ferry terminal listed on OpenStreetMap, but it is not one of our ports.
                    {near && <> The nearest SeaPass port is <b>{near.port}</b>, about {near.km} km away.</>}</p>
                  {near
                    ? <button className="btn small" onClick={useNearest}>Show sailings for {near.port}</button>
                    : <button className="btn small" onClick={reset}>Clear filters</button>}
                </>) : (<>
                  <b>No ferries sail on {fmtDate(date)} for this route.</b>
                  {data.paused[0] && <p>{data.paused.slice(0, 2).map((p) => `${p.route.from} to ${p.route.to} ${p.reason}`).join(". ")}.</p>}
                  {next
                    ? <button className="btn small" onClick={() => setDate(next)}>Next sailing: {fmtDate(next)}</button>
                    : <button className="btn small" onClick={reset}>Clear filters</button>}
                </>)}
              </div>
            )}

            {data && data.sailings.length > 0 && list.length === 0 && (
              <div className="empty"><b>No sailings match your filters.</b><p>Try a higher fare limit or another time of day.</p><button className="btn small" onClick={reset}>Clear filters</button></div>
            )}

            {list.map((s) => {
              const tooFew = pax > s.seats;
              return (
                <article className={`res-card ${s.seats === 0 ? "soldout" : ""}`} key={s.key}>
                  <img src={`/img/${s.img}.jpg`} alt="" loading="lazy" />
                  <div className="res-mid">
                    <div className="res-main">
                      <div className="leg"><b>{s.dep}</b><small>{s.from}</small></div>
                      <div className="line"><small>{fmtDur(s.dur)}</small><i /><em>{s.tags.join(" · ")}</em></div>
                      <div className="leg"><b>{s.arr}{s.nextDay && <sup>+1</sup>}</b><small>{s.to}</small></div>
                    </div>
                    <div className="res-badges"><SeatBadge seats={s.seats} /><SeaBadge s={seaState(sea, s.from, date)} /></div>
                  </div>
                  <div className="res-price">
                    <div><b>₹{s.price.toLocaleString()}</b><small>per person</small></div>
                    {s.seats === 0
                      ? <span className="btn small disabled" aria-disabled="true">Sold out</span>
                      : tooFew
                        ? <span className="btn small disabled" title={`Only ${s.seats} seats left for ${pax} passengers`} aria-disabled="true">Not enough seats</span>
                        : <Link className="btn small" to={`/book?route=${s.routeId}&dep=${s.dep}&date=${s.date}&pax=${pax}`}>Select <Icon name="arrow" size={16} /></Link>}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
