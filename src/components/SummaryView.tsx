import { useMemo, useState } from "react";
import type { Product, WastageEntries } from "../types";
import { CATEGORY_ORDER } from "../data/products";
import "./SummaryView.css";

interface SummaryViewProps {
  products: Product[];
  entries: WastageEntries;
  onClose: () => void;
  /** Heading date text. Defaults to today's date, written out in full. */
  dateLabel?: string;
  /** Read-only mode for viewing a past day — hides remove/clear-all controls. */
  readOnly?: boolean;
  onClearAll?: () => void;
  onChange?: (productId: string, value: number | null) => void;
}

function formatQty(value: number, unit: string): string {
  const num = unit === "kg" ? trimTrailingZeros(value.toFixed(2)) : String(value);
  return `${num}${unit}`;
}

function trimTrailingZeros(s: string): string {
  return s.replace(/\.?0+$/, (m) => (m.startsWith(".") ? "" : m)).replace(/\.$/, "");
}

const defaultDateLabel = () =>
  new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

export function SummaryView({
  products,
  entries,
  onClose,
  dateLabel,
  readOnly = false,
  onClearAll,
  onChange,
}: SummaryViewProps) {
  const [confirmingClear, setConfirmingClear] = useState(false);
  const resolvedDateLabel = dateLabel ?? defaultDateLabel();

  const byCategory = useMemo(() => {
    const grouped = new Map<string, Product[]>();
    for (const product of products) {
      if (!(entries[product.id] > 0)) continue;
      const list = grouped.get(product.category) ?? [];
      list.push(product);
      grouped.set(product.category, list);
    }
    return CATEGORY_ORDER.filter((c) => grouped.has(c)).map((c) => ({
      category: c,
      items: grouped.get(c)!,
    }));
  }, [products, entries]);

  const totalItems = byCategory.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="summary" role="dialog" aria-label="Wastage summary">
      <div className="summary__header">
        <button type="button" className="summary__back" onClick={onClose} aria-label="Back">
          ←
        </button>
        <div>
          <h2 className="summary__title">{readOnly ? resolvedDateLabel : "Summary sheet"}</h2>
          <p className="summary__subtitle">
            {totalItems} {totalItems === 1 ? "product" : "products"} logged
          </p>
        </div>
      </div>

      {totalItems === 0 ? (
        <div className="summary__empty">
          <p>Nothing logged{readOnly ? " that day." : " yet."}</p>
          {!readOnly && (
            <p className="summary__empty-sub">Enter a quantity against any product to add it here.</p>
          )}
        </div>
      ) : (
        <>
          <div className="summary__list">
            {byCategory.map((group) => (
              <div key={group.category} className="summary__group">
                <h3 className="summary__group-title">{group.category}</h3>
                {group.items.map((product) => (
                  <div key={product.id} className="summary__row">
                    <span className="summary__row-name">{product.name}</span>
                    <span className="summary__row-qty">
                      {formatQty(entries[product.id], product.unit)}
                    </span>
                    {!readOnly && (
                      <button
                        type="button"
                        className="summary__row-remove"
                        onClick={() => onChange?.(product.id, null)}
                        aria-label={`Remove ${product.name}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {!readOnly && (
            <div className="summary__actions">
              {confirmingClear ? (
                <div className="summary__confirm">
                  <span>Clear the whole sheet?</span>
                  <button
                    type="button"
                    className="summary__confirm-yes"
                    onClick={() => {
                      onClearAll?.();
                      setConfirmingClear(false);
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="summary__confirm-no"
                    onClick={() => setConfirmingClear(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" className="summary__clear" onClick={() => setConfirmingClear(true)}>
                  Clear all
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
