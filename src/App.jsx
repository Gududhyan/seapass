import { Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ScrollFX } from "./components/motion.jsx";
import Icon, { Logo } from "./components/Icon.jsx";
import PageBanner from "./components/PageBanner.jsx";
import Home from "./pages/Home.jsx";
import Schedules from "./pages/Schedules.jsx";
import Book from "./pages/Book.jsx";
import Amenities from "./pages/Amenities.jsx";
import Contact from "./pages/Contact.jsx";
import Auth from "./pages/Auth.jsx";
import { Privacy, Cancellation, Refund, Terms } from "./pages/Policies.jsx";
import WhatsAppIcon from "./components/WhatsAppIcon.jsx";
import { getUser } from "./user.js";
import { CONTACT, waLink } from "./contact.js";

function Header() {
  const [user, setUser] = useState(getUser());
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setUser(getUser());
    addEventListener("authchange", f);
    return () => removeEventListener("authchange", f);
  }, []);
  const links = [["/", "Home"], ["/schedules", "Schedules"], ["/amenities", "Amenities"], ["/contact", "Contact"]];
  return (
    <header className="header on-hero">
      <div className="container nav">
        <Link to="/" className="logo"><Logo /></Link>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <nav className={open ? "open" : ""} onClick={() => setOpen(false)}>
          {links.map(([to, l]) => <NavLink key={to} to={to} end>{l}</NavLink>)}
          {user
            ? <a href="#" onClick={(e) => { e.preventDefault(); localStorage.removeItem("seapass_user"); dispatchEvent(new Event("authchange")); }}>Logout ({user.name})</a>
            : <NavLink to="/auth">Login</NavLink>}
          <Link to="/book" className="btn">Book Now</Link>
        </nav>
      </div>
    </header>
  );
}

function Newsletter() {
  const [done, setDone] = useState(false);
  return done
    ? <p className="nl-done"><Icon name="check" size={18} /> Thanks, you are on the list.</p>
    : (
      <form className="nl-form" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
        <input type="email" required placeholder="Your email address" aria-label="Email address" />
        <button className="btn">Subscribe</button>
      </form>
    );
}

function Footer() {
  const { pathname } = useLocation();
  // Inner pages get a slim one-row footer so the page needs less scrolling.
  if (pathname !== "/") {
    return (
      <footer className="footer compact">
        <div className="container fc-row">
          <Link to="/" className="fc-logo"><Logo light /></Link>
          <nav className="fc-links">
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/cancellation-policy">Cancellation</Link>
            <Link to="/refund-policy">Refund</Link>
            <Link to="/terms-conditions">Terms</Link>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </nav>
          <span className="fc-copy">© {new Date().getFullYear()} SeaPass · Photos via <a href="https://www.pexels.com" target="_blank" rel="noopener">Pexels</a></span>
        </div>
      </footer>
    );
  }
  return (
    <footer className="footer">
      <div className="container newsletter">
        <div><h3>Get fare alerts and offers</h3><p>Join our list for new routes, seasonal fares and promo codes. No spam.</p></div>
        <Newsletter />
      </div>
      <div className="container cols">
        <div><h4><Logo light /></h4><p>Premium ferry services connecting you across the sea. Safe, comfortable, and reliable transport.</p></div>
        <div><h4>Explore</h4><Link to="/schedules">Schedules</Link><Link to="/book">Book</Link><Link to="/amenities">Amenities</Link><Link to="/contact">Contact</Link></div>
        <div><h4>Legal</h4><Link to="/privacy-policy">Privacy Policy</Link><Link to="/cancellation-policy">Cancellation Policy</Link><Link to="/refund-policy">Refund Policy</Link><Link to="/terms-conditions">Terms &amp; Conditions</Link></div>
        <div><h4>Get in touch</h4><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a><a href={CONTACT.map} target="_blank" rel="noopener">Bengaluru, India</a></div>
      </div>
      <div className="container fbottom">
        <span>© {new Date().getFullYear()} SeaPass. All rights reserved. · Photography via <a href="https://www.pexels.com" target="_blank" rel="noopener">Pexels</a></span>
        <div className="paybadges" aria-label="Accepted payment methods"><span>UPI</span><span>Cards</span><span>Net banking</span><span>Wallets</span></div>
      </div>
    </footer>
  );
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const NotFound = () => (
  <div className="page-bg">
    <PageBanner img="pier" title="Page not found" sub="The page you are looking for has drifted out to sea." />
    <div className="container section"><Link to="/" className="btn">Back to home</Link></div>
  </div>
);

export default function App() {
  return (
    <>
      <ScrollFX /><ScrollTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/book" element={<Book />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/cancellation-policy" element={<Cancellation />} />
          <Route path="/refund-policy" element={<Refund />} />
          <Route path="/terms-conditions" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <a className="wa-float" href={waLink("Hello SeaPass team, I need some help.")} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
        <WhatsAppIcon size={30} />
        <span>Chat with us</span>
      </a>
    </>
  );
}
