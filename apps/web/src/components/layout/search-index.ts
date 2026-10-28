import { COMPLICATIONS } from "@/features/complications/complications";
import { CALIBRES } from "@/features/movement/calibres";
import { PARTS } from "@/features/movement/parts";
import { brandBySlug, BRANDS } from "@/features/reference/brands";
import { CALIBRE_ENTRIES, calibreEntryBySlug } from "@/features/reference/calibres";
import { formatYear, KIND_LABELS } from "@/features/reference/format";
import { WATCHES } from "@/features/reference/watches";
import { paths } from "@/lib/paths";

import type { SearchEntry } from "./search-types";

export type { SearchEntry, SearchGroup } from "./search-types";
export { SEARCH_GROUPS } from "./search-types";

/** Built on the server from the same data the pages show, so the search can only find what exists. */
export function buildSearchIndex(): SearchEntry[] {
  const watches = WATCHES.map((watch): SearchEntry => {
    const brand = brandBySlug(watch.brandSlug);
    const calibre = watch.calibreSlug ? calibreEntryBySlug(watch.calibreSlug) : undefined;
    return {
      label: watch.name,
      latin: watch.latinName,
      kind: `ساعت · ${formatYear(watch.year)}`,
      group: "watch",
      href: paths.watch(watch.slug),
      terms: [
        watch.year,
        brand?.name,
        brand?.latinName,
        calibre?.name,
        ...watch.specs.map((spec) => spec.value),
      ].join(" "),
    };
  });
  const calibres = CALIBRE_ENTRIES.map((calibre): SearchEntry => ({
    label: calibre.name,
    kind: `کالیبر · ${KIND_LABELS[calibre.kind]}`,
    group: "calibre",
    href: paths.calibre(calibre.slug),
    terms: [
      calibre.maker,
      calibre.type,
      KIND_LABELS[calibre.kind],
      calibre.year,
      calibre.frequency,
      calibre.powerReserve,
    ].join(" "),
  }));
  const brands = BRANDS.map((brand): SearchEntry => ({
    label: brand.name,
    latin: brand.latinName,
    kind: `برند · ${formatYear(brand.founded)}`,
    group: "brand",
    href: paths.brand(brand.slug),
    terms: `${brand.founded} ${brand.place} ${brand.founders ?? ""} ${brand.owner ?? ""}`,
  }));
  const complications = COMPLICATIONS.map((complication): SearchEntry => ({
    label: complication.name,
    latin: complication.latinName,
    kind: "کمپلیکیشن",
    group: "complication",
    href: paths.complication(complication.slug),
    terms: complication.summary,
  }));
  const families = CALIBRES.map((calibre): SearchEntry => ({
    label: calibre.name,
    latin: calibre.reference,
    kind: "خانوادهٔ موومنت · آزمایشگاه",
    group: "lab",
    href: paths.labCalibre(calibre.slug),
    terms: calibre.slug,
  }));
  // The lab's own examples of each family; most are not in the catalogue, so they lead to their family
  const examples = CALIBRES.flatMap((calibre) =>
    calibre.usedIn.map((watch): SearchEntry => ({
      label: `${watch.brand} ${watch.model}`,
      latin: watch.calibre,
      kind: `نمونهٔ ${calibre.name} · آزمایشگاه`,
      group: "lab",
      href: paths.labCalibre(calibre.slug),
      terms: calibre.name,
    })),
  );
  const parts = PARTS.map((part): SearchEntry => ({
    label: part.name,
    latin: part.nameEn,
    kind: "قطعه · آزمایشگاه",
    group: "lab",
    href: paths.labCalibre("automatic"),
    terms: part.role,
  }));
  return [...watches, ...calibres, ...brands, ...complications, ...families, ...examples, ...parts];
}
