import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteEntry,
  fetchEntriesForDate,
  isSupabaseConfigured,
  NetworkError,
  upsertEntry,
} from "../lib/supabase";
import { loadCachedEntries, saveCachedEntries } from "../lib/localCache";
import { loadQueue, queueKey, saveQueue, type QueuedWrite } from "../lib/pendingQueue";
import type { WastageEntries } from "../types";

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type Status = "loading" | "ready" | "error";

function applyWrite(entries: WastageEntries, write: QueuedWrite): WastageEntries {
  const next = { ...entries };
  if (write.quantity === null) delete next[write.productId];
  else next[write.productId] = write.quantity;
  return next;
}

/**
 * Loads and syncs today's wastage entries against Supabase, so the same
 * sheet is visible from any device — while staying usable when the
 * connection is bad or absent, which is common in backrooms and freezers.
 *
 * Writes apply to local state immediately and are queued to
 * localStorage; a queued write is only dropped once it's confirmed saved.
 * The queue is flushed on every write, whenever the browser reports it's
 * back online, and on a short interval as a fallback for connections that
 * don't fire that event reliably.
 */
export function useWastage() {
  const date = todayISO();
  const [entries, setEntries] = useState<WastageEntries>({});
  const [status, setStatus] = useState<Status>(isSupabaseConfigured ? "loading" : "error");
  const [error, setError] = useState<string | null>(null);
  const [usingCache, setUsingCache] = useState(false);
  const [pending, setPending] = useState<Record<string, QueuedWrite>>(() => loadQueue());
  const [syncing, setSyncing] = useState(false);

  const pendingRef = useRef(pending);
  pendingRef.current = pending;
  const flushingRef = useRef(false);

  const updatePending = useCallback((updater: (prev: Record<string, QueuedWrite>) => Record<string, QueuedWrite>) => {
    setPending((prev) => {
      const next = updater(prev);
      saveQueue(next);
      pendingRef.current = next;
      return next;
    });
  }, []);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setStatus("error");
      setError("Supabase isn't configured yet — see README.md to connect a project.");
      return;
    }
    setStatus("loading");
    try {
      const fetched = await fetchEntriesForDate(date);
      let merged = fetched;
      for (const write of Object.values(pendingRef.current)) {
        if (write.date === date) merged = applyWrite(merged, write);
      }
      setEntries(merged);
      saveCachedEntries(date, merged);
      setUsingCache(false);
      setStatus("ready");
      setError(null);
    } catch (e) {
      // Can't reach the server (or it rejected us) — fall back to the last
      // cached copy, overlaid with anything still queued, so the sheet
      // isn't just blank while offline.
      const cached = loadCachedEntries(date) ?? {};
      let merged = cached;
      for (const write of Object.values(pendingRef.current)) {
        if (write.date === date) merged = applyWrite(merged, write);
      }
      setEntries(merged);
      setUsingCache(true);
      setStatus("ready");
      if (!(e instanceof NetworkError)) {
        setError(e instanceof Error ? e.message : "Couldn't load today's sheet.");
      } else {
        setError(null);
      }
    }
  }, [date]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const flushQueue = useCallback(async () => {
    if (flushingRef.current) return;
    flushingRef.current = true;
    setSyncing(true);
    try {
      const keys = Object.keys(pendingRef.current);
      for (const key of keys) {
        const write = pendingRef.current[key];
        if (!write) continue;
        try {
          if (write.quantity === null) {
            await deleteEntry(write.date, write.productId);
          } else {
            await upsertEntry(write.date, write.productId, write.quantity);
          }
          // Only clear this key if it hasn't been superseded by a newer
          // edit made while the request was in flight.
          updatePending((prev) => {
            if (prev[key]?.queuedAt !== write.queuedAt) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
          });
          setError(null);
        } catch (e) {
          if (e instanceof NetworkError) {
            // Still offline — stop this pass, the interval/online listener
            // will try again shortly. Leave everything else queued.
            break;
          }
          // A real rejection (bad config, RLS, etc.) — surface it, but
          // leave the write queued rather than silently dropping data.
          setError(e instanceof Error ? e.message : "Couldn't save a queued change.");
        }
      }
    } finally {
      flushingRef.current = false;
      setSyncing(false);
    }
  }, [updatePending]);

  // Retry whenever the browser regains connectivity, and periodically as a
  // fallback for flaky connections that don't fire the 'online' event.
  useEffect(() => {
    const onOnline = () => flushQueue();
    window.addEventListener("online", onOnline);
    const interval = setInterval(() => {
      if (Object.keys(pendingRef.current).length > 0) flushQueue();
    }, 15000);
    return () => {
      window.removeEventListener("online", onOnline);
      clearInterval(interval);
    };
  }, [flushQueue]);

  const setQuantity = useCallback(
    (productId: string, quantity: number | null) => {
      const normalized = quantity !== null && quantity > 0 && !Number.isNaN(quantity) ? quantity : null;

      setEntries((prev) => {
        const next = { ...prev };
        if (normalized === null) delete next[productId];
        else next[productId] = normalized;
        saveCachedEntries(date, next);
        return next;
      });

      const write: QueuedWrite = { date, productId, quantity: normalized, queuedAt: Date.now() };
      updatePending((prev) => ({ ...prev, [queueKey(date, productId)]: write }));
      flushQueue();
    },
    [date, flushQueue, updatePending],
  );

  const clearAll = useCallback(() => {
    const idsToClear = Object.keys(entries);
    setEntries({});
    saveCachedEntries(date, {});
    updatePending((prev) => {
      const next = { ...prev };
      for (const productId of idsToClear) {
        next[queueKey(date, productId)] = { date, productId, quantity: null, queuedAt: Date.now() };
      }
      return next;
    });
    flushQueue();
  }, [date, entries, flushQueue, updatePending]);

  const pendingCount = Object.values(pending).filter((w) => w.date === date).length;

  return {
    entries,
    setQuantity,
    clearAll,
    recordedCount: Object.keys(entries).length,
    status,
    error,
    reload: load,
    date,
    pendingCount,
    pendingProductIds: new Set(
      Object.values(pending)
        .filter((w) => w.date === date)
        .map((w) => w.productId),
    ),
    syncing,
    usingCache,
    flushQueue,
  };
}
