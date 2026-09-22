export type Unit = "kg" | "ea";

export interface Product {
  /** Stable identifier, also used as the API's row key. */
  id: string;
  name: string;
  category: string;
  unit: Unit;
}

/** Wastage quantities keyed by product id. A missing key means "not recorded". */
export type WastageEntries = Record<string, number>;
