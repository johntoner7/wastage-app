import { useCallback, useEffect, useState } from "react";
import { fetchEntriesForDate, fetchHistorySummary, NetworkError, type HistoryDay } from "../lib/supabase";
import type { WastageEntries } from "../types";
import { todayISO } from "./useWastage";

type Status = "loading" | "ready" | "error";

function friendlyMessage(e: unknown, fallback: string): string {
  if (e instanceof NetworkError) {
    return "Can't reach the server — check your connection and try again.";
  }
  return e instanceof Error ? e.message : fallback;
}

/** List of past dates that have logged entries, most recent first. */
export function useHistoryList(enabled: boolean) {
  const [days, setDays] = useState<HistoryDay[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const summary = await fetchHistorySummary(todayISO());
      setDays(summary);
      setStatus("ready");
      setError(null);
    } catch (e) {
      setStatus("error");
      setError(friendlyMessage(e, "Couldn't load history."));
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  return { days, status, error, reload: load };
}

/** Read-only entries for a single past date. */
export function useHistoryDay(date: string | null) {
  const [entries, setEntries] = useState<WastageEntries>({});
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!date) return () => {};
    let cancelled = false;
    setStatus("loading");
    fetchEntriesForDate(date)
      .then((fetched) => {
        if (cancelled) return;
        setEntries(fetched);
        setStatus("ready");
        setError(null);
      })
      .catch((e) => {
        if (cancelled) return;
        setStatus("error");
        setError(friendlyMessage(e, "Couldn't load that day."));
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  useEffect(() => load(), [load]);

  return { entries, status, error, reload: load };
}
