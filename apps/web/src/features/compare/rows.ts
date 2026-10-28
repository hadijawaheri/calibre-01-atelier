/* Pure helpers shared by the server, which builds the sets, and the compare tool in the browser. */

export const MISSING = "—";
export const MAX_ITEMS = 3;

export type CompareMode = "watches" | "calibres";

export interface CompareItem {
  slug: string;
  name: string;
  latin?: string;
  href: string;
  /** Each figure by its row label; a row the sources leave empty is simply absent. */
  values: Record<string, string>;
}

export interface CompareSet {
  /** Row labels in reading order. */
  rows: readonly string[];
  items: readonly CompareItem[];
}

/** The slugs from the address that exist in the set, without repeats, at most three. */
export function pickSlugs(set: CompareSet, raw: string | null) {
  const known = new Set(set.items.map((item) => item.slug));
  const slugs = (raw ?? "").split(",").filter((slug) => known.has(slug));
  return [...new Set(slugs)].slice(0, MAX_ITEMS);
}

/* The table's rows for the chosen items. A row no chosen item has a figure for is dropped; with `onlyDifferences`
   rows where every chosen item reads the same are dropped too. */
export function compareRows(set: CompareSet, slugs: readonly string[], onlyDifferences = false) {
  const items = slugs
    .map((slug) => set.items.find((item) => item.slug === slug))
    .filter((item) => !!item);
  return set.rows
    .map((label) => ({
      label,
      values: items.map((item) => item.values[label] ?? MISSING),
    }))
    .filter((row) => row.values.some((value) => value !== MISSING))
    .filter((row) => !onlyDifferences || new Set(row.values).size > 1);
}
