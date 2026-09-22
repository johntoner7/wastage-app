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
  const hasActivity = recordedInCategory > 0;

  return (
    <section className="category">
      <button
        type="button"
        className={`category__header${hasActivity ? " category__header--active" : ""}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={`category__chevron${isOpen ? " category__chevron--open" : ""}`}>
          ▸
        </span>
        <span className="category__title">{category}</span>
        <span className={`category__count${hasActivity ? " category__count--active" : ""}`}>
          {hasActivity ? `${recordedInCategory} logged` : `${products.length}`}
        </span>
      </button>
      <div className={`category__collapse${isOpen ? " category__collapse--open" : ""}`}>
        <div className="category__body" aria-hidden={!isOpen}>
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
      </div>
    </section>
  );
}
