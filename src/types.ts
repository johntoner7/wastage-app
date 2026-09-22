export type Unit = "kg" | "ea";

export interface Product {
  /** Stable identifier, also used as the localStorage key fragment. */
  id: string;
  name: string;
  category: string;
  unit: Unit;
}

/** Wastage quantities keyed by product id. A missing key means "not recorded". */
export type WastageEntries = Record<string, number>;
