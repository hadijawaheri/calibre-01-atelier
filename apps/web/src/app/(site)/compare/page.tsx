import type { Metadata } from "next";

import { ComparePage } from "@/features/compare";
import { paths } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "مقایسهٔ ساعت‌ها و کالیبرها",
  description:
    "دو یا سه ساعت یا کالیبر را کنار هم مقایسه کنید: سال معرفی، موومنت، فرکانس، ذخیرهٔ انرژی، یاقوت و اندازه، با منبع.",
  path: paths.compare,
});

export default function CompareRoute() {
  return <ComparePage />;
}
