import type { Metadata } from "next";

import { BrandHistoryPage } from "@/features/history";
import { paths } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "تاریخچهٔ برندها",
  description:
    "پتک فیلیپ، رولکس، فردریک کنستانت، سواچ، سیکو و کاسیو: هر برند کجا و چطور شروع شد و کدام ساعت نامش را ماندگار کرد.",
  path: paths.history,
});

export default function HistoryPage() {
  return <BrandHistoryPage />;
}
