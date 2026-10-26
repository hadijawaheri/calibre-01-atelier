import type { Metadata } from "next";

import { WatchCataloguePage } from "@/features/reference";
import { paths } from "@/lib/paths";

export const metadata: Metadata = {
  title: "ساعت‌های ماندگار",
  description:
    "چهارده ساعت که تاریخ ساعت‌سازی را عوض کردند، از کارتیه تانک تا جی‌شاک: سال معرفی، مرجع، موومنت و مشخصات، با عکس آزاد و منبع.",
  alternates: { canonical: paths.watches },
};

export default function WatchesPage() {
  return <WatchCataloguePage />;
}
