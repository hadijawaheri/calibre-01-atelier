import { CASE_MATERIALS, COLLECTIONS, MOVEMENT_TYPES, PRODUCT_SORTS } from "@kronos/contracts";
import type { inferParserType } from "nuqs/server";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

/** One definition for the URL state, read on the server and written by the client filters. */
export const catalogParsers = {
  collection: parseAsArrayOf(parseAsStringLiteral(COLLECTIONS)).withDefault([]),
  material: parseAsArrayOf(parseAsStringLiteral(CASE_MATERIALS)).withDefault([]),
  movement: parseAsArrayOf(parseAsStringLiteral(MOVEMENT_TYPES)).withDefault([]),
  inStock: parseAsBoolean.withDefault(false),
  sort: parseAsStringLiteral(PRODUCT_SORTS).withDefault("featured"),
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

export const catalogCache = createSearchParamsCache(catalogParsers);
export type CatalogParams = inferParserType<typeof catalogParsers>;

export const CATALOG_PAGE_SIZE = 9;

/** The API reads repeated keys as arrays (`collection=a&collection=b`). */
export function toApiQuery(params: CatalogParams): string {
  const search = new URLSearchParams();
  for (const value of params.collection) search.append("collection", value);
  for (const value of params.material) search.append("material", value);
  for (const value of params.movement) search.append("movement", value);
  if (params.inStock) search.set("inStock", "true");
  if (params.q.trim()) search.set("search", params.q.trim());
  search.set("sort", params.sort);
  search.set("page", String(Math.max(1, params.page)));
  search.set("limit", String(CATALOG_PAGE_SIZE));
  return search.toString();
}
