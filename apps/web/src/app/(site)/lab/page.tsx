import type { Metadata } from "next";

import { CalibreIndex } from "@/features/movement";
import { paths } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "آزمایشگاه موومنت",
  description:
    "موومنت‌های واقعی ساعت را سه‌بعدی باز کنید، قطعه‌ها را بررسی کنید و ببینید هرکدام چطور کار می‌کند.",
  path: paths.lab,
});

export default function LabPage() {
  return <CalibreIndex />;
}
