# FlexLiving Reviews Dashboard (Assessment)

This repository is a Next.js demo app that provides:
- A Manager Dashboard to read, filter and approve property reviews.
- An API route `/api/reviews/hostaway` that returns normalized review data (mocked).
- Property pages that show only manager-approved reviews.

## Tech stack
- Next.js (React)
- TailwindCSS for styling
- SWR for data fetching (client)
- Mocked Hostaway data under `data/mock_reviews.json`


---

## How it works
- `/api/reviews/hostaway` reads `data/mock_reviews.json`, normalizes each review (date, rating, listing, categories) and returns JSON.
- Dashboard reads that endpoint and allows filtering, sorting, and marking reviews as "approved" (persisted to `localStorage` in this demo).
- Property pages (`/property/[id]`) display only reviews approved by the manager.

> Note: This demo stores approvals in localStorage for simplicity. In production you would save approvals server-side (database or CMS) and expose them via a protected API.

---

## Google Reviews exploration (Places API)
Goal: investigate whether Google Reviews can be integrated.

**Findings & approach**
- Google Places API can return place details including `reviews` using the Place Details endpoint:
  - `https://maps.googleapis.com/maps/api/place/details/json?place_id=PLACE_ID&fields=name,reviews&key=API_KEY`
- However:
  - The `reviews` array is limited (short excerpts, limited number).
  - Access to full Google review content and scraping is restricted by Google terms of service.
  - You must have a valid Google Cloud project with Places API enabled and billing enabled for production use.
- Implementation steps (basic):
  1. Use Places Autocomplete or search to find `place_id` for the property.
  2. Call Place Details with `fields=reviews`.
  3. Normalize returned reviews into the same shape as Hostaway reviews.
- In this repo I did **not** call the Google API directly (to avoid exposing keys). Instead, I included `.env.local.example` and this guidance.

**Server-side example (pseudo):**
```js
// Node server-side fetch (do not expose in client)
const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,reviews&key=${process.env.GOOGLE_PLACES_API_KEY}`;
const resp = await fetch(url);
const json = await resp.json();
// normalize json.result.reviews -> our review shape
