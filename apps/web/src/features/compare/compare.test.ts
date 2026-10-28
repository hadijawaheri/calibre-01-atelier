import { describe, expect, it } from "vitest";

import { compareRows, MAX_ITEMS, MISSING, pickSlugs } from "./rows";
import { buildCompareSets } from "./sets";

const { watches, calibres } = buildCompareSets();

describe("pickSlugs", () => {
  it("keeps known slugs once, in order, at most three", () => {
    expect(pickSlugs(watches, "rolex-submariner,nope,rolex-submariner,omega-speedmaster")).toEqual([
      "rolex-submariner",
      "omega-speedmaster",
    ]);
    const many = watches.items.map((item) => item.slug).join(",");
    expect(pickSlugs(watches, many)).toHaveLength(MAX_ITEMS);
    expect(pickSlugs(watches, null)).toEqual([]);
  });
});

describe("compareRows", () => {
  it("lines up each watch's figures and the calibre inside it", () => {
    const rows = compareRows(watches, ["rolex-submariner", "omega-speedmaster"]);
    const row = (label: string) => rows.find((r) => r.label === label)?.values;
    expect(row("برند")).toEqual(["رولکس", "امگا"]);
    expect(row("کالیبر")).toEqual(["Rolex 3235", "Omega 321"]);
    // A spec only one of them has reads as a dash for the other
    expect(row("اولین مرجع‌ها")).toEqual(["6204 / 6205", MISSING]);
  });

  it("drops rows neither item has, and with onlyDifferences the rows that read the same", () => {
    const all = compareRows(calibres, ["eta-2824-2", "sellita-sw200-1"]);
    expect(all.every((row) => row.values.some((value) => value !== MISSING))).toBe(true);
    const different = compareRows(calibres, ["eta-2824-2", "sellita-sw200-1"], true);
    expect(different.every((row) => new Set(row.values).size > 1)).toBe(true);
    expect(different.length).toBeLessThanOrEqual(all.length);
  });

  it("compares nothing when nothing is chosen", () => {
    expect(compareRows(watches, [])).toEqual([]);
  });
});
