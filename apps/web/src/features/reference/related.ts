import { CALIBRE_ENTRIES } from "./calibres";
import type { CalibreEntry, WatchEntry } from "./types";
import { WATCHES } from "./watches";

export const watchesOfBrand = (brandSlug: string) =>
  WATCHES.filter((watch) => watch.brandSlug === brandSlug);

export const watchesWithCalibre = (calibreSlug: string) =>
  WATCHES.filter((watch) => watch.calibreSlug === calibreSlug);

/** The entries on either side in the register's own order, so a reader can walk it page by page. */
export function neighbours<T extends { slug: string }>(list: readonly T[], slug: string) {
  const index = list.findIndex((entry) => entry.slug === slug);
  if (index === -1) return { previous: undefined, next: undefined };
  return { previous: list[index - 1], next: list[index + 1] };
}

/* Models of other houses introduced closest in time, the nearest first; on a tie the older one leads, as in the
   catalogue. The brand's own models are listed separately on the page, so they are left out here. */
export function contemporaries(watch: WatchEntry, limit = 3) {
  return WATCHES.filter((other) => other.brandSlug !== watch.brandSlug)
    .map((other) => ({ other, gap: Math.abs(other.year - watch.year) }))
    .sort((a, b) => a.gap - b.gap || a.other.year - b.other.year)
    .slice(0, limit)
    .map(({ other }) => other);
}

/** Calibres of the same kind (chronograph, quartz…), in register order. */
export const calibresOfKind = (calibre: CalibreEntry) =>
  CALIBRE_ENTRIES.filter((other) => other.kind === calibre.kind && other.slug !== calibre.slug);
