# Wastage — Line Check

A TypeScript + Vite + React app for recording daily product wastage on a
phone, and turning it into a clean summary that's quick to type into the
till. Backed by a small Cloudflare Worker + D1 API (see `worker/`), so the
same sheet is visible from any device — log wastage from your phone in the
morning, check it from a tablet later.

## What it does

- Browse products grouped by storage/category (Bread, Meat & Proteins,
  Cheese, Vegetables & Produce, Sauces & Condiments, Cookies & Bakery,
  Drinks & Extras) in collapsible sections.
- Enter a wasted quantity against any product — weighed items take **kg**
  (with a 0.1kg step), counted items take **each** (with a 1-unit step).
- Search to jump straight to a product instead of scrolling.
- A running "N items logged" bar at the bottom opens a **Summary sheet**:
  everything you've logged today, grouped by category, with a **Copy for
  till** button that copies a plain-text list ready to paste or read off
  while keying into the till.
- **History**: every previous day you've logged stays browsable — tap
  History, pick a date, see that day's breakdown (read-only, with its own
  copy-for-till).
- Every change saves straight to the API as you go, so switching devices
  mid-shift just works — there's nothing to sync manually.
- **Works offline.** Backrooms and walk-in freezers are exactly where wifi
  tends to be worst — if a save can't reach the API, it's queued and kept
  locally, the row shows a small amber dot to say it hasn't synced yet, and
  a pill at the top shows how many changes are waiting. Queued changes
  retry automatically as soon as the connection's back (or tap "Sync now"),
  and nothing is lost even if the tab closes before that happens.

## Setting up the API

This app needs the Worker + D1 API in `worker/` deployed somewhere. It's
free for this scale of use on Cloudflare's free tier.

1. Follow `worker/README.md` to create the D1 database, apply the schema,
   set an API token, and deploy the Worker.
2. Copy `.env.example` to `.env` and paste in the Worker's URL and the
   token you set:
   ```
   VITE_API_URL=https://wastage-api.your-subdomain.workers.dev
   VITE_API_TOKEN=your-api-token
   ```
3. Run or build the app as usual (below) — it'll pick these up
   automatically.

**On security:** this app has no login screen — it talks to the API using
only a shared bearer token, checked by the Worker (see `worker/src/index.ts`).
As set up, anyone who has the token (which ships inside the app's
JavaScript — it isn't really secret) can read and write the table. That's a
reasonable trade-off for a small internal tool on a private/unlisted URL,
but it's not meaningfully access-controlled. If that matters to you, the
next step up is adding real auth (e.g. Cloudflare Access in front of the
Worker) instead of a shared token.

If you skip this setup, the app still runs and shows a "Not connected yet"
screen explaining what's missing, rather than crashing.

## How the offline queue works

Every write (entering a quantity, clearing a row, clearing the whole sheet)
applies to the screen immediately and is saved to a small queue in
`localStorage` before anything is sent over the network. That queue is
flushed to the API right away if possible, again whenever the browser
reports it's back online, and every 15 seconds as a fallback for
connections that don't fire that event reliably (common on patchy wifi).
A write is only removed from the queue once the API has confirmed it —
so closing the tab, losing signal mid-save, or a dead connection at the
start of a shift can't silently drop an entry.

The distinction that matters here is *offline* vs. *broken*: a network
failure (no connection, DNS, timeout) queues quietly and shows the amber
"N changes waiting to sync" pill — normal, expected, no action needed. A
request that reaches the API and gets rejected (bad token, validation
failure, etc.) surfaces as a red error banner instead, because retrying on
its own won't fix that — something in the setup needs attention.

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build, output in dist/
npm run preview   # preview the production build
```

Requires Node.js 18+.

## Editing the product list

Everything lives in one place: `src/data/products.ts`. Each entry is:

```ts
{ id: "meat-smoked-ham", name: "Smoked Ham", category: "Meat & Proteins", unit: "kg" }
```

- `id` — unique, stable (used as the row key in the API's database — don't
  change it once you've started logging against it, or existing entries
  won't match up, including in history).
- `category` — controls which section a product appears under. New
  category names just work; sections appear in the order they're first
  seen in the file.
- `unit` — `"kg"` for weighed items, `"ea"` for counted items.

Add, remove or re-order items freely to match your own store's range.

## Deploying

This is a static site once built (`npm run build` → `dist/`). It can be
hosted anywhere that serves static files — Netlify, Vercel, GitHub Pages,
or a plain web server. Set the two `VITE_API_*` environment variables in
your hosting provider's dashboard (not just locally in `.env`) so the
production build has them baked in. The API (`worker/`) is deployed
separately, straight to Cloudflare — see `worker/README.md`.

Because the API credentials are baked in at build time, both devices
should point at the same deployed build/URL — that's what makes "log on
your phone, check on your tablet" work without any extra setup on the
second device.
