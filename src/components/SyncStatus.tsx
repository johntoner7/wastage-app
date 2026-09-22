import { useEffect, useState } from "react";
import "./SyncStatus.css";

interface SyncStatusProps {
  pendingCount: number;
  syncing: boolean;
  usingCache: boolean;
  onSync: () => void;
}

/** A queued write is normal and usually clears within a few hundred ms —
 * showing the banner immediately for every single tap made it flash
 * constantly. Only surface it once a sync has been outstanding long
 * enough to suggest a real connectivity problem. */
const SHOW_DELAY_MS = 800;

export function SyncStatus({ pendingCount, syncing, usingCache, onSync }: SyncStatusProps) {
  const shouldShow = pendingCount > 0 || usingCache;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!shouldShow) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [shouldShow]);

  if (!visible) return null;

  const label =
    pendingCount > 0
      ? syncing
        ? "Syncing…"
        : `${pendingCount} change${pendingCount === 1 ? "" : "s"} waiting to sync`
      : "Offline — showing last saved copy";

  return (
    <div className="syncstatus">
      <span className={`syncstatus__dot${syncing ? " syncstatus__dot--syncing" : ""}`} aria-hidden="true" />
      <span className="syncstatus__label">{label}</span>
      {!syncing && (
        <button type="button" className="syncstatus__retry" onClick={onSync}>
          {pendingCount > 0 ? "Sync now" : "Retry"}
        </button>
      )}
    </div>
  );
}
