import type { Product } from "../types";
import { QuantityInput } from "./QuantityInput";
import "./ProductRow.css";

interface ProductRowProps {
  product: Product;
  value: number | undefined;
  pending?: boolean;
  onChange: (value: number | null) => void;
}

function initials(name: string): string {
  const words = name.replace(/[–—]/g, " ").split(" ").filter(Boolean);
  return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function ProductRow({ product, value, pending = false, onChange }: ProductRowProps) {
  const isActive = value !== undefined && value > 0;
  return (
    <div className={`row${isActive ? " row--active" : ""}`}>
      <div className="row__badge" aria-hidden="true">
        {initials(product.name)}
        {isActive && (
          <span className="row__badge-check">
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.2 5.7L8 1" stroke="#0d1a10" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
      <div className="row__name">
        {product.name}
        {pending && (
          <span className="row__pending" title="Not yet synced">
            •
          </span>
        )}
      </div>
      <QuantityInput unit={product.unit} value={value} onChange={onChange} />
    </div>
  );
}
