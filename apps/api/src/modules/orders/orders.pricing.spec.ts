import { ENGRAVING_PRICE } from "@kronos/contracts";
import { describe, expect, it } from "vitest";

import { priceLine } from "./orders.pricing.js";

describe("priceLine", () => {
  it("adds strap and engraving per piece", () => {
    expect(priceLine(1_000, 200, "A", 2)).toEqual({
      unitPrice: 1_000,
      strapPrice: 200,
      engravingPrice: ENGRAVING_PRICE,
      quantity: 2,
      lineTotal: (1_000 + 200 + ENGRAVING_PRICE) * 2,
    });
  });

  it("charges nothing for an empty engraving", () => {
    expect(priceLine(1_000, 0, "", 1).lineTotal).toBe(1_000);
  });
});
