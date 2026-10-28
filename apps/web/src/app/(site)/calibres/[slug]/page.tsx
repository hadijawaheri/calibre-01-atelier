import type { Metadata } from "next";

import { CALIBRE_ENTRIES, calibreEntryMetadata, CalibreEntryPage } from "@/features/reference";

/** Only the calibres in the register; anything else is a real 404 rather than a streamed not-found page. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CALIBRE_ENTRIES.map((calibre) => ({ slug: calibre.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/calibres/[slug]">): Promise<Metadata> {
  return calibreEntryMetadata((await params).slug);
}

export default async function CalibreEntryRoute({ params }: PageProps<"/calibres/[slug]">) {
  return <CalibreEntryPage slug={(await params).slug} />;
}
