import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { BRAND_HISTORIES } from "./brands";

describe("brand histories", () => {
  it("keeps the six brands in the order they were written", () => {
    expect(BRAND_HISTORIES.map((brand) => brand.latinName)).toEqual([
      "Patek Philippe",
      "Rolex",
      "Frédérique Constant",
      "Swatch",
      "Seiko",
      "Casio",
    ]);
  });

  it("gives every brand its own anchor and at least one landmark watch", () => {
    expect(new Set(BRAND_HISTORIES.map((brand) => brand.slug)).size).toBe(BRAND_HISTORIES.length);
    for (const brand of BRAND_HISTORIES) expect(brand.milestones.length).toBeGreaterThan(0);
  });

  it("points every brand at a photograph that ships with the site", () => {
    for (const brand of BRAND_HISTORIES) {
      expect(existsSync(join(process.cwd(), "public", brand.image.src))).toBe(true);
    }
  });
});
