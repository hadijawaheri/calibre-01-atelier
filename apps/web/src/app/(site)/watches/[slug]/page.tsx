import type { Metadata } from "next";

import { WATCHES, watchMetadata, WatchPage } from "@/features/reference";

/** Only the models in the catalogue; anything else is a real 404 rather than a streamed not-found page. */
export const dynamicParams = false;

export function generateStaticParams() {
  return WATCHES.map((watch) => ({ slug: watch.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/watches/[slug]">): Promise<Metadata> {
  return watchMetadata((await params).slug);
}

export default async function WatchEntryPage({ params }: PageProps<"/watches/[slug]">) {
  return <WatchPage slug={(await params).slug} />;
}
