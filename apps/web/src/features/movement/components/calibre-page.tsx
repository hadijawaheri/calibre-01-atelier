import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { paths } from "@/lib/paths";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

import { calibreBySlug } from "../calibres";
import { CalibreProfile } from "./calibre-profile";
import { MovementLab } from "./movement-lab";

export function calibreMetadata(slug: string): Metadata {
  const calibre = calibreBySlug(slug);
  if (!calibre) return {};
  return {
    title: `${calibre.name} · آزمایشگاه موومنت`,
    description: calibre.summary,
    alternates: { canonical: paths.labCalibre(calibre.slug) },
  };
}

/** A family with a ready model opens in the lab; the others show their facts until their CAD file arrives. */
export function CalibrePage({ slug }: { slug: string }) {
  const calibre = calibreBySlug(slug);
  if (!calibre) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: calibre.name,
    description: calibre.summary,
    inLanguage: "fa",
    url: new URL(paths.labCalibre(calibre.slug), SITE_URL).toString(),
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  return (
    <div className="pt-16">
      <script
        type="application/ld+json"
        // JSON-LD must be raw JSON; escaping "<" keeps a value from closing the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }}
      />
      {calibre.hasModel ? <MovementLab calibre={calibre} /> : <CalibreProfile calibre={calibre} />}
    </div>
  );
}
