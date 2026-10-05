import Icon from "./Icon.jsx";

// Callers may pass an icon name or a legacy emoji; both resolve to the same line icon.
const MAP = { "👤": "user", "✉️": "mail", "📞": "phone", "🔒": "lock", "📅": "calendar", "🧭": "compass", "⚓": "anchor" };

// Floating-label input / select / textarea with optional icon and error text.
export default function Field({ label, icon, error, as = "input", children, className = "", ...rest }) {
  const Tag = as;
  return (
    <label className={`field ${icon ? "has-icon" : ""} ${error ? "bad" : ""} ${className}`}>
      {icon && <span className="ficon"><Icon name={MAP[icon] || icon} size={20} /></span>}
      <Tag placeholder=" " {...rest}>{children}</Tag>
      <span className="flabel">{label}</span>
      {error && <small className="ferr">{error}</small>}
    </label>
  );
}
