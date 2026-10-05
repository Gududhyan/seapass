import { useRef, useState } from "react";
import Field from "../components/Field.jsx";
import WhatsAppIcon from "../components/WhatsAppIcon.jsx";
import Icon from "../components/Icon.jsx";
import PageBanner from "../components/PageBanner.jsx";
import { Reveal } from "../components/motion.jsx";
import { CONTACT, waLink } from "../contact.js";

const WaIcon = WhatsAppIcon;

export default function Contact() {
  const [sent, setSent] = useState(false);
  const form = useRef(null);
  const submit = (e) => { e.preventDefault(); setSent(true); e.target.reset(); setTimeout(() => setSent(false), 5000); };

  // Opens WhatsApp with the form contents pre-filled as the message.
  const viaWhatsApp = () => {
    const f = Object.fromEntries(new FormData(form.current));
    const text = [
      "Hello SeaPass team,",
      f.topic && `Topic: ${f.topic}`,
      f.subject && `Subject: ${f.subject}`,
      f.message && `\n${f.message}`,
      f.name && `\n— ${f.name}${f.email ? ` (${f.email})` : ""}`,
    ].filter(Boolean).join("\n");
    window.open(waLink(text), "_blank", "noopener");
  };

  const rows = [
    ["mail", "Email inquiries", CONTACT.email, `mailto:${CONTACT.email}`],
    ["phone", "Direct phone", CONTACT.phone, `tel:${CONTACT.tel}`],
    ["wa", "WhatsApp", CONTACT.phone, waLink("Hello SeaPass team, I'd like some help with a booking."), "Chat now"],
    ["pin", "HQ location", CONTACT.address, CONTACT.map],
    ["clock", "Operating hours", CONTACT.hours, null],
  ];

  return (
    <div className="page-bg">
      <PageBanner img="beach" pos="center 60%" eyebrow="Contact" title="Contact Us" sub="We're here to help! Reach out with any questions or concerns." />
      <div className="container section">
        <div className="contact-grid">
          <Reveal dir="left" className="panel">
            <div className="panel-head"><h2>Send us a message</h2><p>Fill in the form and we will get back to you within one business day.</p></div>
            {sent && <div className="ok">Message sent! We'll get back to you shortly.</div>}
            <form ref={form} onSubmit={submit} className="form">
              <div className="fgrid two"><Field name="name" required label="Your name" icon="user" /><Field name="email" required type="email" label="Email" icon="mail" /></div>
              <Field name="topic" as="select" label="Topic" icon="compass" defaultValue="">
                <option value="" disabled>Select a topic</option><option>Booking help</option><option>Refund or cancellation</option><option>Feedback</option><option>Other</option>
              </Field>
              <Field name="subject" icon="anchor" label="Subject" />
              <Field name="message" as="textarea" required rows="5" label="Message" className="grow" />
              <div className="send-row">
                <button className="btn">Send message</button>
                <button type="button" className="btn wa" onClick={viaWhatsApp}><WaIcon size={20} /> Send via WhatsApp</button>
              </div>
            </form>
          </Reveal>
          <Reveal dir="right" className="info-col">
            {rows.map(([k, t, v, href, cta]) => {
              const body = (<>
                <span className={`iconbox ${k}`}>{k === "wa" ? <WaIcon /> : <Icon name={k} size={22} />}</span>
                <div><small>{t}</small><b>{v}</b>{cta && <em>{cta}</em>}</div>
              </>);
              return href
                ? <a className="info" key={k} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>{body}</a>
                : <div className="info" key={k}>{body}</div>;
            })}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
