// Small status pills shared by the schedules and booking pages.

// Real data from the Open-Meteo Marine API (see api/ferryApi.js).
export function SeaBadge({ s }) {
  if (!s || s.status === "loading") return <span className="badge sea-load">Checking sea…</span>;
  if (s.status === "unavailable") return <span className="badge sea-na" title={s.reason}>Sea forecast n/a</span>;
  return (
    <span className={`badge sea-${s.level}`} title={`Max wave height ${s.wave.toFixed(1)} m, wave period ${Math.round(s.period)} s. Source: Open-Meteo Marine API`}>
      {s.label} · {s.wave.toFixed(1)} m
    </span>
  );
}

export function SeatBadge({ seats }) {
  if (seats === 0) return <span className="badge out">Sold out</span>;
  if (seats <= 15) return <span className="badge low">Only {seats} seats left</span>;
  return <span className="badge ok">{seats} seats left</span>;
}
