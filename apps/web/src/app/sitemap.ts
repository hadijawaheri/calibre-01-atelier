import type { MetadataRoute } from "next";

import { listAllSlugs } from "@/features/products/api";
import { paths } from "@/lib/paths";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listAllSlugs().catch(() => []);
  const url = (path: string) => new URL(path, SITE_URL).toString();
  return [
    { url: url(paths.home), changeFrequency: "weekly", priority: 1 },
    { url: url(paths.watches), changeFrequency: "daily", priority: 0.9 },
    ...slugs.map((slug) => ({
      url: url(paths.watch(slug)),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
