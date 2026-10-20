import { productInputSchema } from "@kronos/contracts";
import { describe, expect, it } from "vitest";

import { CATALOG } from "./catalog.js";

describe("seed catalog", () => {
  it.each(CATALOG.map((product) => [product.slug, product] as const))(
    "%s satisfies the shared product schema with integer Rial prices",
    (_, product) => {
      const parsed = productInputSchema.parse(product);
      expect(Number.isSafeInteger(parsed.price)).toBe(true);
      for (const strap of parsed.straps) expect(Number.isSafeInteger(strap.price)).toBe(true);
    },
  );

  it("has unique slugs", () => {
    expect(new Set(CATALOG.map((product) => product.slug)).size).toBe(CATALOG.length);
  });
});
