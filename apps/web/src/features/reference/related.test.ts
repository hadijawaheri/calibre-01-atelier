import { describe, expect, it } from "vitest";

import { CALIBRE_ENTRIES } from "./calibres";
import { calibresOfKind, contemporaries, neighbours, watchesWithCalibre } from "./related";
import { watchBySlug, WATCHES } from "./watches";

describe("neighbours", () => {
  it("gives the entries on either side, and nothing past the ends", () => {
    expect(neighbours(WATCHES, WATCHES[0]!.slug).previous).toBeUndefined();
    expect(neighbours(WATCHES, WATCHES[0]!.slug).next?.slug).toBe(WATCHES[1]!.slug);
    expect(neighbours(WATCHES, WATCHES.at(-1)!.slug).next).toBeUndefined();
    expect(neighbours(WATCHES, "no-such-watch")).toEqual({ previous: undefined, next: undefined });
  });
});

describe("contemporaries", () => {
  it("lists other houses' models nearest in time, never the watch's own house", () => {
    const monaco = watchBySlug("heuer-monaco")!;
    const found = contemporaries(monaco);
    expect(found).toHaveLength(3);
    expect(found.every((watch) => watch.brandSlug !== monaco.brandSlug)).toBe(true);
    const gaps = found.map((watch) => Math.abs(watch.year - monaco.year));
    expect(gaps).toEqual([...gaps].sort((a, b) => a - b));
    // Two other models came out in 1969 as well
    expect(gaps.slice(0, 2)).toEqual([0, 0]);
  });
});

describe("calibre links", () => {
  it("finds the watches of a calibre", () => {
    expect(watchesWithCalibre("omega-321").map((watch) => watch.slug)).toContain(
      "omega-speedmaster",
    );
  });

  it("lists calibres of the same kind, without the calibre itself", () => {
    const valjoux = CALIBRE_ENTRIES.find((calibre) => calibre.slug === "valjoux-7750")!;
    const kin = calibresOfKind(valjoux);
    expect(kin.length).toBeGreaterThan(0);
    expect(kin.every((calibre) => calibre.kind === "chronograph")).toBe(true);
    expect(kin.some((calibre) => calibre.slug === valjoux.slug)).toBe(false);
  });
});
