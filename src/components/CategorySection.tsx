import type { Product, WastageEntries } from "../types";
import { ProductRow } from "./ProductRow";
import "./CategorySection.css";

interface CategorySectionProps {
  category: string;
  products: Product[];
  entries: WastageEntries;
  pendingProductIds: Set<string>;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (productId: string, value: number | null) => void;
}

export function CategorySection({
  category,
  products,
  entries,
  pendingProductIds,
  isOpen,
  onToggle,
  onChange,
}: CategorySectionProps) {
  const recordedInCategory = products.filter((p) => entries[p.id] > 0).length;

  return (
    <section className="category">
      <button
        type="button"
        className="category__header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={`category__chevron${isOpen ? " category__chevron--open" : ""}`}>
          ▸
        </span>
        <span className="category__title">{category}</span>
        <span className="category__count">
          {recordedInCategory > 0 ? `${recordedInCategory} logged` : `${products.length}`}
        </span>
      </button>
      {isOpen && (
        <div className="category__body">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              value={entries[product.id]}
              pending={pendingProductIds.has(product.id)}
              onChange={(value) => onChange(product.id, value)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
