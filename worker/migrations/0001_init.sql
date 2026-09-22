-- One row per product logged on a given date. "Today" and "history" are
-- both just this same table, filtered by entry_date — nothing is deleted
-- when a new day starts, so history accumulates for free.

create table if not exists wastage_entries (
  id integer primary key autoincrement,
  entry_date text not null,
  product_id text not null,
  quantity real not null check (quantity > 0),
  updated_at text not null default (datetime('now')),
  unique (entry_date, product_id)
);

create index if not exists wastage_entries_date_idx on wastage_entries (entry_date);
