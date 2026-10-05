# SeaPass

Ferry ticket booking website built with React, Vite and React Router.

## Features

- Home page with a From / To / Date / Passengers search card, popular routes, offers and FAQ
- Schedules page with filters (port, max fare, time of day) and sorting
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

- Authentication, payment and the contact form are placeholders. Connect a real backend and payment gateway before going live.
- Promo codes, fares, reviews and policy wording are sample content.
- Photographs are from [Pexels](https://www.pexels.com) and are free to use under the Pexels licence.
