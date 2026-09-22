import { useMemo, useState } from "react";
import { CATEGORY_ORDER, PRODUCTS } from "./data/products";
import { useWastage } from "./hooks/useWastage";
import { Header } from "./components/Header";
import { CategorySection } from "./components/CategorySection";
import { SummaryBar } from "./components/SummaryBar";
import { SummaryView } from "./components/SummaryView";
import "./App.css";

export default function App() {
  const { entries, setQuantity, clearAll, recordedCount } = useWastage();
  const [query, setQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set([CATEGORY_ORDER[0]]),
  );
  const [showSummary, setShowSummary] = useState(false);

  const isSearching = query.trim().length > 0;

  const filteredByCategory = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATEGORY_ORDER.map((category) => ({
      category,
      products: PRODUCTS.filter(
        (p) => p.category === category && (q === "" || p.name.toLowerCase().includes(q)),
      ),
    })).filter((group) => group.products.length > 0);
  }, [query]);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  return (
    <div className="app">
      <Header query={query} onQueryChange={setQuery} />

      <main className="app__list">
        {filteredByCategory.length === 0 ? (
          <div className="app__no-results">
            <p>No products match “{query}”.</p>
          </div>
        ) : (
          filteredByCategory.map(({ category, products }) => (
            <CategorySection
              key={category}
              category={category}
              products={products}
              entries={entries}
              isOpen={isSearching || openCategories.has(category)}
              onToggle={() => toggleCategory(category)}
              onChange={setQuantity}
            />
          ))
        )}
        <div className="app__list-end" />
      </main>

      <SummaryBar count={recordedCount} onOpen={() => setShowSummary(true)} />

      {showSummary && (
        <SummaryView
          products={PRODUCTS}
          entries={entries}
          onClose={() => setShowSummary(false)}
          onClearAll={clearAll}
          onChange={setQuantity}
        />
      )}
    </div>
  );
}
