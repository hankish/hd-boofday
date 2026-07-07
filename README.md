# Boofday 🍑👽

The site for **Heather's 40th — The Boofday Campout**, a booty-themed redwood
campout on **Sat, Jul 25 – Sun, Jul 26, 2026** at the Land of Mercury in
Guerneville, CA.

It's a static, dependency-free site: everything guests need — the lowdown,
schedule, activities, packing list, and how to help — lives on one page. Any
fill-in-the-blank stuff (RSVPs, carpool, task sign-ups) stays in the group's
Google Sheet, which the site links out to instead of duplicating.

## Structure

```
index.html            All page content and markup
assets/css/style.css  All styling (mobile-first, no build step)
assets/js/config.js   The only file with "real" data: RSVP link, sheet link, event dates
assets/js/main.js     Nav, countdown, add-to-calendar, packing checklist
assets/img/           Favicon
```

No framework, no bundler, no `npm install`. Open `index.html` in a browser
and it works.

## Local preview

Any static file server works, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly via `file://` also works — the site has no
server dependencies.)

## Configuration

Everything guest-specific lives in [`assets/js/config.js`](assets/js/config.js):

```js
window.BOOFDAY_CONFIG = {
  rsvpUrl: "...",   // Partiful (or wherever guests RSVP)
  sheetUrl: "...",  // Google Sheet: carpool, task sign-ups, potluck list
  event: {
    start: "2026-07-25T12:00:00-07:00", // ISO 8601 with UTC offset
    end:   "2026-07-26T13:00:00-07:00",
    ...
  },
};
```

Update those values and the RSVP buttons, spreadsheet links, live countdown,
and "Add to Calendar" `.ics` file all update automatically — no other file
needs to change.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings, go to **Pages** → **Build and deployment** → set
   **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. Save. The site publishes at `https://<username>.github.io/<repo>/`.

The included `.nojekyll` file tells GitHub Pages to serve the site as-is,
skipping Jekyll processing (not needed here, but avoids surprises with
files/folders that start with underscores or dots).

## Notes on what's included vs. linked out

The original planning spreadsheet has two kinds of content:

- **Static info** (site details, theme, schedule, activity descriptions,
  packing list, general "how to help" categories) — reproduced directly on
  the site.
- **Fill-in-the-blank sign-ups** (who's driving whom, who's bringing what,
  which DJ slot someone claimed) — these change constantly and include
  personal contact info, so the site links out to the live Google Sheet
  instead of freezing a copy of it.

## Editing content

There's no CMS — content lives directly in `index.html`. Find the relevant
`<section>` (they're labeled with clear `id`s: `lowdown`, `schedule`,
`activities`, `packing`, `help`) and edit the markup directly.

The packing checklist state (which boxes a guest has checked) is stored in
that guest's own browser via `localStorage` — it's personal to each visitor
and isn't sent anywhere.
