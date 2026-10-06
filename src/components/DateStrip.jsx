import { useEffect, useRef } from "react";
import { addDays, fromISO, todayISO, WEEKDAYS, MONTHS } from "../api/ferryApi.js";
import Icon from "./Icon.jsx";

// Scrollable row of the next 14 days. `counts` ({ iso: number }) shows how many sailings run each day.
export default function DateStrip({ value, onChange, counts, days = 14 }) {
  const rail = useRef(null);
  const start = todayISO();
  const list = Array.from({ length: days }, (_, i) => addDays(start, i));
  const last = list[list.length - 1];

  // Keep the selected day in view.
  useEffect(() => {
    const el = rail.current?.querySelector(".day.on");
    if (el && rail.current) rail.current.scrollTo({ left: el.offsetLeft - rail.current.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [value]);

  const scroll = (dir) => rail.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <div className="datebar">
      <button type="button" className="rail-btn" onClick={() => scroll(-1)} aria-label="Earlier dates"><Icon name="arrow" size={16} style={{ transform: "rotate(180deg)" }} /></button>
      <div className="datestrip" ref={rail} role="listbox" aria-label="Travel date">
        {list.map((iso, i) => {
          const d = fromISO(iso), n = counts?.[iso];
          return (
            <button key={iso} type="button" role="option" aria-selected={iso === value}
              className={`day ${iso === value ? "on" : ""} ${n === 0 ? "none" : ""}`} onClick={() => onChange(iso)}>
              <small>{i === 0 ? "Today" : WEEKDAYS[d.getDay()]}</small>
              <b>{d.getDate()}</b>
              <small>{MONTHS[d.getMonth()]}</small>
              {counts && <i>{n === 0 ? "No ferry" : `${n} sailing${n > 1 ? "s" : ""}`}</i>}
            </button>
          );
        })}
      </div>
      <button type="button" className="rail-btn" onClick={() => scroll(1)} aria-label="Later dates"><Icon name="arrow" size={16} /></button>
      <label className="moredate">
        <span>Other date</span>
        <input type="date" min={start} value={value} onChange={(e) => e.target.value && e.target.value >= start && onChange(e.target.value)} />
        {value > last && <em>Selected</em>}
      </label>
    </div>
  );
}
