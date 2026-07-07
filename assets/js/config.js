/**
 * Boofday site configuration.
 * Edit the values below — nothing else in the site needs to change.
 */
window.BOOFDAY_CONFIG = {
  // Partiful (or wherever guests RSVP)
  rsvpUrl: "https://partiful.com/e/5INX2BWsicu2R7pMZnqp",

  // Google Sheet: carpool, task sign-ups, potluck list, etc.
  sheetUrl: "https://docs.google.com/spreadsheets/d/19f0yU5o3rw-jocq2xfrmlUFcAbO3odeK-lnPO9W3xCM/edit",

  event: {
    title: "Heather's 40th — The Boofday Campout",
    location: "Land of Mercury, 18475 Sweetwater Springs Rd, Guerneville, CA",
    // ISO 8601 with explicit offset so the countdown & calendar file are correct
    // for guests in any timezone. Guerneville, CA is Pacific Time (UTC-7 in July).
    start: "2026-07-25T12:00:00-07:00",
    end: "2026-07-26T13:00:00-07:00",
    description:
      "Get in loser, we're doing butt stuff. Full details and RSVP: https://partiful.com/e/5INX2BWsicu2R7pMZnqp",
  },
};
