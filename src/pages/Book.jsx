import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { routes, PROMOS, fmtDur } from "../data.js";
import { getSailings, countSailings, nextAvailable, seaState, holdSeats, todayISO, addDays, fmtDate } from "../api/ferryApi.js";
import { useSeaForecasts } from "../api/useSea.js";
import { getUser } from "../user.js";
import Field from "../components/Field.jsx";
import Icon from "../components/Icon.jsx";
import PageBanner from "../components/PageBanner.jsx";
import DateStrip from "../components/DateStrip.jsx";
import { SeaBadge, SeatBadge } from "../components/Badges.jsx";

const blank = () => ({ name: "", age: "", gender: "" });
const STEPS = ["Journey", "Passengers", "Contact", "Review & pay"];
const cls = ["Economy", "Premium Lounge", "Business"];
const classMult = [1, 1.35, 1.8];

export default function Book() {
  const [params] = useSearchParams();
  const user = getUser();
  const [step, setStep] = useState(0);
  const [routeId, setRouteId] = useState(Number(params.get("route")) || routes[0].id);
  const wanted = params.get("date");
  const [date, setDate] = useState(wanted && wanted >= todayISO() ? wanted : todayISO());
  const [dep, setDep] = useState(params.get("dep") || "");
  const [data, setData] = useState(null); // sailings for this route and date; null while loading
  const [tier, setTier] = useState(0);
  const [pax, setPax] = useState(() => Array.from({ length: Math.min(10, Math.max(1, Number(params.get("pax")) || 1)) }, blank));
  const [vehicles, setVehicles] = useState(0);
  const [contact, setContact] = useState({ name: user?.name || "", email: user?.email || "", phone: "", notes: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [code, setCode] = useState("");
  const [promo, setPromo] = useState(null);
  const [promoErr, setPromoErr] = useState("");

  const route = routes.find((r) => r.id === routeId);

  // Load this route's sailings whenever the route or date changes.
  useEffect(() => {
    let live = true;
    setData(null);
    getSailings({ routeId, date }).then((r) => {
      if (!live) return;
      setData(r);
      // Keep the chosen departure if it still exists, otherwise pick the first one with seats.
      setDep((cur) => (r.sailings.some((s) => s.dep === cur) ? cur : r.sailings.find((s) => s.seats > 0)?.dep || ""));
    });
    return () => { live = false; };
  }, [routeId, date]);

  const counts = useMemo(() => Object.fromEntries(Array.from({ length: 14 }, (_, i) => {
    const d = addDays(todayISO(), i);
    return [d, countSailings({ routeId, date: d })];
  })), [routeId]);

  const sea = useSeaForecasts([route.from]);
  const seaNow = seaState(sea, route.from, date);
  const sailing = data?.sailings.find((s) => s.dep === dep) || null;
  const next = data && !data.sailings.length ? nextAvailable({ routeId, date }) : null;

  const fare = Math.round((sailing ? sailing.price : route.price) * classMult[tier]);
  const sub = pax.length * fare + vehicles * route.vehicle;

  // A promo is re-checked whenever passengers or date change.
  const promoIssue = (p) => {
    if (p.minPax && pax.length < p.minPax) return `Needs ${p.minPax}+ passengers`;
    if (p.weekdays) {
      const d = new Date(`${date}T00:00:00`).getDay();
      if (d === 0 || d > 4) return "Valid for Monday to Thursday only";
    }
    return "";
  };
  const issue = promo ? promoIssue(promo) : "";
  const discount = promo && !issue ? Math.round((sub * promo.pct) / 100) : 0;
  const fee = Math.round((sub - discount) * 0.03);
  const total = sub - discount + fee;

  const applyPromo = () => {
    const c = code.trim().toUpperCase();
    const p = PROMOS[c];
    if (!p) { setPromo(null); return setPromoErr("This promo code is not valid"); }
    const why = promoIssue(p);
    if (why) { setPromo(null); return setPromoErr(why); }
    setPromo({ ...p, code: c }); setPromoErr("");
  };

  const setP = (i, k, v) => setPax(pax.map((p, j) => (j === i ? { ...p, [k]: v } : p)));

  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!sailing) e.sailing = data && !data.sailings.length ? "No ferries on this date. Pick another day." : "Choose a departure";
      else if (sailing.seats === 0) e.sailing = "This sailing is sold out";
    }
    if (s === 1) {
      if (sailing && pax.length > sailing.seats) e.pax = `Only ${sailing.seats} seats are left on this sailing.`;
      pax.forEach((p, i) => {
        if (!p.name.trim()) e[`n${i}`] = "Required";
        if (p.age === "" || p.age < 0 || p.age > 120) e[`a${i}`] = "Invalid age";
      });
    }
    if (s === 2) {
      if (!contact.name.trim()) e.cname = "Required";
      if (!/^\S+@\S+\.\S+$/.test(contact.email)) e.email = "Enter a valid email";
      if (!/^[+\d\s-]{8,15}$/.test(contact.phone)) e.phone = "Enter a valid phone number";
    }
    if (s === 3 && !agree) e.agree = "Please accept the terms to continue";
    setErrors(e);
    return !Object.keys(e).length;
  };
  const next_ = () => validate(step) && setStep(step + 1);
  const back = () => { setErrors({}); setStep(step - 1); };

  const pay = (e) => {
    e.preventDefault();
    if (!validate(3)) return;
    setPaying(true);
    // Placeholder for a real payment gateway (e.g. Razorpay checkout).
    setTimeout(() => {
      holdSeats(sailing.key, pax.length); // seats left drops for the next search
      setTicket({ id: "SP" + Math.random().toString(36).slice(2, 8).toUpperCase(), route, sailing, date, pax, vehicles, total, tier: cls[tier] });
      setPaying(false);
    }, 1400);
  };

  if (ticket) return (
    <div className="page-bg">
      <PageBanner img="island" crumb="Confirmation" title="Booking confirmed" sub={`A confirmation has been sent to ${contact.email}.`} />
      <div className="container section narrow">
        <div className="ticket">
          <div className="t-main">
            <small>BOARDING PASS</small>
            <div className="t-route"><b>{ticket.route.from}</b><Icon name="arrow" size={26} /><b>{ticket.route.to}</b></div>
            <div className="t-grid">
              <div><small>Date</small><b>{fmtDate(ticket.date)}</b></div><div><small>Departs</small><b>{ticket.sailing.dep}</b></div>
              <div><small>Class</small><b>{ticket.tier}</b></div><div><small>Passengers</small><b>{ticket.pax.length}</b></div>
            </div>
            <p className="t-names">{ticket.pax.map((p) => p.name).join(" · ")}</p>
          </div>
          <div className="t-stub"><small>Ticket</small><b>{ticket.id}</b><div className="qr" /><small>Paid ₹{ticket.total.toLocaleString()}</small></div>
        </div>
        <div className="row"><button className="btn" onClick={() => window.print()}>Print ticket</button></div>
      </div>
    </div>
  );

  return (
    <div className="page-bg">
      <PageBanner img="island" pos="center 40%" crumb="Book" title="Book your ticket" sub="Fast and easy ferry ticket booking." />
      <div className="container section book">
        <ol className="stepper">
          {STEPS.map((s, i) => (
            <li key={s} className={i < step ? "done" : i === step ? "now" : ""}><span>{i < step ? <Icon name="check" size={16} /> : i + 1}</span><em>{s}</em></li>
          ))}
        </ol>
        <div className="book-grid">
          <form className="panel" onSubmit={pay} noValidate>
            <div key={step} className="step-pane">
              {step === 0 && (<>
                <h2>Choose your journey</h2>
                <Field as="select" label="Route" icon="compass" value={routeId} onChange={(e) => { setRouteId(Number(e.target.value)); setVehicles(0); }}>
                  {routes.map((r) => <option key={r.id} value={r.id}>{r.from} → {r.to}</option>)}
                </Field>

                <div className="fl-label">Travel date</div>
                <DateStrip value={date} onChange={setDate} counts={counts} />

                <div className="fl-label">Departure on {fmtDate(date)} <SeaBadge s={seaNow} /></div>
                {!data && [0, 1].map((i) => <div className="skel sm" key={i} />)}
                {data && data.sailings.length === 0 && (
                  <div className="empty tight">
                    <b>No {route.from} to {route.to} ferry on {fmtDate(date)}.</b>
                    {data.paused[0] && <p>This service {data.paused[0].reason}.</p>}
                    {next && <button type="button" className="btn small" onClick={() => setDate(next)}>Next sailing: {fmtDate(next)}</button>}
                  </div>
                )}
                {data && data.sailings.length > 0 && (
                  <div className="deps" role="radiogroup" aria-label="Departure time">
                    {data.sailings.map((s) => (
                      <button type="button" key={s.key} role="radio" aria-checked={dep === s.dep} disabled={s.seats === 0}
                        className={`dep ${dep === s.dep ? "on" : ""}`} onClick={() => setDep(s.dep)}>
                        <span className="dep-times"><b>{s.dep}</b><Icon name="arrow" size={14} /><b>{s.arr}{s.nextDay && <sup>+1</sup>}</b></span>
                        <span className="dep-meta"><small>{fmtDur(s.dur)}</small><SeatBadge seats={s.seats} /></span>
                        <span className="dep-price">₹{s.price.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                )}
                {errors.sailing && <small className="ferr show">{errors.sailing}</small>}

                <div className="tiers">
                  {cls.map((c, i) => (
                    <button type="button" key={c} className={`tier ${tier === i ? "on" : ""}`} onClick={() => setTier(i)}>
                      <b>{c}</b><span>₹{Math.round((sailing ? sailing.price : route.price) * classMult[i])}</span>
                      <small>{["Standard seating", "Recliners & snacks", "Private cabin & dining"][i]}</small>
                    </button>
                  ))}
                </div>
              </>)}

              {step === 1 && (<>
                <h2>Passenger details</h2>
                {errors.pax && <div className="err">{errors.pax}</div>}
                {pax.map((p, i) => (
                  <div className="pax" key={i}>
                    <div className="pax-h"><b>Passenger {i + 1}</b>{pax.length > 1 && <button type="button" onClick={() => setPax(pax.filter((_, j) => j !== i))}>Remove</button>}</div>
                    <div className="fgrid">
                      <Field label="Full name (as on ID)" icon="user" value={p.name} error={errors[`n${i}`]} onChange={(e) => setP(i, "name", e.target.value)} />
                      <Field type="number" label="Age" value={p.age} error={errors[`a${i}`]} onChange={(e) => setP(i, "age", e.target.value)} />
                      <Field as="select" label="Gender" value={p.gender} onChange={(e) => setP(i, "gender", e.target.value)}>
                        <option value="" disabled>Select</option><option>Female</option><option>Male</option><option>Other</option>
                      </Field>
                    </div>
                  </div>
                ))}
                {pax.length < 10 && <button type="button" className="btn ghost small" onClick={() => setPax([...pax, blank()])}>+ Add passenger</button>}
                {route.vehicle > 0 && (
                  <div className="stepper-num"><div><b>Vehicles</b><small>₹{route.vehicle.toLocaleString()} each</small></div>
                    <div className="qty"><button type="button" onClick={() => setVehicles(Math.max(0, vehicles - 1))}>−</button><span>{vehicles}</span><button type="button" onClick={() => setVehicles(Math.min(5, vehicles + 1))}>+</button></div></div>
                )}
              </>)}

              {step === 2 && (<>
                <h2>Contact details</h2>
                {!user && <div className="note">Please login or continue as guest.</div>}
                <Field label="Contact name" icon="user" value={contact.name} error={errors.cname} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                <div className="fgrid two">
                  <Field type="email" label="Email" icon="mail" value={contact.email} error={errors.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                  <Field type="tel" label="Phone" icon="phone" value={contact.phone} error={errors.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                </div>
                <Field as="textarea" rows="3" label="Special requests (optional)" value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} />
              </>)}

              {step === 3 && (<>
                <h2>Review &amp; pay</h2>
                <div className="review-box">
                  <p><b>{route.from} → {route.to}</b> · {fmtDate(date)} · {sailing?.dep}</p>
                  <p>{cls[tier]} · {pax.length} passenger{pax.length > 1 ? "s" : ""}{vehicles ? ` · ${vehicles} vehicle${vehicles > 1 ? "s" : ""}` : ""}</p>
                  <p>{contact.name} · {contact.email} · {contact.phone}</p>
                </div>
                {seaNow.status === "ok" && seaNow.level === "rough" && (
                  <div className="err">The sea forecast for {route.from} on this date is rough ({seaNow.wave.toFixed(1)} m waves). Sailings may be delayed or cancelled. See the cancellation policy below.</div>
                )}
                <div className="cancel-box">
                  <b>Cancellation policy</b>
                  <ul><li><span className="pct p100">100%</span> refund more than 24 hours before departure</li>
                    <li><span className="pct p50">50%</span> refund 6 to 24 hours before departure</li>
                    <li><span className="pct p0">0%</span> refund under 6 hours or no-show</li></ul>
                  <Link to="/cancellation-policy" target="_blank">Cancellation policy</Link> · <Link to="/refund-policy" target="_blank">Refund policy</Link>
                </div>
                <label className="check-row"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span>I accept the Terms &amp; Conditions, Cancellation Policy and Refund Policy.</span></label>
                {errors.agree && <small className="ferr show">{errors.agree}</small>}
                <p className="note"><Icon name="lock" size={16} /> Secure payment gateway — your payment information is protected.</p>
              </>)}
            </div>
            <div className="actions">
              {step > 0 ? <button type="button" className="btn ghost" onClick={back}>← Back</button> : <span />}
              {step < 3
                ? <button type="button" className="btn" onClick={next_}>Continue →</button>
                : <button className="btn" disabled={paying}>{paying ? <><i className="spin" /> Processing…</> : `Pay ₹${total.toLocaleString()}`}</button>}
            </div>
          </form>

          <aside className="summary">
            <h3>Trip summary</h3>
            <div className="s-route"><b>{route.from}</b><Icon name="arrow" size={20} /><b>{route.to}</b></div>
            <small className="s-time">{fmtDate(date)} · {sailing ? `${sailing.dep} → ${sailing.arr}` : "Select a departure"}</small>
            <dl>
              <dt>{pax.length} × {cls[tier]}</dt><dd>₹{(pax.length * fare).toLocaleString()}</dd>
              {vehicles > 0 && <><dt>{vehicles} × Vehicle</dt><dd>₹{(vehicles * route.vehicle).toLocaleString()}</dd></>}
              {discount > 0 && <><dt className="disc">Promo {promo.code}</dt><dd className="disc">−₹{discount.toLocaleString()}</dd></>}
              <dt>Service fee (3%)</dt><dd>₹{fee.toLocaleString()}</dd>
            </dl>
            <div className="promo">
              <input placeholder="Promo code" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())} aria-label="Promo code" />
              <button type="button" onClick={applyPromo}>Apply</button>
            </div>
            {(promoErr || issue) && <small className="perr">{promoErr || issue}</small>}
            {discount > 0 && <small className="pok">Promo applied. You save ₹{discount.toLocaleString()}.</small>}
            <div className="s-total"><span>Total</span><b>₹{total.toLocaleString()}</b></div>
            <ul className="s-trust">
              <li><Icon name="check" size={15} /> Free cancellation up to 24h before departure</li>
              <li><Icon name="check" size={15} /> Instant e-ticket by email</li>
              <li><Icon name="check" size={15} /> Secure, encrypted payment</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
