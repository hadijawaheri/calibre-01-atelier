"use client";

import { useQueryStates } from "nuqs";

import { catalogParsers } from "../search-params";
import { useCatalogTransition } from "./catalog-transition";

export function useCatalogParams() {
  const { startTransition } = useCatalogTransition();
  // shallow: false re-runs the server page, so the list is always fetched on the server
  return useQueryStates(catalogParsers, { shallow: false, startTransition, scroll: false });
}
