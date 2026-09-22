/**
 * Custom products a store adds for items missing from the built-in
 * catalogue (see data/products.ts). Kept in localStorage — there's no API
 * endpoint for product metadata, only for daily entries, so this list is
 * per-device rather than synced.
 */

import type { Product } from "../types";

const KEY = "subventory:wastage:customProducts";

export function loadCustomProducts(): Product[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomProducts(products: Product[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(products));
  } catch {
    // Storage unavailable — the item still works for the rest of this
    // session, it just won't be there next time the app opens.
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function makeCustomProductId(name: string): string {
  const slug = slugify(name) || "item";
  return `custom-${slug}-${Date.now().toString(36)}`;
}
