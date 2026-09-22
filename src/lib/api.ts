/**
 * Client for the app's Cloudflare Worker + D1 API (see worker/).
 *
 * Requires VITE_API_URL and VITE_API_TOKEN (see .env.example). The token is
 * safe to expose client-side — it's not meaningfully secret, since it ships
 * inside the app's built JavaScript. It just keeps the API from being open
 * to anyone who finds the URL. See worker/README.md for the trade-off.
 */

const API_URL = import.meta.env.VITE_API_URL as string | undefined;
const API_TOKEN = import.meta.env.VITE_API_TOKEN as string | undefined;

export const isApiConfigured = Boolean(API_URL && API_TOKEN);

const BASE = API_URL ? API_URL.replace(/\/$/, "") : "";

/** Thrown when the request never reached the server — offline, DNS failure,
 * timeout, etc. Callers treat this as "try again later", not a real error. */
export class NetworkError extends Error {}

/** Thrown when the server responded but rejected the request (bad config,
 * auth failure, validation failure). Retrying won't help without a fix. */
export class ApiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request(path: string, init?: RequestInit) {
  if (!isApiConfigured) {
    throw new Error("API isn't configured — set VITE_API_URL and VITE_API_TOKEN.");
  }
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${API_TOKEN ?? ""}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch (e) {
    // fetch() itself throws (TypeError) when the request never left the
    // browser — no connection, DNS failure, CORS block, etc.
    throw new NetworkError(e instanceof Error ? e.message : "Network request failed");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiRequestError(body || res.statusText, res.status);
  }
  if (res.status === 204) return null;
  return res.json();
}

/** All logged quantities for one date, keyed by product id. */
export async function fetchEntriesForDate(date: string): Promise<Record<string, number>> {
  return (await request(`/entries?date=${date}`)) as Record<string, number>;
}

/** Insert or update a single product's quantity for a date. */
export async function upsertEntry(date: string, productId: string, quantity: number): Promise<void> {
  await request(`/entries`, {
    method: "PUT",
    body: JSON.stringify({ date, productId, quantity }),
  });
}

/** Remove a single product's entry for a date (quantity cleared to nothing). */
export async function deleteEntry(date: string, productId: string): Promise<void> {
  await request(`/entries?date=${date}&productId=${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
}

/** Remove every entry for a date (used by "Clear all"). */
export async function deleteAllEntriesForDate(date: string): Promise<void> {
  await request(`/entries?date=${date}`, { method: "DELETE" });
}

export interface HistoryDay {
  date: string;
  itemCount: number;
}

/** One row per past date that has any entries, most recent first. */
export async function fetchHistorySummary(excludeDate: string): Promise<HistoryDay[]> {
  return (await request(`/history?exclude=${excludeDate}`)) as HistoryDay[];
}
