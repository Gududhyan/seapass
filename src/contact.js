export const CONTACT = {
  email: "info@seapass.in",
  phone: "+91 90366 86633",
  tel: "+919036686633",
  wa: "919036686633", // international format, digits only
  address: "2nd Floor, Suvarna Complex, No. 706/1, 3rd Block, BEL Layout, Vidyaranyapura, Bengaluru - 560097",
  hours: "Mon - Fri: 9:00 AM - 6:00 PM IST (24/7 Support for Enterprise)",
  map: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Suvarna Complex, BEL Layout, Vidyaranyapura, Bengaluru 560097"),
};

export const waLink = (text) => `https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(text)}`;
