import { describe, expect, it } from "vitest";

import { COMPLICATIONS } from "@/features/complications/complications";
import { CALIBRES } from "@/features/movement/calibres";
import { CALIBRE_ENTRIES } from "@/features/reference/calibres";
import { WATCHES } from "@/features/reference/watches";

import { buildSearchIndex } from "./search-index";
import { fold, search } from "./search-match";

const entries = buildSearchIndex();
const labels = (query: string) => search(entries, query).map((entry) => entry.label);

describe("fold", () => {
  it("treats Arabic letters, Persian digits and the non-joiner as what people mean", () => {
    expect(fold("سيكو")).toBe(fold("سیکو"));
    expect(fold("۱۹۶۹")).toBe("1969");
    expect(fold("٢٠١٥")).toBe("2015");
    expect(fold("ساعت‌ها")).toBe("ساعت ها");
    expect(fold("ETA 2824-2")).toBe("eta 2824 2");
    expect(fold("۲۸٬۸۰۰")).toBe("28800");
  });
});

describe("search", () => {
  it("finds nothing for an empty query", () => {
    expect(search(entries, "  ")).toEqual([]);
  });

  it("finds a watch by its Persian name, its Latin name and its brand", () => {
    expect(labels("اسپیدمستر")[0]).toBe("امگا اسپیدمستر");
    expect(labels("speedmaster")[0]).toBe("امگا اسپیدمستر");
    expect(labels("رولکس")).toEqual(expect.arrayContaining(["رولکس اویستر", "رولکس سابمرینر"]));
  });

  it("finds a calibre by its number however the dash is typed", () => {
    expect(labels("2824-2")[0]).toBe("ETA 2824-2");
    expect(labels("2824 2")[0]).toBe("ETA 2824-2");
  });

  it("finds by year in Persian digits", () => {
    const found = labels("۱۹۶۹");
    expect(found).toEqual(expect.arrayContaining(["زنیت ال پریمرو A384", "هویر موناکو"]));
  });

  it("finds complications and the watches whose calibre is of that kind", () => {
    expect(labels("توربیون")).toContain("توربیون");
    expect(labels("کرونوگراف")).toEqual(expect.arrayContaining(["کرونوگراف", "Valjoux 7750"]));
  });

  it("ranks a name match above a match deep in the facts", () => {
    // "امگا" is the brand of several watches and the maker of calibres; the names that start with it lead
    const [first] = search(entries, "امگا");
    expect(fold(first!.label).startsWith(fold("امگا"))).toBe(true);
  });

  it("needs every word to match", () => {
    expect(labels("رولکس کوارتز")).toEqual([]);
  });
});

describe("search index", () => {
  it("links every catalogue entry to its own page", () => {
    for (const watch of WATCHES) {
      expect(entries.some((entry) => entry.href === `/watches/${watch.slug}`)).toBe(true);
    }
    for (const calibre of CALIBRE_ENTRIES) {
      expect(entries.some((entry) => entry.href === `/calibres/${calibre.slug}`)).toBe(true);
    }
    for (const complication of COMPLICATIONS) {
      expect(entries.some((entry) => entry.href === `/complications#${complication.slug}`)).toBe(
        true,
      );
    }
  });

  it("only links to lab families that exist", () => {
    const families = new Set(CALIBRES.map((calibre) => `/lab/${calibre.slug}`));
    for (const entry of entries.filter((e) => e.group === "lab")) {
      expect(families.has(entry.href)).toBe(true);
    }
  });

  it("has no two entries the list would key alike", () => {
    const keys = entries.map((entry) => entry.href + entry.label);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
