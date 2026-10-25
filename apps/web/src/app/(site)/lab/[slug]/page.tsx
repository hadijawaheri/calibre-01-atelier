import type { Metadata } from "next";

import { calibreMetadata, CalibrePage, CALIBRES } from "@/features/movement";

/** Only the calibres we have; anything else is a real 404 rather than a streamed not-found page. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CALIBRES.map((calibre) => ({ slug: calibre.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lab/[slug]">): Promise<Metadata> {
  return calibreMetadata((await params).slug);
}

export default async function CalibreLabPage({ params }: PageProps<"/lab/[slug]">) {
  return <CalibrePage slug={(await params).slug} />;
}
