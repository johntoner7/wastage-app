/**
 * A best-effort local copy of the last entries successfully fetched for a
 * date, so reopening the app while offline shows the last known state
 * instead of a blank sheet. This is a cache, not a source of truth —
 * the API always wins once it's reachable again.
 */

import type { WastageEntries } from "../types";

function cacheKey(date: string): string {
  return `subventory:wastage:cache:${date}`;
}

export function loadCachedEntries(date: string): WastageEntries | null {
  try {
    const raw = localStorage.getItem(cacheKey(date));
    return raw ? (JSON.parse(raw) as WastageEntries) : null;
  } catch {
    return null;
  }
}

export function saveCachedEntries(date: string, entries: WastageEntries): void {
  try {
    localStorage.setItem(cacheKey(date), JSON.stringify(entries));
  } catch {
    // Storage unavailable — nothing to fall back on if offline, but the
    // live session is unaffected.
  }
}
