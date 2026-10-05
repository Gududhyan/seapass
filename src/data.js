export const ports = ["Mumbai", "Alibag", "Elephanta", "Goa", "Karwar", "Kochi", "Lakshadweep"];

export const routes = [
  { id: 1, from: "Mumbai", to: "Alibag", dep: "07:00", arr: "07:50", price: 450, vehicle: 1200, img: "rocks", tags: ["WiFi", "Vehicles"] },
  { id: 2, from: "Alibag", to: "Mumbai", dep: "09:30", arr: "10:20", price: 450, vehicle: 1200, img: "pier", tags: ["WiFi", "Vehicles"] },
  { id: 3, from: "Mumbai", to: "Elephanta", dep: "10:00", arr: "10:45", price: 300, vehicle: 0, img: "deck", tags: ["Sun deck"] },
  { id: 4, from: "Mumbai", to: "Goa", dep: "13:00", arr: "20:30", price: 1800, vehicle: 4500, img: "waves", tags: ["Dining", "WiFi", "Vehicles"] },
  { id: 5, from: "Goa", to: "Karwar", dep: "08:15", arr: "10:30", price: 750, vehicle: 2200, img: "beach", tags: ["WiFi", "Vehicles"] },
  { id: 6, from: "Kochi", to: "Lakshadweep", dep: "16:00", arr: "06:00", price: 2400, vehicle: 0, img: "island", tags: ["Dining", "Cabins"] },
];

const mins = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
export const duration = (r) => { let d = mins(r.arr) - mins(r.dep); if (d <= 0) d += 1440; return d; };
export const fmtDur = (d) => {
  const h = Math.floor(d / 60), m = d % 60;
  return [h && `${h}h`, m && `${String(m).padStart(h ? 2 : 1, "0")}m`].filter(Boolean).join(" ");
};
export const slotOf = (r) => { const h = Number(r.dep.slice(0, 2)); return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening"; };

// Promo codes: pct off the fare subtotal; optional rules.
export const PROMOS = {
  SEA10: { pct: 10 },
  FAMILY15: { pct: 15, minPax: 3 },
  DECK5: { pct: 5, weekdays: true },
};

export const OFFERS = [
  { code: "SEA10", title: "10% off your first crossing", desc: "Valid on every route. One use per traveller.", img: "waves" },
  { code: "FAMILY15", title: "Family saver: 15% off", desc: "Book 3 or more passengers on a single ticket.", img: "passengers" },
  { code: "DECK5", title: "Weekday sailings: 5% off", desc: "Travelling Monday to Thursday? Save on any route.", img: "beach" },
];

export const features = [
  ["Modern Fleet", "Modern ferries with premium amenities and spacious seating.", "ship"],
  ["Safety First", "Industry-leading safety standards and trained crew.", "shield"],
  ["Live Schedules", "Track departures and arrivals with live updates.", "live"],
  ["Easy Booking", "Simple online booking with instant confirmation.", "bolt"],
  ["Vehicle Transport", "Safe and spacious vehicle accommodation.", "car"],
  ["Secure Payments", "Your payment information is protected end to end.", "lock"],
];

export const amenities = [
  ["Comfort Lounges", "Spacious lounges with recliners and family zones.", "sofa"],
  ["Onboard Dining", "Full-service restaurant available on select routes.", "dining"],
  ["Free WiFi", "High-speed internet throughout your journey.", "wifi"],
  ["Charging Points", "USB and power outlets to keep devices charged.", "plug"],
  ["Accessibility", "Wheelchair accessible facilities and assistance.", "access"],
  ["Pet Friendly", "Designated areas so pets can travel with you.", "paw"],
  ["Family Zones", "Children's play areas and entertainment.", "child"],
  ["Sun Decks", "Relax with panoramic ocean views.", "sun"],
];

export const faqs = [
  ["How early should I arrive?", "Arrive at least 45 minutes before departure for passengers and 90 minutes with a vehicle."],
  ["What's your cancellation policy?", "Cancel up to 24 hours before departure for a full refund. See the Cancellation Policy for details."],
  ["Is WiFi available?", "Yes, complimentary WiFi is available on all ferries."],
  ["Are there discounts available?", "Children, seniors, students and groups get discounts. Check the booking page for current offers."],
];
