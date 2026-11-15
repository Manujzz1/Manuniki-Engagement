# Manoj Kumar & Nikitha · Engagement Invitation

A scroll-animated invitation: a blush envelope with a heart wax seal opens as you scroll,
followed by the couple under a rose arch, their families, a countdown, the ceremony,
the venue with directions and an "Add to calendar" button.

## Run

```bash
npm install
npm run dev      # local development
npm run build    # static site in dist/ (works from any folder: base is './')
npm run preview  # serve the built site
```

## Edit the details

Everything shown on the page lives in `src/details.js`:

- `ceremony.end`: no end time was given, so the page says "11:00 AM onwards" and the
  calendar entry assumes it ends at 2:00 PM (`calendarEnd`).
- `hashtag`: optional, shown in the footer.

The scroll animations run on every device, phones included. Visitors who turn on reduced motion still get them (they only move as you scroll), but not the endless petals, hearts and heartbeat pulses.
