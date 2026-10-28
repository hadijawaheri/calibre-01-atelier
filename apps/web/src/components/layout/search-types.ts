import type { Searchable } from "./search-match";

export type SearchGroup = "watch" | "calibre" | "brand" | "complication" | "lab";

export const SEARCH_GROUPS: Record<SearchGroup, string> = {
  watch: "ساعت‌ها",
  calibre: "کالیبرها",
  brand: "برندها",
  complication: "کمپلیکیشن‌ها",
  lab: "آزمایشگاه",
};

export interface SearchEntry extends Searchable {
  /** What the visitor reads in the list. */
  label: string;
  /** The Latin name or reference beside it. */
  latin?: string;
  /** Which kind of entry it is, in Persian. */
  kind: string;
  group: SearchGroup;
  href: string;
  /** Everything else the query is matched against. */
  terms: string;
}
