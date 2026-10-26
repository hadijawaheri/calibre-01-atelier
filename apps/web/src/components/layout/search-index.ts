import { CALIBRES, PARTS } from "@/features/movement";
import { BRANDS, CALIBRE_ENTRIES, WATCHES } from "@/features/reference";
import { paths } from "@/lib/paths";

export interface SearchEntry {
  /** What the visitor reads in the list. */
  label: string;
  /** The Latin name or reference beside it. */
  latin?: string;
  /** Which kind of entry it is, in Persian. */
  kind: string;
  href: string;
  /** Everything the query is matched against. */
  terms: string;
}

/** Built on the server from the same data the pages show, so the search can only find what exists. */
export function buildSearchIndex(): SearchEntry[] {
  const families = CALIBRES.map((calibre) => ({
    label: calibre.name,
    latin: calibre.reference,
    kind: "خانوادهٔ موومنت",
    href: paths.labCalibre(calibre.slug),
    terms: `${calibre.name} ${calibre.reference} ${calibre.slug}`,
  }));
  const watches = CALIBRES.flatMap((calibre) =>
    calibre.usedIn.map((watch) => ({
      label: `${watch.brand} ${watch.model}`,
      latin: watch.calibre,
      kind: `ساعت · ${calibre.name}`,
      href: paths.labCalibre(calibre.slug),
      terms: `${watch.brand} ${watch.model} ${watch.calibre} ${calibre.name}`,
    })),
  );
  const parts = PARTS.map((part) => ({
    label: part.name,
    latin: part.nameEn,
    kind: "قطعه · آزمایشگاه",
    href: paths.labCalibre("automatic"),
    terms: `${part.name} ${part.nameEn} ${part.role}`,
  }));
  const brands = BRANDS.map((brand) => ({
    label: brand.name,
    latin: brand.latinName,
    kind: "برند",
    href: `${paths.brands}#${brand.slug}`,
    terms: `${brand.name} ${brand.latinName} ${brand.founded}`,
  }));
  const models = WATCHES.map((watch) => ({
    label: watch.name,
    latin: watch.latinName,
    kind: "ساعت",
    href: `${paths.watches}#${watch.slug}`,
    terms: `${watch.name} ${watch.latinName} ${watch.year}`,
  }));
  const calibres = CALIBRE_ENTRIES.map((calibre) => ({
    label: calibre.name,
    kind: `کالیبر · ${calibre.maker}`,
    href: `${paths.calibres}#${calibre.slug}`,
    terms: `${calibre.name} ${calibre.maker} ${calibre.type}`,
  }));
  return [...families, ...brands, ...models, ...calibres, ...watches, ...parts];
}
