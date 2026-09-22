import { useCallback, useEffect, useMemo, useState } from "react";
import type { WastageEntries } from "../types";

const ENTRIES_KEY = "subventory:wastage:entries";
const DATE_KEY = "subventory:wastage:date";

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function loadEntries(): WastageEntries {
  try {
    const storedDate = localStorage.getItem(DATE_KEY);
    if (storedDate !== todayKey()) {
      // New day — start a fresh sheet rather than carry over yesterday's counts.
      return {};
    }
    const raw = localStorage.getItem(ENTRIES_KEY);
    return raw ? (JSON.parse(raw) as WastageEntries) : {};
  } catch {
    return {};
  }
}

/**
 * Tracks today's wastage entries in state and mirrors them to localStorage,
 * so a refresh or an accidental tab close during a shift doesn't lose counts.
 * The sheet automatically clears itself at the start of a new day.
 */
export function useWastage() {
  const [entries, setEntries] = useState<WastageEntries>(() => loadEntries());

  useEffect(() => {
    try {
      localStorage.setItem(DATE_KEY, todayKey());
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    } catch {
      // Storage can be unavailable (private browsing, quota) — the app still
      // works for the session, it just won't survive a refresh.
    }
  }, [entries]);

  const setQuantity = useCallback((productId: string, quantity: number | null) => {
    setEntries((prev) => {
      const next = { ...prev };
      if (quantity === null || Number.isNaN(quantity) || quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setEntries({}), []);

  const recordedCount = useMemo(() => Object.keys(entries).length, [entries]);

  return { entries, setQuantity, clearAll, recordedCount };
}
