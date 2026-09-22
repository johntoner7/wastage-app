-- Run this once in your Supabase project's SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run).
--
-- One row per product logged on a given date. "Today" and "history" are
-- both just this same table, filtered by entry_date — nothing is deleted
-- when a new day starts, so history accumulates for free.

create table if not exists wastage_entries (
  id bigint generated always as identity primary key,
  entry_date date not null,
  product_id text not null,
  quantity numeric not null check (quantity > 0),
  updated_at timestamptz not null default now(),
  unique (entry_date, product_id)
);

create index if not exists wastage_entries_date_idx on wastage_entries (entry_date);

-- Row-level security -------------------------------------------------------
--
-- This app has no login step — it authenticates with the public "anon" key
-- only, and relies on these policies to say what that key can do. As
-- written, anyone who has the anon key (which lives in the app's built
-- JavaScript, so it isn't really secret) can read and write every row.
--
-- That's an acceptable trade-off for a small internal tool that isn't
-- linked publicly, but it's worth knowing: if this URL ever gets shared or
-- indexed, anyone with the link and a browser console could see or edit
-- the wastage log. If that risk matters to you, the next step up is adding
-- Supabase Auth (e.g. a single shared login) and scoping these policies to
-- authenticated users instead of "true".

alter table wastage_entries enable row level security;

create policy "Allow anon read" on wastage_entries
  for select using (true);

create policy "Allow anon insert" on wastage_entries
  for insert with check (true);

create policy "Allow anon update" on wastage_entries
  for update using (true);

create policy "Allow anon delete" on wastage_entries
  for delete using (true);
