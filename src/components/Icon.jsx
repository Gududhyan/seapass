// Single line-icon set (24px grid, 1.7 stroke) used across the site instead of emoji.
const P = {
  anchor: <><circle cx="12" cy="5" r="2" /><path d="M12 7v14M6 12H4a8 8 0 0 0 16 0h-2M8 11h8" /></>,
  ship: <><path d="M3 17l2 3h14l2-3-1.500-5H4.500Z" /><path d="M7 12V8h10v4M12 8V4M10 4h4" /></>,
  shield: <><path d="M12 3 5 6v5c0 4.500 3 8 7 10 4-2 7-5.500 7-10V6Z" /><path d="m9 12 2 2 4-4" /></>,
  live: <><circle cx="12" cy="12" r="2" /><path d="M7.500 7.500a6 6 0 0 0 0 9M16.500 7.500a6 6 0 0 1 0 9M4.500 4.500a10 10 0 0 0 0 15M19.500 4.500a10 10 0 0 1 0 15" /></>,
  bolt: <path d="M13 3 5 14h6l-1 7 8-11h-6Z" />,
  car: <><path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3z" /><circle cx="7.500" cy="13.500" r=".6" /><circle cx="16.500" cy="13.500" r=".6" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2.500" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  sofa: <><path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" /><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3Z" /><path d="M6 18v2M18 18v2" /></>,
  dining: <><path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2.500 1.500-3 5-3 8h3" /></>,
  wifi: <><path d="M2 9a15 15 0 0 1 20 0M5 12.500a10 10 0 0 1 14 0M8.500 16a5 5 0 0 1 7 0" /><circle cx="12" cy="19" r="1" /></>,
  plug: <><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0ZM12 17v4" /></>,
  access: <><circle cx="12" cy="4.500" r="1.800" /><path d="M12 8v6h5l2 5M12 11h5M8 12a5 5 0 1 0 6 7" /></>,
  paw: <><circle cx="6" cy="10" r="1.800" /><circle cx="10" cy="6" r="1.800" /><circle cx="14.500" cy="6" r="1.800" /><circle cx="18.500" cy="10" r="1.800" /><path d="M8 17c0-3 2-5 4-5s4 2 4 5c0 2-2 2.500-4 2.500S8 19 8 17Z" /></>,
  child: <><circle cx="12" cy="7" r="3" /><path d="M6 21v-3a6 6 0 0 1 12 0v3" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.500 8.500-2 5-5 2 2-5Z" /></>,
  doc: <><path d="M6 3h8l4 4v14H6Z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h3" /></>,
  ticket: <><path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V6H3Z" /><path d="M14 6v12" strokeDasharray="2 2" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
  phone: <path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  pin: <><path d="M12 21s7-6.200 7-11.500A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21Z" /><circle cx="12" cy="9.500" r="2.500" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 12 5 5 9-10" />,
};

export default function Icon({ name, size = 24, className = "", ...rest }) {
  return (
    <svg className={`icon ${className}`} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {P[name] || P.anchor}
    </svg>
  );
}

export const Logo = ({ light }) => (
  <span className={`logo-mark ${light ? "light" : ""}`}><Icon name="anchor" size={22} /><b>SeaPass</b></span>
);
