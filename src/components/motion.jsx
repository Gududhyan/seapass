import { useEffect, useRef, useState } from "react";

// Adds the "in" class once the element scrolls into view.
export function Reveal({ children, delay = 0, as: Tag = "div", className = "", dir = "up" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); }
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${dir} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</Tag>;
}

// Counts up to `to` when scrolled into view.
export function CountUp({ to, suffix = "", duration = 1600 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

// Scroll progress bar + sets --scroll for parallax.
export function ScrollFX() {
  useEffect(() => {
    const bar = document.getElementById("progress");
    const onScroll = () => {
      const h = document.documentElement;
      const y = h.scrollTop;
      if (bar) bar.style.transform = `scaleX(${y / Math.max(1, h.scrollHeight - h.clientHeight)})`;
      h.style.setProperty("--scroll", y);
      document.body.classList.toggle("scrolled", y > 24);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return <div id="progress" className="progress" />;
}
