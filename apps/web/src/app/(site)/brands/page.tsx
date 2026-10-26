import type { Metadata } from "next";

import { BrandDirectoryPage } from "@/features/reference";
import { paths } from "@/lib/paths";

export const metadata: Metadata = {
  title: "برندهای ساعت",
  description:
    "شانزده خانهٔ ساعت‌سازی از بلانپن ۱۷۳۵ تا فردریک کنستانت ۱۹۸۸: سال و مکان تأسیس، موسسان، مالک امروز و ساعت‌های شاخص، با منبع.",
  alternates: { canonical: paths.brands },
};

export default function BrandsPage() {
  return <BrandDirectoryPage />;
}
