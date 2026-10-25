import type { Metadata } from "next";

import { CalibreIndex } from "@/features/movement";

export const metadata: Metadata = {
  title: "آزمایشگاه موومنت",
  description:
    "موومنت‌های واقعی ساعت را سه‌بعدی باز کنید، قطعه‌ها را بررسی کنید و ببینید هرکدام چطور کار می‌کند.",
};

export default function LabPage() {
  return <CalibreIndex />;
}
