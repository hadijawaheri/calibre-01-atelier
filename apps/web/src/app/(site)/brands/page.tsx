import type { Metadata } from "next";

import { BrandDirectoryPage } from "@/features/reference";
import { paths } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "برندهای ساعت",
  description:
    "شانزده خانهٔ ساعت‌سازی از بلانپن ۱۷۳۵ تا فردریک کنستانت ۱۹۸۸: سال و مکان تأسیس، موسسان، مالک امروز و ساعت‌های شاخص، با منبع.",
  path: paths.brands,
});

export default function BrandsPage() {
  return <BrandDirectoryPage />;
}
