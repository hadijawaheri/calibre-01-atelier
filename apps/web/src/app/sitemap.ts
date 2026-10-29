import type { MetadataRoute } from "next";

import { CALIBRES } from "@/features/movement";
import { CALIBRE_ENTRIES, WATCHES } from "@/features/reference";
import { paths } from "@/lib/paths";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" = "monthly",
  ) => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  });
  return [
    entry(paths.home, 1, "weekly"),
    entry(paths.lab, 0.9),
    entry(paths.calibres, 0.8),
    entry(paths.watches, 0.8),
    entry(paths.brands, 0.7),
    entry(paths.complications, 0.7),
    entry(paths.history, 0.7),
    entry(paths.compare, 0.4),
    entry(paths.timegrapher, 0.6),
    ...CALIBRES.map((calibre) => entry(paths.labCalibre(calibre.slug), 0.8)),
    ...WATCHES.map((watch) => entry(paths.watch(watch.slug), 0.7)),
    ...CALIBRE_ENTRIES.map((calibre) => entry(paths.calibre(calibre.slug), 0.7)),
  ];
}
