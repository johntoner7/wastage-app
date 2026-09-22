import "./SummaryBar.css";

interface SummaryBarProps {
  count: number;
  onOpen: () => void;
}

export function SummaryBar({ count, onOpen }: SummaryBarProps) {
  if (count === 0) return null;

  return (
    <div className="summarybar">
      <button type="button" className="summarybar__button" onClick={onOpen}>
        <span className="summarybar__count">{count}</span>
        <span>{count === 1 ? "item logged" : "items logged"} — review sheet</span>
        <span className="summarybar__arrow">→</span>
      </button>
    </div>
  );
}
