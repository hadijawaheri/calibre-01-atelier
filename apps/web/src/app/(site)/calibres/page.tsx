import type { Metadata } from "next";

import { CalibreCataloguePage } from "@/features/reference";
import { paths } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "کالیبرها",
  description:
    "مشخصات چهارده موومنت مشهور، از امگا 321 تا رولکس 3235: سال معرفی، فرکانس، ذخیرهٔ انرژی، یاقوت و اندازه، با منبع.",
  path: paths.calibres,
});

export default function CalibresPage() {
  return <CalibreCataloguePage />;
}
