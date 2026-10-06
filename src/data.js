export const ports = ["Mumbai", "Alibag", "Elephanta", "Goa", "Karwar", "Kochi", "Lakshadweep"];

// A "service" is a route that sails on certain days at certain times.
//   deps      departure times every operating day (24h, local)
//   dur       crossing time in minutes
//   days      operating weekdays, 0 = Sunday ... 6 = Saturday
//   monsoon   true if the service is paused from 1 Jun to 15 Sep
//   capacity  passenger seats per sailing
export const routes = [
  { id: 1, from: "Mumbai", to: "Alibag", price: 450, vehicle: 1200, img: "rocks", tags: ["WiFi", "Vehicles"],
    deps: ["07:00", "09:30", "12:00", "15:30", "18:00"], dur: 50, days: [0, 1, 2, 3, 4, 5, 6], monsoon: true, capacity: 180 },
  { id: 2, from: "Alibag", to: "Mumbai", price: 450, vehicle: 1200, img: "pier", tags: ["WiFi", "Vehicles"],
    deps: ["08:15", "10:45", "13:15", "16:30", "19:00"], dur: 50, days: [0, 1, 2, 3, 4, 5, 6], monsoon: true, capacity: 180 },
  { id: 3, from: "Mumbai", to: "Elephanta", price: 300, vehicle: 0, img: "deck", tags: ["Sun deck"],
    deps: ["09:00", "10:00", "11:30", "13:00", "14:30"], dur: 45, days: [0, 2, 3, 4, 5, 6], monsoon: true, capacity: 150 },
  { id: 4, from: "Mumbai", to: "Goa", price: 1800, vehicle: 4500, img: "waves", tags: ["Dining", "WiFi", "Vehicles"],
    deps: ["13:00"], dur: 450, days: [2, 4, 6], monsoon: false, capacity: 220 },
  { id: 5, from: "Goa", to: "Karwar", price: 750, vehicle: 2200, img: "beach", tags: ["WiFi", "Vehicles"],
    deps: ["08:15", "15:00"], dur: 135, days: [0, 1, 2, 3, 4, 5, 6], monsoon: true, capacity: 160 },
  { id: 6, from: "Kochi", to: "Lakshadweep", price: 2400, vehicle: 0, img: "island", tags: ["Dining", "Cabins"],
    deps: ["16:00"], dur: 840, days: [1, 3, 5], monsoon: false, capacity: 120 },
];

export const fmtDur = (mins) => {
  const h = Math.floor(mins / 60), m = mins % 60;
  return [h && `${h}h`, m && `${String(m).padStart(h ? 2 : 1, "0")}m`].filter(Boolean).join(" ");
};
export const slotOf = (dep) => { const h = Number(dep.slice(0, 2)); return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening"; };

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
