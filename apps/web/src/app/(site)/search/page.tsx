import type { Metadata } from "next";

import { SearchPage } from "@/features/search";
import { paths } from "@/lib/paths";

export const metadata: Metadata = {
  title: "جستجو",
  description: "جستجو در ساعت‌ها، کالیبرها، برندها و کمپلیکیشن‌های کرونوس.",
  alternates: { canonical: paths.search },
  // Result pages repeat what the entries already say; search engines should index the entries instead
  robots: { index: false, follow: true },
};

export default function SearchRoute() {
  return <SearchPage />;
}
