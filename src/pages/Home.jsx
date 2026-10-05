import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { features, faqs, routes, amenities, OFFERS } from "../data.js";
import { Reveal, CountUp } from "../components/motion.jsx";
import HeroScene from "../components/HeroScene.jsx";
import Field from "../components/Field.jsx";
import Icon from "../components/Icon.jsx";

const fromPorts = [...new Set(routes.map((r) => r.from))];
const toPorts = [...new Set(routes.map((r) => r.to))];

// Booking-style search card: From / To / Date / Passengers.
function SearchCard() {
  const nav = useNavigate();
  const [f, setF] = useState({ from: "", to: "", date: "", pax: 1 });
  const today = new Date().toISOString().slice(0, 10);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => v && p.set(k, v));
    nav(`/schedules?${p}`);
  };
  return (
    <form className="searchbar" onSubmit={submit}>
      <Field as="select" label="From" icon="pin" value={f.from} onChange={set("from")}>
        <option value="">Any port</option>{fromPorts.map((p) => <option key={p}>{p}</option>)}
      </Field>
      <Field as="select" label="To" icon="pin" value={f.to} onChange={set("to")}>
        <option value="">Any port</option>{toPorts.map((p) => <option key={p}>{p}</option>)}
      </Field>
      <Field type="date" label="Travel date" icon="calendar" min={today} value={f.date} onChange={set("date")} />
      <Field as="select" label="Passengers" icon="user" value={f.pax} onChange={set("pax")}>
        {Array.from({ length: 10 }, (_, i) => <option key={i} value={i + 1}>{i + 1} passenger{i ? "s" : ""}</option>)}
      </Field>
      <button className="btn big">Search ferries</button>
    </form>
  );
}

function CopyCode({ code }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(code); } catch { /* clipboard unavailable */ }
    setDone(true); setTimeout(() => setDone(false), 1800);
  };
  return <button type="button" className="offer-code" onClick={copy} title="Copy code">{done ? "Copied" : code}</button>;
}

const SectionHead = ({ eyebrow, title, sub }) => (
  <Reveal className="sh"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{sub && <p className="sub">{sub}</p>}</Reveal>
);

export default function Home() {
  const [open, setOpen] = useState(0);
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <HeroScene />
        <div className="hero-inner container">
          <h1 className="fade-in">Sail in comfort,<br />arrive in style.</h1>
          <p className="fade-in d1">Premium ferry services connecting you to your destination with comfort, safety, and style.</p>
          <div className="row fade-in d2"><Link to="/book" className="btn big orange">Book Your Trip</Link><Link to="/schedules" className="btn big glass">View Schedules</Link></div>
        </div>
        <a href="#search" className="mouse" aria-label="Scroll down"><i /></a>
      </section>

      <section id="search" className="search-strip container fade-in d3"><SearchCard /></section>

      {/* STATS */}
      <section className="container">
        <div className="stats">
          {[[250000, "+", "Passengers carried"], [18, "", "Routes served"], [99, "%", "On-time sailings"], [12, "", "Years at sea"]].map(([n, s, l], i) => (
            <Reveal key={l} delay={i * 90} className="stat"><b><CountUp to={n} suffix={s} /></b><span>{l}</span></Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="container section screen">
        <SectionHead eyebrow="Why SeaPass" title="Travel the way the sea intended" sub="Experience excellence in maritime transportation with our premium services." />
        <div className="grid g3">
          {features.map(([t, d, ic], i) => (
            <Reveal key={t} delay={i * 70} className="card feat"><div className="cicon"><Icon name={ic} size={26} /></div><h3>{t}</h3><p>{d}</p></Reveal>
          ))}
        </div>
      </section>

      {/* POPULAR ROUTES */}
      <section className="alt section screen">
        <div className="container">
          <SectionHead eyebrow="Popular routes" title="Where are you headed?" sub="Pick a sailing and book in under two minutes." />
          <div className="grid g3">
            {routes.map((r, i) => (
              <Reveal key={r.id} delay={i * 70}>
                <Link to={`/book?route=${r.id}`} className="route-card">
                  <div className="rc-img"><img src={`/img/${r.img}.jpg`} alt="" loading="lazy" /><span className="rc-price">from ₹{r.price}</span></div>
                  <div className="rc-body">
                    <div className="rc-top"><b>{r.from}</b><Icon name="arrow" size={18} /><b>{r.to}</b></div>
                    <div className="rc-bot"><Icon name="clock" size={16} /> {r.dep} – {r.arr}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="center-cta"><Link to="/schedules" className="btn ghost">View all schedules</Link></Reveal>
        </div>
      </section>

      {/* OFFERS */}
      <section className="container section offers">
        <SectionHead eyebrow="Offers" title="Save on your next crossing" sub="Tap a code to copy it, then paste it at checkout." />
        <div className="grid g3">
          {OFFERS.map((o, i) => (
            <Reveal key={o.code} delay={i * 80}>
              <div className="offer">
                <img src={`/img/${o.img}.jpg`} alt="" loading="lazy" />
                <div className="offer-body">
                  <CopyCode code={o.code} />
                  <h3>{o.title}</h3>
                  <p>{o.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AMENITIES STRIP */}
      <section className="marquee-wrap" aria-label="Amenities">
        <div className="marquee">
          {[...amenities, ...amenities].map(([t], i) => <span key={i}>{t}</span>)}
        </div>
      </section>

      {/* ONBOARD */}
      <section className="container section split screen">
        <Reveal dir="left" className="split-art">
          <img src="/img/passengers.jpg" alt="Passengers enjoying the sea breeze on the open deck" loading="lazy" />
          <img className="inset" src="/img/deck.jpg" alt="Covered passenger deck with benches" loading="lazy" />
        </Reveal>
        <Reveal dir="right">
          <span className="eyebrow">Onboard experience</span>
          <h2>Comfort that moves with you</h2>
          <ul className="ticks">
            {amenities.slice(0, 5).map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
          </ul>
          <Link to="/amenities" className="btn">Explore amenities</Link>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="container section screen">
        <div className="faq-layout">
          <Reveal dir="left" className="faq-intro">
            <span className="eyebrow">FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <p className="sub">Can't find what you need? Our team is a message away.</p>
            <Link to="/contact" className="btn">Contact support</Link>
          </Reveal>
          <div>
            {faqs.map(([q, a], i) => (
              <Reveal key={q} delay={i * 60} className={`faq ${open === i ? "open" : ""}`}>
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{q}<span className="plus" /></button>
                <div className="faq-body"><p>{a}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
