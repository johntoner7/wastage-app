/**
 * Minimal Supabase client — talks to the auto-generated PostgREST API
 * directly over fetch rather than pulling in the full supabase-js SDK,
 * since all we need is simple reads/writes against one table.
 *
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be set
 * (see .env.example). Both are safe to expose client-side — access is
 * controlled by the table's row-level security policies, not by keeping
 * the anon key secret. See sql/schema.sql for the policies this app
 * assumes, and README.md for the security trade-off they make.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const BASE = SUPABASE_URL ? `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1` : "";

const baseHeaders = {
  apikey: SUPABASE_ANON_KEY ?? "",
  Authorization: `Bearer ${SUPABASE_ANON_KEY ?? ""}`,
  "Content-Type": "application/json",
};

/** Thrown when the request never reached the server — offline, DNS failure,
 * timeout, etc. Callers treat this as "try again later", not a real error. */
export class NetworkError extends Error {}

/** Thrown when the server responded but rejected the request (bad config,
 * RLS denial, validation failure). Retrying won't help without a fix. */
export class SupabaseRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface EntryRow {
  entry_date: string;
  product_id: string;
  quantity: number;
}

async function request(path: string, init?: RequestInit) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase isn't configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { ...baseHeaders, ...(init?.headers ?? {}) },
    });
  } catch (e) {
    // fetch() itself throws (TypeError) when the request never left the
    // browser — no connection, DNS failure, CORS block, etc.
    throw new NetworkError(e instanceof Error ? e.message : "Network request failed");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new SupabaseRequestError(body || res.statusText, res.status);
  }
  // 204 No Content (e.g. DELETE) has no body to parse.
  if (res.status === 204) return null;
  return res.json();
}

/** All logged quantities for one date, keyed by product id. */
export async function fetchEntriesForDate(date: string): Promise<Record<string, number>> {
  const rows = (await request(
    `/wastage_entries?entry_date=eq.${date}&select=product_id,quantity`,
  )) as EntryRow[];
  const entries: Record<string, number> = {};
  for (const row of rows) entries[row.product_id] = Number(row.quantity);
  return entries;
}

/** Insert or update a single product's quantity for a date. */
export async function upsertEntry(date: string, productId: string, quantity: number): Promise<void> {
  await request(`/wastage_entries?on_conflict=entry_date,product_id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify([
      { entry_date: date, product_id: productId, quantity, updated_at: new Date().toISOString() },
    ]),
  });
}

/** Remove a single product's entry for a date (quantity cleared to nothing). */
export async function deleteEntry(date: string, productId: string): Promise<void> {
  await request(`/wastage_entries?entry_date=eq.${date}&product_id=eq.${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
}

/** Remove every entry for a date (used by "Clear all"). */
export async function deleteAllEntriesForDate(date: string): Promise<void> {
  await request(`/wastage_entries?entry_date=eq.${date}`, { method: "DELETE" });
}

export interface HistoryDay {
  date: string;
  itemCount: number;
}

/** One row per past date that has any entries, most recent first. */
export async function fetchHistorySummary(excludeDate: string): Promise<HistoryDay[]> {
  const rows = (await request(
    `/wastage_entries?entry_date=neq.${excludeDate}&select=entry_date,product_id&order=entry_date.desc`,
  )) as EntryRow[];
  const counts = new Map<string, number>();
  for (const row of rows) counts.set(row.entry_date, (counts.get(row.entry_date) ?? 0) + 1);
  return Array.from(counts.entries()).map(([date, itemCount]) => ({ date, itemCount }));
}
