import { ENGRAVING_PRICE, MAX_QUANTITY_PER_ITEM } from "@kronos/contracts";
import { beforeEach, describe, expect, it } from "vitest";

import type { NewCartLine } from "./store";
import { cartCount, cartTotal, useCart } from "./store";

const line = (overrides: Partial<NewCartLine> = {}): NewCartLine => ({
  productId: "a".repeat(24),
  slug: "primo",
  name: "پریمو",
  reference: "KR-P36",
  image: null,
  appearance: { dial: "#000000", accent: "#ffffff", layout: "chronograph" },
  caseMaterial: "steel",
  strapId: "steel",
  strapName: "استیل",
  unitPrice: 1_000,
  strapPrice: 0,
  engraving: "",
  ...overrides,
});

describe("cart store", () => {
  beforeEach(() => useCart.getState().clear());

  it("merges the same watch, strap and engraving into one line", () => {
    useCart.getState().add(line());
    useCart.getState().add(line({ engraving: "  " }));
    expect(useCart.getState().lines).toHaveLength(1);
    expect(useCart.getState().lines[0]?.quantity).toBe(2);
  });

  it("keeps another strap or engraving as a separate line", () => {
    useCart.getState().add(line());
    useCart.getState().add(line({ strapId: "rubber", strapPrice: 100 }));
    useCart.getState().add(line({ engraving: "آرش" }));
    expect(useCart.getState().lines).toHaveLength(3);
  });

  it("caps quantity at the per-item limit", () => {
    useCart.getState().add(line(), 10);
    const [first] = useCart.getState().lines;
    expect(first?.quantity).toBe(MAX_QUANTITY_PER_ITEM);
    useCart.getState().setQuantity(first!.key, 0);
    expect(useCart.getState().lines[0]?.quantity).toBe(1);
  });

  it("prices strap and engraving like the API does", () => {
    useCart.getState().add(line({ strapPrice: 200, engraving: "K" }), 2);
    const { lines } = useCart.getState();
    expect(cartTotal(lines)).toBe((1_000 + 200 + ENGRAVING_PRICE) * 2);
    expect(cartCount(lines)).toBe(2);
  });
});
