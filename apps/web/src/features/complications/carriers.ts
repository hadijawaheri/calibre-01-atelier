import { CALIBRE_ENTRIES } from "@/features/reference/calibres";
import { WATCHES } from "@/features/reference/watches";

import type { Complication } from "./complications";

/** The calibres and watches of the register that carry a complication, matched by calibre kind. */
export function carriersOf(complication: Complication) {
  if (!complication.calibreKind) return { calibres: [], watches: [] };
  const calibres = CALIBRE_ENTRIES.filter((calibre) => calibre.kind === complication.calibreKind);
  const slugs = new Set(calibres.map((calibre) => calibre.slug));
  const watches = WATCHES.filter((watch) => watch.calibreSlug && slugs.has(watch.calibreSlug));
  return { calibres, watches };
}
