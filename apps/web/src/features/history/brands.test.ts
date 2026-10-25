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

  it("credits every photograph with its author, licence and the page the licence was checked on", () => {
    for (const { image } of BRAND_HISTORIES) {
      expect(image.src).toMatch(/^https:\/\/(upload|thumb)\.wikimedia\.org\/wikipedia\/commons\//);
      expect(image.credit.author).not.toBe("");
      expect(image.credit.license).toMatch(/^CC BY-SA \d\.\d$|^Public domain$/);
      expect(image.credit.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    }
  });

  it("cites at least one source for every brand, the brand's own site first", () => {
    for (const brand of BRAND_HISTORIES) {
      expect(brand.sources.length).toBeGreaterThan(0);
      expect(brand.sources[0]?.url).not.toMatch(/wikipedia\.org/);
    }
  });
});
