import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/layout/json-ld";
import { paths } from "@/lib/paths";
import { breadcrumbJsonLd, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

import { calibreBySlug } from "../calibres";
import { CalibreProfile } from "./calibre-profile";
import { MovementLab } from "./movement-lab";

export function calibreMetadata(slug: string): Metadata {
  const calibre = calibreBySlug(slug);
  if (!calibre) return {};
  return pageMetadata({
    title: `${calibre.name} · آزمایشگاه موومنت`,
    description: calibre.summary,
    path: paths.labCalibre(calibre.slug),
    type: "article",
  });
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
    <div>
      <JsonLd data={jsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: paths.home },
          { name: "آزمایشگاه موومنت", path: paths.lab },
          { name: calibre.name, path: paths.labCalibre(calibre.slug) },
        ])}
      />
      {calibre.hasModel ? <MovementLab calibre={calibre} /> : <CalibreProfile calibre={calibre} />}
    </div>
  );
}
