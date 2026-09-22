import type { HistoryDay } from "../lib/supabase";
import "./HistoryView.css";

interface HistoryViewProps {
  days: HistoryDay[];
  status: "loading" | "ready" | "error";
  error: string | null;
  onClose: () => void;
  onSelect: (date: string) => void;
  onRetry: () => void;
}

function formatDay(iso: string): string {
  // Parse as local date, not UTC, so the label matches the date the entry
  // was actually logged under.
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function HistoryView({ days, status, error, onClose, onSelect, onRetry }: HistoryViewProps) {
  return (
    <div className="history" role="dialog" aria-label="Wastage history">
      <div className="history__header">
        <button type="button" className="history__back" onClick={onClose} aria-label="Back">
          ←
        </button>
        <div>
          <h2 className="history__title">History</h2>
          <p className="history__subtitle">Past days logged</p>
        </div>
      </div>

      {status === "loading" && (
        <div className="history__state">
          <span className="history__spinner" />
          Loading…
        </div>
      )}

      {status === "error" && (
        <div className="history__state history__state--error">
          <p>{error ?? "Couldn't load history."}</p>
          <button type="button" className="history__retry" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      {status === "ready" && days.length === 0 && (
        <div className="history__state">Nothing logged on previous days yet.</div>
      )}

      {status === "ready" && days.length > 0 && (
        <div className="history__list">
          {days.map((day) => (
            <button
              key={day.date}
              type="button"
              className="history__row"
              onClick={() => onSelect(day.date)}
            >
              <span className="history__row-date">{formatDay(day.date)}</span>
              <span className="history__row-count">
                {day.itemCount} {day.itemCount === 1 ? "product" : "products"}
              </span>
              <span className="history__row-arrow">→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
