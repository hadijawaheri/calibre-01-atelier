import { brandBySlug } from "@/features/reference/brands";
import { CALIBRE_ENTRIES, calibreEntryBySlug } from "@/features/reference/calibres";
import { formatYear, KIND_LABELS } from "@/features/reference/format";
import { calibreSpecs } from "@/features/reference/specs";
import { WATCHES } from "@/features/reference/watches";
import { paths } from "@/lib/paths";

import type { CompareItem, CompareMode, CompareSet } from "./rows";

/** The leading rows in the given order, then the union of the items' other labels as they first appear. */
function rowsOf(items: readonly CompareItem[], leading: readonly string[] = []) {
  return [...new Set([...leading, ...items.flatMap((item) => Object.keys(item.values))])];
}

const WATCH_ROWS = ["برند", "سال معرفی", "کالیبر", "نوع موومنت", "فرکانس", "ذخیرهٔ انرژی", "یاقوت"];

/* Watches are compared on their own facts and on the calibre inside, so two models of different houses can be
   read figure by figure. Built on the server; the page only ships these strings. */
function watchSet(): CompareSet {
  const items = WATCHES.map((watch): CompareItem => {
    const brand = brandBySlug(watch.brandSlug);
    const calibre = watch.calibreSlug ? calibreEntryBySlug(watch.calibreSlug) : undefined;
    const values: Record<string, string> = {};
    if (brand) values["برند"] = brand.name;
    values["سال معرفی"] = formatYear(watch.year);
    if (calibre) {
      values["کالیبر"] = calibre.name;
      values["نوع موومنت"] = KIND_LABELS[calibre.kind];
      if (calibre.frequency) values["فرکانس"] = calibre.frequency;
      if (calibre.powerReserve) values["ذخیرهٔ انرژی"] = calibre.powerReserve;
      if (calibre.jewels) values["یاقوت"] = calibre.jewels;
    }
    for (const spec of watch.specs) values[spec.label] = spec.value;
    return {
      slug: watch.slug,
      name: watch.name,
      latin: watch.latinName,
      href: paths.watch(watch.slug),
      values,
    };
  });
  return { rows: rowsOf(items, WATCH_ROWS), items };
}

function calibreSet(): CompareSet {
  const items = CALIBRE_ENTRIES.map((calibre): CompareItem => {
    const values = Object.fromEntries(
      calibreSpecs(calibre).map((spec) => [spec.label, spec.value]),
    );
    const watches = WATCHES.filter((watch) => watch.calibreSlug === calibre.slug);
    if (watches.length > 0) values["در ساعت‌های کرونوس"] = watches.map((w) => w.name).join("، ");
    return { slug: calibre.slug, name: calibre.name, href: paths.calibre(calibre.slug), values };
  });
  return { rows: rowsOf(items), items };
}

export function buildCompareSets(): Record<CompareMode, CompareSet> {
  return { watches: watchSet(), calibres: calibreSet() };
}
