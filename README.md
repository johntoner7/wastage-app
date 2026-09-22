# Wastage — Line Check

A TypeScript + Vite + React app for recording daily product wastage on a
phone, and turning it into a clean summary that's quick to type into the
till. Backed by Supabase, so the same sheet is visible from any device —
log wastage from your phone in the morning, check it from a tablet later.

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
- Every change saves straight to Supabase as you go, so switching devices
  mid-shift just works — there's nothing to sync manually.
- **Works offline.** Backrooms and walk-in freezers are exactly where wifi
  tends to be worst — if a save can't reach Supabase, it's queued and kept
  locally, the row shows a small amber dot to say it hasn't synced yet, and
  a pill at the top shows how many changes are waiting. Queued changes
  retry automatically as soon as the connection's back (or tap "Sync now"),
  and nothing is lost even if the tab closes before that happens.

## Setting up Supabase

This app needs a Supabase project to store its data. It's free for this
scale of use.

1. Create a project at [supabase.com](https://supabase.com) (or use an
   existing one).
2. Open the SQL Editor in your project's dashboard, paste in the contents
   of `sql/schema.sql`, and run it. This creates the one table the app
   uses and sets its access policies.
3. In your project's Settings → API page, copy the **Project URL** and the
   **anon public** key.
4. Copy `.env.example` to `.env` and paste those two values in:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Run or build the app as usual (below) — it'll pick these up
   automatically.

**On security:** this app has no login screen — it talks to Supabase using
only the public anon key, and the table's row-level security policies
(in `sql/schema.sql`) are what actually control access. As set up, anyone
who has the anon key (which ships inside the app's JavaScript — it isn't
really secret) can read and write the table. That's a reasonable trade-off
for a small internal tool on a private/unlisted URL, but it's not
meaningfully access-controlled. If that matters to you, the next step up
is adding Supabase Auth (even just one shared login) and scoping the
policies to authenticated requests instead of `true`.

If you skip this setup, the app still runs and shows a "Not connected yet"
screen explaining what's missing, rather than crashing.

## How the offline queue works

Every write (entering a quantity, clearing a row, clearing the whole sheet)
applies to the screen immediately and is saved to a small queue in
`localStorage` before anything is sent over the network. That queue is
flushed to Supabase right away if possible, again whenever the browser
reports it's back online, and every 15 seconds as a fallback for
connections that don't fire that event reliably (common on patchy wifi).
A write is only removed from the queue once Supabase has confirmed it —
so closing the tab, losing signal mid-save, or a dead connection at the
start of a shift can't silently drop an entry.

The distinction that matters here is *offline* vs. *broken*: a network
failure (no connection, DNS, timeout) queues quietly and shows the amber
"N changes waiting to sync" pill — normal, expected, no action needed. A
request that reaches Supabase and gets rejected (bad table name, a policy
denying access, etc.) surfaces as a red error banner instead, because
retrying on its own won't fix that — something in the setup needs
attention.

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

- `id` — unique, stable (used as the Supabase row key — don't change it
  once you've started logging against it, or existing entries won't match
  up, including in history).
- `category` — controls which section a product appears under. New
  category names just work; sections appear in the order they're first
  seen in the file.
- `unit` — `"kg"` for weighed items, `"ea"` for counted items.

Add, remove or re-order items freely to match your own store's range.

## Deploying

This is a static site once built (`npm run build` → `dist/`). It can be
hosted anywhere that serves static files — Netlify, Vercel, GitHub Pages,
or a plain web server. Set the two `VITE_SUPABASE_*` environment variables
in your hosting provider's dashboard (not just locally in `.env`) so the
production build has them baked in.

Because the Supabase credentials are baked in at build time, both devices
should point at the same deployed build/URL — that's what makes "log on
your phone, check on your tablet" work without any extra setup on the
second device.
