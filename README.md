# ESTORA REALTY website

Plain HTML + CSS + Vanilla JS (Tailwind via CDN for grid utilities; photos are in assets/images).

## Run locally
1. Unzip the folder.
2. Double-click `index.html` (or run `python3 -m http.server 8000` in this folder and open http://localhost:8000).
3. An internet connection is needed for Tailwind CDN and Google Fonts.

## Structure
- `index.html` – all sections; property details open in the same page (`#/p/ID`).
- `css/style.css` – styles, light/dark themes (CSS variables).
- `js/data.js` – editable sample properties, testimonials, content.
- `js/main.js` – search, filters, favourites (localStorage), forms, theme toggle, calculator, router.

## Before publishing
Replace sample listings, stats, agents, reviews, contact details and images. Connect the forms to a backend or form service (they only validate in the browser). Use only images you own or are licensed to use.

## Images
Photos come from the supplied starter pack (small previews, upscaled). Replace files in `assets/images/` with full-resolution licensed images for production (keep the same filenames, or edit `IMG` in `js/data.js`).
