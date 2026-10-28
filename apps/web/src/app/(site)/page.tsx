import type { Metadata } from "next";

import { JsonLd } from "@/components/layout/json-ld";
import {
  HomeBlueprint,
  HomeFamilies,
  HomeFeatures,
  HomeFinale,
  HomeGallery,
  HomeHero,
  HomeStatement,
  HomeTimegrapher,
  MovementFilm,
} from "@/features/home";
import { paths } from "@/lib/paths";
import { absoluteUrl, defaultMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: paths.home },
};

/* Names the site to search engines, so results can show "کرونوس" rather than the domain. */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Kronos",
  url: absoluteUrl(paths.home),
  inLanguage: "fa",
  description: defaultMetadata.description,
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <HomeHero />
      <HomeStatement />
      <MovementFilm />
      <HomeFeatures />
      <HomeGallery />
      <HomeTimegrapher />
      <HomeBlueprint />
      <HomeFamilies />
      <HomeFinale />
    </>
  );
}
