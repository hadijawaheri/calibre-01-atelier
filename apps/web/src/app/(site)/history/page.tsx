import type { Metadata } from "next";

import { BrandHistoryPage } from "@/features/history";

export const metadata: Metadata = {
  title: "تاریخچهٔ برندها",
  description:
    "پتک فیلیپ، رولکس، فردریک کنستانت، سواچ، سیکو و کاسیو: هر برند کجا و چطور شروع شد و کدام ساعت نامش را ماندگار کرد.",
};

export default function HistoryPage() {
  return <BrandHistoryPage />;
}
