/**
 * A small durable queue for writes that couldn't reach the API yet.
 * Backrooms and walk-in freezers are exactly where wifi tends to be worst,
 * so writes are applied to local state immediately and queued here to
 * retry, rather than blocking on the network or getting lost if the tab
 * closes before it's back online.
 *
 * Keyed by `${date}::${productId}` so repeated edits to the same product
 * before it syncs just overwrite each other — only the latest value is
 * ever sent.
 */

export interface QueuedWrite {
  date: string;
  productId: string;
  /** null means "delete this entry" (quantity was cleared to zero/empty). */
  quantity: number | null;
  queuedAt: number;
}

const QUEUE_KEY = "subventory:wastage:pending-writes";

export function queueKey(date: string, productId: string): string {
  return `${date}::${productId}`;
}

export function loadQueue(): Record<string, QueuedWrite> {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, QueuedWrite>) : {};
  } catch {
    return {};
  }
}

export function saveQueue(queue: Record<string, QueuedWrite>): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // Storage unavailable — the queue still works for this session, it just
    // won't survive a refresh while offline.
  }
}
