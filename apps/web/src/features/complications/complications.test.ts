import { describe, expect, it } from "vitest";

import { calibreBySlug } from "@/features/movement/calibres";

import { carriersOf } from "./carriers";
import { complicationBySlug, COMPLICATIONS } from "./complications";

describe("complications", () => {
  it("lists each complication once, each with its facts and a source", () => {
    const slugs = COMPLICATIONS.map((complication) => complication.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const complication of COMPLICATIONS) {
      expect(complication.body.length).toBeGreaterThan(0);
      expect(complication.specs.length).toBeGreaterThan(0);
      expect(complication.sources.length).toBeGreaterThan(0);
      for (const source of complication.sources) expect(source.url).toMatch(/^https:\/\//);
    }
  });

  it("leads only into lab families that exist", () => {
    for (const complication of COMPLICATIONS) {
      if (complication.labFamily) expect(calibreBySlug(complication.labFamily)).toBeDefined();
    }
  });

  it("finds the chronograph calibres of the register and the watches that carry them", () => {
    const { calibres, watches } = carriersOf(complicationBySlug("chronograph")!);
    expect(calibres.map((calibre) => calibre.slug)).toContain("omega-321");
    expect(watches.map((watch) => watch.slug)).toContain("omega-speedmaster");
    expect(carriersOf(complicationBySlug("minute-repeater")!)).toEqual({
      calibres: [],
      watches: [],
    });
  });
});
