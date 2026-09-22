import { useCallback, useState } from "react";
import type { Product, Unit } from "../types";
import { loadCustomProducts, makeCustomProductId, saveCustomProducts } from "../lib/customProducts";

export function useCustomProducts() {
  const [customProducts, setCustomProducts] = useState<Product[]>(() => loadCustomProducts());

  const addCustomProduct = useCallback((name: string, category: string, unit: Unit): Product => {
    const product: Product = { id: makeCustomProductId(name), name: name.trim(), category, unit };
    setCustomProducts((prev) => {
      const next = [...prev, product];
      saveCustomProducts(next);
      return next;
    });
    return product;
  }, []);

  const removeCustomProduct = useCallback((productId: string) => {
    setCustomProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      saveCustomProducts(next);
      return next;
    });
  }, []);

  return { customProducts, addCustomProduct, removeCustomProduct };
}
