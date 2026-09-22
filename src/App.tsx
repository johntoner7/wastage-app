import { useMemo, useState } from "react";
import { CATEGORY_ORDER, PRODUCTS } from "./data/products";
import { useWastage } from "./hooks/useWastage";
import { useHistoryDay, useHistoryList } from "./hooks/useHistory";
import { isApiConfigured } from "./lib/api";
import { Header } from "./components/Header";
import { CategorySection } from "./components/CategorySection";
import { SummaryBar } from "./components/SummaryBar";
import { SummaryView } from "./components/SummaryView";
import { HistoryView } from "./components/HistoryView";
import { ConfigNotice } from "./components/ConfigNotice";
import { ErrorBanner } from "./components/ErrorBanner";
import { SyncStatus } from "./components/SyncStatus";
import { ListSkeleton } from "./components/Skeleton";
import "./App.css";

type View = "list" | "summary" | "history" | "historyDay";

export default function App() {
  const {
    entries,
    setQuantity,
    clearAll,
    recordedCount,
    status,
    error,
    reload,
    pendingCount,
    pendingProductIds,
    syncing,
    usingCache,
    flushQueue,
  } = useWastage();
  const [query, setQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set([CATEGORY_ORDER[0]]),
  );
  const [view, setView] = useState<View>("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const historyList = useHistoryList(view === "history");
  const historyDay = useHistoryDay(view === "historyDay" ? selectedDate : null);

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

  if (!isApiConfigured) {
    return (
      <div className="app">
        <Header query={query} onQueryChange={setQuery} onOpenHistory={() => setView("history")} />
        <ConfigNotice />
      </div>
    );
  }

  if (view === "history") {
    return (
      <HistoryView
        days={historyList.days}
        status={historyList.status}
        error={historyList.error}
        onClose={() => setView("list")}
        onSelect={(date) => {
          setSelectedDate(date);
          setView("historyDay");
        }}
        onRetry={historyList.reload}
      />
    );
  }

  if (view === "historyDay" && selectedDate) {
    const dateLabel = (() => {
      const [y, m, d] = selectedDate.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    })();

    if (historyDay.status === "loading") {
      return (
        <div className="history">
          <div className="history__header">
            <button type="button" className="history__back" onClick={() => setView("history")} aria-label="Back">
              ←
            </button>
            <div>
              <h2 className="history__title">{dateLabel}</h2>
            </div>
          </div>
          <div className="history__state">
            <span className="history__spinner" />
            Loading…
          </div>
        </div>
      );
    }

    if (historyDay.status === "error") {
      return (
        <div className="history">
          <div className="history__header">
            <button type="button" className="history__back" onClick={() => setView("history")} aria-label="Back">
              ←
            </button>
            <div>
              <h2 className="history__title">{dateLabel}</h2>
            </div>
          </div>
          <div className="history__state history__state--error">
            <p>{historyDay.error ?? "Couldn't load that day."}</p>
            <button type="button" className="history__retry" onClick={historyDay.reload}>
              Try again
            </button>
          </div>
        </div>
      );
    }

    return (
      <SummaryView
        products={PRODUCTS}
        entries={historyDay.entries}
        dateLabel={dateLabel}
        readOnly
        onClose={() => setView("history")}
      />
    );
  }

  return (
    <div className="app">
      <Header query={query} onQueryChange={setQuery} onOpenHistory={() => setView("history")} />

      {/* A real, non-network problem (bad config, RLS, etc.) — needs attention. */}
      {error && <ErrorBanner message={error} onRetry={reload} />}

      {/* Offline / queued writes — expected in a backroom or freezer, not an error. */}
      <SyncStatus
        pendingCount={pendingCount}
        syncing={syncing}
        usingCache={usingCache}
        onSync={() => {
          reload();
          flushQueue();
        }}
      />

      {status === "loading" && recordedCount === 0 ? (
        <ListSkeleton />
      ) : (
        <main className="app__list">
          {filteredByCategory.length === 0 ? (
            <div className="app__no-results">
              <p>No products match "{query}".</p>
            </div>
          ) : (
            filteredByCategory.map(({ category, products }) => (
              <CategorySection
                key={category}
                category={category}
                products={products}
                entries={entries}
                pendingProductIds={pendingProductIds}
                isOpen={isSearching || openCategories.has(category)}
                onToggle={() => toggleCategory(category)}
                onChange={setQuantity}
              />
            ))
          )}
          <div className="app__list-end" />
        </main>
      )}

      <SummaryBar count={recordedCount} onOpen={() => setView("summary")} />

      {view === "summary" && (
        <SummaryView
          products={PRODUCTS}
          entries={entries}
          onClose={() => setView("list")}
          onClearAll={clearAll}
          onChange={setQuantity}
        />
      )}
    </div>
  );
}
