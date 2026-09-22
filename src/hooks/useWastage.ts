import { useCallback, useEffect, useState } from "react";
import {
  deleteAllEntriesForDate,
  deleteEntry,
  fetchEntriesForDate,
  isSupabaseConfigured,
  upsertEntry,
} from "../lib/supabase";
import type { WastageEntries } from "../types";

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type Status = "loading" | "ready" | "error";

/**
 * Loads and syncs today's wastage entries against Supabase, so the same
 * sheet is visible from any device. Writes are applied to local state
 * immediately (so the UI feels instant) and pushed to Supabase in the
 * background; if a write fails, we surface an error and re-fetch from
 * the server so local state can't silently drift from what's saved.
 */
export function useWastage() {
  const date = todayISO();
  const [entries, setEntries] = useState<WastageEntries>({});
  const [status, setStatus] = useState<Status>(isSupabaseConfigured ? "loading" : "error");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setStatus("error");
      setError("Supabase isn't configured yet — see README.md to connect a project.");
      return;
    }
    setStatus("loading");
    try {
      const fetched = await fetchEntriesForDate(date);
      setEntries(fetched);
      setStatus("ready");
      setError(null);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Couldn't load today's sheet.");
    }
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  const setQuantity = useCallback(
    (productId: string, quantity: number | null) => {
      setEntries((prev) => {
        const next = { ...prev };
        if (quantity === null || Number.isNaN(quantity) || quantity <= 0) delete next[productId];
        else next[productId] = quantity;
        return next;
      });

      (async () => {
        try {
          if (quantity === null || Number.isNaN(quantity) || quantity <= 0) {
            await deleteEntry(date, productId);
          } else {
            await upsertEntry(date, productId, quantity);
          }
          setError(null);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Couldn't save that change — check your connection.");
          load();
        }
      })();
    },
    [date, load],
  );

  const clearAll = useCallback(async () => {
    setEntries({});
    try {
      await deleteAllEntriesForDate(date);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't clear the sheet — check your connection.");
      load();
    }
  }, [date, load]);

  const recordedCount = Object.keys(entries).length;

  return { entries, setQuantity, clearAll, recordedCount, status, error, reload: load, date };
}
