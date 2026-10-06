# SeaPass

Ferry ticket booking website built with React, Vite and React Router.

## Features

- Home page with a From / To / Date / Passengers search card, popular routes, offers and FAQ
- Date-aware schedules: pick any of the next 14 days (or another date) and see that day's sailings, with seats left, weekend fares and "No ferry" markers
- Real sea conditions per sailing from the [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api) (free, no key)
- Searchable From / To pickers: our ports first, then real ferry terminals across India from OpenStreetMap (via the free [Photon](https://photon.komoot.io) geocoder). Picking a terminal we do not serve suggests the nearest SeaPass port
- Filters (port, max fare, time of day) and sorting on the results page
- Four-step booking flow with promo codes, a live price summary and a printable boarding pass
- Contact page with WhatsApp messaging, plus a floating WhatsApp chat button
- Login and signup (demo only, accounts are stored in the browser)
- Cancellation, refund, privacy and terms pages

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Project structure

```
src/
  components/   shared UI (icons, fields, page banner, hero, motion helpers)
  pages/        one file per route
  data.js       routes, offers, promo codes, FAQ copy
  contact.js    contact details used across the site
public/img/     photographs
```

## Notes

- Sailings come from the timetable rules in `src/data.js` through `src/api/ferryApi.js`. No free public API exists for Indian ferry timetables, so `listSailings()` is the one function to replace with an operator's API. Sea conditions are real API data and cover about the next 9 days.
- Seats sold through this browser are stored in localStorage so availability drops after a booking.
- Authentication, payment and the contact form are placeholders. Connect a real backend and payment gateway before going live.
- Promo codes, fares, reviews and policy wording are sample content.
- Photographs are from [Pexels](https://www.pexels.com) and are free to use under the Pexels licence.
