import type { CaseMaterial, DialLayout } from "@kronos/contracts";
import { ENGRAVING_PRICE, MAX_QUANTITY_PER_ITEM } from "@kronos/contracts";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartLine {
  /** productId + strap + engraving: the same watch with another strap is another line */
  key: string;
  productId: string;
  slug: string;
  name: string;
  reference: string;
  image: string | null;
  appearance: { dial: string; accent: string; layout: DialLayout };
  caseMaterial: CaseMaterial;
  strapId: string;
  strapName: string;
  /** Rial, snapshot for display only; the API prices every order from the database */
  unitPrice: number;
  strapPrice: number;
  engraving: string;
  quantity: number;
}

export type NewCartLine = Omit<CartLine, "key" | "quantity">;

interface CartState {
  lines: CartLine[];
  add: (line: NewCartLine, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const lineKey = (line: Pick<CartLine, "productId" | "strapId" | "engraving">): string =>
  [line.productId, line.strapId, line.engraving.trim()].join("|");

export const linePrice = (line: CartLine): number =>
  (line.unitPrice + line.strapPrice + (line.engraving ? ENGRAVING_PRICE : 0)) * line.quantity;

export const cartTotal = (lines: CartLine[]): number =>
  lines.reduce((sum, line) => sum + linePrice(line), 0);

export const cartCount = (lines: CartLine[]): number =>
  lines.reduce((sum, line) => sum + line.quantity, 0);

const clampQuantity = (quantity: number) =>
  Math.min(MAX_QUANTITY_PER_ITEM, Math.max(1, Math.round(quantity)));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (input, quantity = 1) =>
        set((state) => {
          const line = { ...input, engraving: input.engraving.trim() };
          const key = lineKey(line);
          const existing = state.lines.find((item) => item.key === key);
          if (existing) {
            return {
              lines: state.lines.map((item) =>
                item.key === key
                  ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
                  : item,
              ),
            };
          }
          return { lines: [...state.lines, { ...line, key, quantity: clampQuantity(quantity) }] };
        }),
      setQuantity: (key, quantity) =>
        set((state) => ({
          lines: state.lines.map((item) =>
            item.key === key ? { ...item, quantity: clampQuantity(quantity) } : item,
          ),
        })),
      remove: (key) => set((state) => ({ lines: state.lines.filter((item) => item.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "kronos-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // The store hydrates after mount, so server HTML and the first client render agree
      skipHydration: true,
    },
  ),
);
