import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { routes, duration, fmtDur, slotOf } from "../data.js";
import PageBanner from "../components/PageBanner.jsx";
import Icon from "../components/Icon.jsx";

const SLOTS = ["Morning", "Afternoon", "Evening"];
const fromPorts = [...new Set(routes.map((r) => r.from))];
const toPorts = [...new Set(routes.map((r) => r.to))];
const MAX = Math.max(...routes.map((r) => r.price));

export default function Schedules() {
  const [sp] = useSearchParams();
  const date = sp.get("date") || "";
  const pax = Number(sp.get("pax")) || 1;
  const [from, setFrom] = useState(sp.get("from") || "");
  const [to, setTo] = useState(sp.get("to") || "");
  const [max, setMax] = useState(MAX);
  const [slots, setSlots] = useState([]);
  const [sort, setSort] = useState("dep");

  const list = useMemo(() => {
    const l = routes.filter((r) =>
      (!from || r.from === from) && (!to || r.to === to) && r.price <= max && (!slots.length || slots.includes(slotOf(r))));
    const by = { dep: (a, b) => a.dep.localeCompare(b.dep), price: (a, b) => a.price - b.price, dur: (a, b) => duration(a) - duration(b) };
    return [...l].sort(by[sort]);
  }, [from, to, max, slots, sort]);

  const reset = () => { setFrom(""); setTo(""); setMax(MAX); setSlots([]); };
  const toggle = (s) => setSlots(slots.includes(s) ? slots.filter((x) => x !== s) : [...slots, s]);
  const q = (r) => `/book?route=${r.id}${date ? `&date=${date}` : ""}&pax=${pax}`;

  return (
    <div className="page-bg">
      <PageBanner img="rocks" title="Ferry Schedules" sub="Real-time departure and arrival information." />
      <div className="container section">
        <div className="results">
          <aside className="filters">
            <div className="f-head"><h3>Filters</h3><button onClick={reset}>Reset</button></div>
            <label className="f-group"><span>From</span>
              <select value={from} onChange={(e) => setFrom(e.target.value)}><option value="">Any port</option>{fromPorts.map((p) => <option key={p}>{p}</option>)}</select></label>
            <label className="f-group"><span>To</span>
              <select value={to} onChange={(e) => setTo(e.target.value)}><option value="">Any port</option>{toPorts.map((p) => <option key={p}>{p}</option>)}</select></label>
            <div className="f-group"><span>Max fare <b>₹{max.toLocaleString()}</b></span>
              <input type="range" min="300" max={MAX} step="50" value={max} onChange={(e) => setMax(Number(e.target.value))} /></div>
            <div className="f-group"><span>Departure time</span>
              <div className="chips">{SLOTS.map((s) => <button key={s} type="button" className={slots.includes(s) ? "on" : ""} onClick={() => toggle(s)}>{s}</button>)}</div></div>
          </aside>

          <div>
            <div className="res-head">
              <span><b>{list.length}</b> sailing{list.length !== 1 ? "s" : ""} found{date && <> for <b>{date}</b></>}</span>
              <label>Sort by <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="dep">Earliest departure</option><option value="price">Lowest fare</option><option value="dur">Shortest trip</option></select></label>
            </div>
            {list.length === 0 && <div className="empty"><b>No sailings match your filters.</b><p>Try a different port or a higher fare limit.</p><button className="btn small" onClick={reset}>Clear filters</button></div>}
            {list.map((r) => (
              <article className="res-card" key={r.id}>
                <img src={`/img/${r.img}.jpg`} alt="" loading="lazy" />
                <div className="res-main">
                  <div className="leg"><b>{r.dep}</b><small>{r.from}</small></div>
                  <div className="line"><small>{fmtDur(duration(r))}</small><i /><em>{r.tags.join(" · ")}</em></div>
                  <div className="leg"><b>{r.arr}</b><small>{r.to}</small></div>
                </div>
                <div className="res-price">
                  <div><b>₹{r.price.toLocaleString()}</b><small>per person</small></div>
                  <Link className="btn small" to={q(r)}>Select <Icon name="arrow" size={16} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
