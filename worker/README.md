# wastage-api

A small Cloudflare Worker + D1 database that backs the wastage app: one
table (`wastage_entries`), a handful of endpoints, no login step.

## Endpoints

All require `Authorization: Bearer <API_TOKEN>`.

- `GET /entries?date=YYYY-MM-DD` — quantities for that date, keyed by product id
- `PUT /entries` — body `{ date, productId, quantity }`, upserts one entry
- `DELETE /entries?date=YYYY-MM-DD&productId=...` — remove one entry
- `DELETE /entries?date=YYYY-MM-DD` — remove every entry for that date
- `GET /history?exclude=YYYY-MM-DD` — `[{ date, itemCount }]` for every other date with entries

## Setting up

```bash
npm install
npx wrangler d1 create wastage-db   # copy the database_id into wrangler.jsonc
npx wrangler d1 migrations apply wastage-db --remote
npx wrangler secret put API_TOKEN   # paste a random string, e.g. `openssl rand -base64 24`
npx wrangler deploy
```

Deploy prints the Worker's URL (`https://wastage-api.<your-subdomain>.workers.dev`).
Put that plus the same token into the app's `.env` as `VITE_API_URL` and
`VITE_API_TOKEN` (see `../.env.example`).

For local development, copy `.dev.vars.example` to `.dev.vars` and run
`npx wrangler dev`.

## On security

Same trade-off the app made with Supabase's anon key: there's no login
screen, just a shared token embedded in the app's built JavaScript (checked
in `src/index.ts`, not by keeping the token secret — it isn't really
secret). That's fine for a small internal tool on a private/unlisted URL,
but anyone with the token and the URL can read and write the whole table.
