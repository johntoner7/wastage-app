import "./SyncStatus.css";

interface SyncStatusProps {
  pendingCount: number;
  syncing: boolean;
  usingCache: boolean;
  onSync: () => void;
}

export function SyncStatus({ pendingCount, syncing, usingCache, onSync }: SyncStatusProps) {
  if (pendingCount === 0 && !usingCache) return null;

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
