import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { calibreBySlug, CalibreProfile, CALIBRES, MovementLab } from "@/features/movement";

/** Only the calibres we have; anything else is a real 404 rather than a streamed not-found page. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CALIBRES.map((calibre) => ({ slug: calibre.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lab/[slug]">): Promise<Metadata> {
  const calibre = calibreBySlug((await params).slug);
  if (!calibre) return {};
  return { title: `${calibre.name} · آزمایشگاه موومنت`, description: calibre.summary };
}

export default async function CalibreLabPage({ params }: PageProps<"/lab/[slug]">) {
  const calibre = calibreBySlug((await params).slug);
  if (!calibre) notFound();
  return (
    <div className="pt-16">
      {calibre.hasModel ? <MovementLab calibre={calibre} /> : <CalibreProfile calibre={calibre} />}
    </div>
  );
}
