import { useEffect, useId, useRef, useState } from "react";
import { ports } from "../data.js";
import { searchTerminals } from "../api/portsApi.js";
import Icon from "./Icon.jsx";

// Searchable port picker. Lists the ports SeaPass serves, then real ferry terminals across India
// (OpenStreetMap via Photon). The general list is fetched as soon as the picker mounts, because the free
// Photon server can take several seconds; typing filters that list at once and refines it from the API.
// variant "field" matches the floating-label inputs; "plain" is for filter sidebars.
export default function PortSelect({ label, value, onChange, served = ports, icon = "pin", variant = "field", anyLabel = "Any port" }) {
  const listId = useId();
  const box = useRef(null);
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(false);
  const [base, setBase] = useState(undefined);     // general list: undefined = loading, null = failed
  const [remote, setRemote] = useState(undefined); // results for the typed query
  const [active, setActive] = useState(-1);

  useEffect(() => setText(value), [value]);

  useEffect(() => {
    let live = true;
    searchTerminals("").then((r) => live && setBase(r));
    return () => { live = false; };
  }, []);

  const query = typed ? text.trim() : "";
  const searching = query.length >= 2;
  useEffect(() => {
    setRemote(undefined);
    if (!open || !searching) return;
    let live = true;
    const t = setTimeout(() => searchTerminals(query).then((r) => live && setRemote(r)), 350);
    return () => { live = false; clearTimeout(t); };
  }, [open, searching, query]);

  // Close when clicking elsewhere and restore the chosen value.
  useEffect(() => {
    const h = (e) => { if (!box.current?.contains(e.target)) { setOpen(false); setTyped(false); setText(value); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [value]);

  const q = query.toLowerCase();
  const mine = served.filter((p) => !q || p.toLowerCase().includes(q));
  const source = searching ? (remote ?? (base || []).filter((p) => p.name.toLowerCase().includes(q))) : base;
  const others = (source || []).filter((p) => !served.includes(p.name));
  const items = [...(value ? [{ name: "" }] : []), ...mine.map((name) => ({ name })), ...others];

  const pick = (name) => { onChange(name); setText(name); setOpen(false); setTyped(false); setActive(-1); };
  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(items.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Enter" && open && active >= 0) { e.preventDefault(); pick(items[active].name); }
    else if (e.key === "Escape") { setOpen(false); setTyped(false); setText(value); }
  };

  let idx = -1;
  const opt = (name, body) => {
    idx += 1;
    const i = idx;
    return (
      <button type="button" role="option" aria-selected={name === value} key={`${name}|${i}`}
        className={`opt ${i === active ? "act" : ""}`} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(name)} onMouseEnter={() => setActive(i)}>
        {body}
      </button>
    );
  };

  return (
    <div ref={box} className={variant === "field" ? "field has-icon combo" : "combo plain"}>
      {variant === "field" && <span className="ficon"><Icon name={icon} size={20} /></span>}
      <input
        role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list" autoComplete="off"
        value={text} placeholder={anyLabel}
        onFocus={(e) => { setOpen(true); e.target.select(); }}
        onChange={(e) => { setText(e.target.value); setTyped(true); setOpen(true); setActive(-1); }}
        onKeyDown={onKey}
      />
      {variant === "field" && <span className="flabel">{label}</span>}

      {open && (
        <div className="combo-list" role="listbox" id={listId}>
          {value && opt("", <span className="o-name">{anyLabel}</span>)}
          {mine.length > 0 && <div className="grp">SeaPass ports</div>}
          {mine.map((name) => opt(name, <><span className="o-name">{name}</span><small className="avail">Sailings available</small></>))}
          <div className="grp">Other ferry terminals in India <small>OpenStreetMap</small></div>
          {!searching && base === undefined && <div className="combo-note">Loading terminals…</div>}
          {!searching && base === null && <div className="combo-note warn">Could not load more terminals right now.</div>}
          {others.map((p) => opt(p.name, <><span className="o-name">{p.name}</span><small>{p.state}{p.state && " · "}no SeaPass service yet</small></>))}
          {searching && remote === undefined && <div className="combo-note">Searching more terminals…</div>}
          {source && others.length === 0 && !(searching && remote === undefined) && <div className="combo-note">No other terminals match.</div>}
        </div>
      )}
    </div>
  );
}
