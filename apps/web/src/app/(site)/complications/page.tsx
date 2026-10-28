import type { Metadata } from "next";

import { ComplicationsPage } from "@/features/complications";
import { paths } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "کمپلیکیشن‌های ساعت",
  description:
    "کرونوگراف، فلای‌بک، فاز ماه، ساعت جهانی، تقویم دائمی، توربیون و ریپیتر دقیقه‌شمار: هر کدام چطور کار می‌کند، از کجا آمد و در کدام ساعت‌ها هست، با منبع.",
  path: paths.complications,
});

export default function ComplicationsRoute() {
  return <ComplicationsPage />;
}
