import { useState } from "react";
import type { Unit } from "../types";
import "./AddItemModal.css";

interface AddItemModalProps {
  categories: string[];
  initialName?: string;
  onAdd: (name: string, category: string, unit: Unit) => void;
  onClose: () => void;
}

const OTHER_CATEGORY = "Other";

export function AddItemModal({ categories, initialName = "", onAdd, onClose }: AddItemModalProps) {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState(categories[0] ?? OTHER_CATEGORY);
  const [unit, setUnit] = useState<Unit>("kg");

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onAdd(trimmedName, category, unit);
  };

  return (
    <div className="add-item" role="dialog" aria-label="Add a custom item">
      <form className="add-item__sheet" onSubmit={handleSubmit}>
        <div className="add-item__header">
          <h2 className="add-item__title">Add item</h2>
          <button type="button" className="add-item__close" onClick={onClose} aria-label="Cancel">
            ✕
          </button>
        </div>

        <label className="add-item__field">
          <span>Item name</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chipotle Mayo"
          />
        </label>

        <label className="add-item__field">
          <span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            {!categories.includes(OTHER_CATEGORY) && <option value={OTHER_CATEGORY}>{OTHER_CATEGORY}</option>}
          </select>
        </label>

        <div className="add-item__field">
          <span>Tracked as</span>
          <div className="add-item__unit-toggle">
            <button
              type="button"
              className={`add-item__unit-option${unit === "kg" ? " add-item__unit-option--active" : ""}`}
              onClick={() => setUnit("kg")}
            >
              Weight (kg)
            </button>
            <button
              type="button"
              className={`add-item__unit-option${unit === "ea" ? " add-item__unit-option--active" : ""}`}
              onClick={() => setUnit("ea")}
            >
              Count (ea)
            </button>
          </div>
        </div>

        <button type="submit" className="add-item__submit" disabled={!canSubmit}>
          Add to list
        </button>
      </form>
    </div>
  );
}
