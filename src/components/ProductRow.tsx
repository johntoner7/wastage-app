import type { Product } from "../types";
import { QuantityInput } from "./QuantityInput";
import "./ProductRow.css";

interface ProductRowProps {
  product: Product;
  value: number | undefined;
  onChange: (value: number | null) => void;
}

function initials(name: string): string {
  const words = name.replace(/[–—]/g, " ").split(" ").filter(Boolean);
  return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function ProductRow({ product, value, onChange }: ProductRowProps) {
  const isActive = value !== undefined && value > 0;
  return (
    <div className={`row${isActive ? " row--active" : ""}`}>
      <div className="row__badge" aria-hidden="true">
        {initials(product.name)}
      </div>
      <div className="row__name">{product.name}</div>
      <QuantityInput unit={product.unit} value={value} onChange={onChange} />
    </div>
  );
}
