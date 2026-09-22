# Wastage — Line Check

A small TypeScript + Vite + React app for recording daily product wastage
on a phone, and turning it into a clean summary that's quick to type into
the till.

## What it does

- Browse products grouped by storage/category (Bread, Meat & Proteins,
  Cheese, Vegetables & Produce, Sauces & Condiments, Cookies & Bakery,
  Drinks & Extras) in collapsible sections.
- Enter a wasted quantity against any product — weighed items take **kg**
  (with a 0.1kg step), counted items take **each** (with a 1-unit step).
- Search to jump straight to a product instead of scrolling.
- A running "N items logged" bar at the bottom opens a **Summary sheet**:
  everything you've logged, grouped by category, with a **Copy for till**
  button that copies a plain-text list ready to paste or read off while
  keying into the till.
- Entries are saved to the browser's local storage as you go (so a refresh
  mid-shift doesn't lose anything) and automatically clear at the start of
  a new day, ready for the next sheet.

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

- `id` — unique, stable (used as the storage key — don't change it once
  you've started logging against it, or existing entries won't match up).
- `category` — controls which section a product appears under. New
  category names just work; sections appear in the order they're first
  seen in the file.
- `unit` — `"kg"` for weighed items, `"ea"` for counted items.

Add, remove or re-order items freely to match your own store's range.

## Deploying

This is a static site once built (`npm run build` → `dist/`). It can be
hosted anywhere that serves static files — Netlify, Vercel, GitHub Pages,
or a plain web server. No backend or environment variables are required.
