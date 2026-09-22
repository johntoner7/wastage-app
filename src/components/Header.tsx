import "./Header.css";

interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  onOpenHistory: () => void;
}

const dateLabel = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function Header({ query, onQueryChange, onOpenHistory }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__top">
        <div className="header__brand">
          <span className="header__mark" aria-hidden="true" />
          <div className="header__brand-text">
            <h1 className="header__title">Wastage</h1>
            <p className="header__subtitle">Line check · {dateLabel}</p>
          </div>
        </div>
        <button type="button" className="header__history" onClick={onOpenHistory}>
          History
        </button>
      </div>
      <div className="header__search">
        <svg
          className="header__search-icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
        />
        {query && (
          <button
            type="button"
            className="header__clear"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </header>
  );
}
