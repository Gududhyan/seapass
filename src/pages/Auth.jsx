import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Field from "../components/Field.jsx";
import Icon from "../components/Icon.jsx";

// Demo auth: accounts live in localStorage. Replace with a real backend for production.
export default function Auth() {
  const [signup, setSignup] = useState(false);
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const users = JSON.parse(localStorage.getItem("seapass_users") || "{}");
    if (signup) {
      if (users[f.email]) return setErr("An account with this email already exists.");
      users[f.email] = { name: f.name, password: f.password };
      localStorage.setItem("seapass_users", JSON.stringify(users));
    } else if (!users[f.email] || users[f.email].password !== f.password) {
      return setErr("Invalid email or password.");
    }
    localStorage.setItem("seapass_user", JSON.stringify({ email: f.email, name: users[f.email].name }));
    dispatchEvent(new Event("authchange"));
    nav("/book");
  };

  return (
    <div className="auth-page">
      <img src="/img/pier.jpg" alt="" className="auth-bg" />
      <div className="auth-shade" />
      <div className="container auth-grid">
        <div className="auth-copy fade-in">
          <span className="eyebrow light">SeaPass</span>
          <h1>Your next crossing starts here.</h1>
          <p>Sign in to manage your bookings, save passenger details and board faster.</p>
          <ul>
            <li><Icon name="check" size={18} /> Instant e-tickets by email</li>
            <li><Icon name="check" size={18} /> Saved passenger details</li>
            <li><Icon name="check" size={18} /> Free cancellation up to 24 hours before departure</li>
          </ul>
        </div>
        <div className="auth-card fade-in d1">
          <h2>{signup ? "Create your account" : "Welcome back"}</h2>
          <p className="sub">{signup ? "Create an account to book ferry tickets." : "Welcome back! Please login to continue."}</p>
          {err && <div className="err">{err}</div>}
          <form onSubmit={submit} className="form" key={String(signup)}>
            {signup && <Field name="name" required label="Full name" icon="user" />}
            <Field name="email" type="email" required label="Email" icon="mail" />
            <div className="pw">
              <Field name="password" type={show ? "text" : "password"} required minLength="6" label="Password" icon="lock" />
              <button type="button" className="eye" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
            </div>
            {!signup && (
              <div className="auth-row">
                <label className="check-row"><input type="checkbox" /> <span>Remember me</span></label>
                <a href="#" onClick={(e) => { e.preventDefault(); setErr("Password reset is not available in this demo."); }}>Forgot password?</a>
              </div>
            )}
            <button className="btn big">{signup ? "Create account" : "Login"}</button>
          </form>
          <p className="switch"><a href="#" onClick={(e) => { e.preventDefault(); setSignup(!signup); setErr(""); }}>{signup ? "Already have an account? Login" : "Don't have an account? Sign up"}</a></p>
        </div>
      </div>
    </div>
  );
}
