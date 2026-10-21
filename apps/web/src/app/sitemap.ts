import type { MetadataRoute } from "next";

import { CALIBRES } from "@/features/movement";
import { paths } from "@/lib/paths";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, SITE_URL).toString();
  return [
    { url: url(paths.home), changeFrequency: "weekly", priority: 1 },
    { url: url(paths.lab), changeFrequency: "monthly", priority: 0.9 },
    ...CALIBRES.map((calibre) => ({
      url: url(paths.labCalibre(calibre.slug)),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
