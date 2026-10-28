import type { Metadata } from "next";

import { WatchCataloguePage } from "@/features/reference";
import { paths } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "ساعت‌های ماندگار",
  description:
    "چهارده ساعت که تاریخ ساعت‌سازی را عوض کردند، از کارتیه تانک تا جی‌شاک: سال معرفی، مرجع، موومنت و مشخصات، با عکس آزاد و منبع.",
  path: paths.watches,
});

export default function WatchesPage() {
  return <WatchCataloguePage />;
}
