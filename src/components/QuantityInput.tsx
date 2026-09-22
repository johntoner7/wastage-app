import { useEffect, useState } from "react";
import type { Unit } from "../types";
import "./QuantityInput.css";

interface QuantityInputProps {
  unit: Unit;
  value: number | undefined;
  onChange: (value: number | null) => void;
}

const STEP: Record<Unit, number> = { kg: 0.1, ea: 1 };

function formatForInput(value: number | undefined, unit: Unit): string {
  if (value === undefined) return "";
  return unit === "kg" ? trimTrailingZeros(value.toFixed(2)) : String(value);
}

function trimTrailingZeros(s: string): string {
  return s.replace(/\.?0+$/, (m) => (m.startsWith(".") ? "" : m)).replace(/\.$/, "");
}

export function QuantityInput({ unit, value, onChange }: QuantityInputProps) {
  const [text, setText] = useState(() => formatForInput(value, unit));

  // Keep the field in sync if the value changes from outside (e.g. cleared
  // from the summary screen) without fighting the user's own typing.
  useEffect(() => {
    setText(formatForInput(value, unit));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = (raw: string) => {
    if (raw.trim() === "") {
      onChange(null);
      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      onChange(null);
      return;
    }
    onChange(parsed);
  };

  const step = (delta: number) => {
    const current = value ?? 0;
    const next = Math.max(0, Math.round((current + delta) * 100) / 100);
    onChange(next === 0 ? null : next);
  };

  const isActive = value !== undefined && value > 0;

  return (
    <div className={`qty${isActive ? " qty--active" : ""}`}>
      <button
        type="button"
        className="qty__step"
        aria-label={`Decrease ${unit === "kg" ? "by 0.1kg" : "by 1"}`}
        onClick={() => step(-STEP[unit])}
      >
        –
      </button>
      <div className="qty__field">
        <input
          inputMode="decimal"
          placeholder="0"
          value={text}
          onChange={(e) => {
            const v = e.target.value;
            if (/^\d*\.?\d*$/.test(v)) setText(v);
          }}
          onBlur={(e) => commit(e.target.value)}
          aria-label={`${unit === "kg" ? "Kilograms" : "Quantity"} wasted`}
        />
        <span className="qty__unit">{unit}</span>
      </div>
      <button
        type="button"
        className="qty__step"
        aria-label={`Increase ${unit === "kg" ? "by 0.1kg" : "by 1"}`}
        onClick={() => step(STEP[unit])}
      >
        +
      </button>
    </div>
  );
}
