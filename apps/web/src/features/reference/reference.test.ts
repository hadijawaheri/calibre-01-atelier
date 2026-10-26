import { describe, expect, it } from "vitest";

import { BRAND_HISTORIES } from "@/features/history/brands";
import { calibreBySlug } from "@/features/movement/calibres";

import { BRANDS } from "./brands";
import { CALIBRE_ENTRIES } from "./calibres";
import type { ReferencePhoto } from "./types";
import { WATCHES } from "./watches";

const unique = (slugs: string[]) => new Set(slugs).size === slugs.length;

const isSorted = (years: number[]) => years.every((year, i) => i === 0 || years[i - 1]! <= year);

function expectCredited(photo: ReferencePhoto) {
  expect(photo.src).toMatch(/^https:\/\/(upload|thumb)\.wikimedia\.org\/wikipedia\/commons\//);
  expect(photo.alt).not.toBe("");
  expect(photo.credit.author).not.toBe("");
  expect(photo.credit.license).toMatch(/^CC BY(-SA)? \d\.\d( de)?$|^Public domain$/);
  expect(photo.credit.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
}

describe("brand directory", () => {
  it("lists each house once, by founding year", () => {
    expect(unique(BRANDS.map((brand) => brand.slug))).toBe(true);
    expect(isSorted(BRANDS.map((brand) => brand.founded))).toBe(true);
  });

  it("includes every brand of the history page and links to its long read", () => {
    for (const history of BRAND_HISTORIES) {
      expect(BRANDS.find((brand) => brand.historySlug === history.slug)).toBeDefined();
    }
  });

  it("cites a source for every house", () => {
    for (const brand of BRANDS) expect(brand.sources.length).toBeGreaterThan(0);
  });
});

describe("watch catalogue", () => {
  it("lists each model once, by year, under a brand of the directory", () => {
    expect(unique(WATCHES.map((watch) => watch.slug))).toBe(true);
    expect(isSorted(WATCHES.map((watch) => watch.year))).toBe(true);
    for (const watch of WATCHES) {
      expect(BRANDS.some((brand) => brand.slug === watch.brandSlug)).toBe(true);
    }
  });

  it("points only at calibres the register has", () => {
    for (const watch of WATCHES) {
      if (watch.calibreSlug) {
        expect(CALIBRE_ENTRIES.some((calibre) => calibre.slug === watch.calibreSlug)).toBe(true);
      }
    }
  });

  it("credits every photograph and cites every model", () => {
    for (const watch of WATCHES) {
      if (watch.photo) expectCredited(watch.photo);
      expect(watch.sources.length).toBeGreaterThan(0);
    }
  });
});

describe("calibre register", () => {
  it("lists each calibre once, dated ones by year and undated ones last", () => {
    expect(unique(CALIBRE_ENTRIES.map((calibre) => calibre.slug))).toBe(true);
    const firstUndated = CALIBRE_ENTRIES.findIndex((calibre) => calibre.year === undefined);
    const dated = CALIBRE_ENTRIES.slice(0, firstUndated === -1 ? undefined : firstUndated);
    expect(isSorted(dated.map((calibre) => calibre.year!))).toBe(true);
    if (firstUndated !== -1) {
      expect(CALIBRE_ENTRIES.slice(firstUndated).every((c) => c.year === undefined)).toBe(true);
    }
  });

  it("leads only into lab families that exist", () => {
    for (const calibre of CALIBRE_ENTRIES) {
      if (calibre.family) expect(calibreBySlug(calibre.family)).toBeDefined();
    }
  });

  it("credits every photograph and cites every calibre", () => {
    for (const calibre of CALIBRE_ENTRIES) {
      if (calibre.photo) expectCredited(calibre.photo);
      expect(calibre.sources.length).toBeGreaterThan(0);
    }
  });
});
