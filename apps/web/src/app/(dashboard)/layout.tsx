import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = { robots: { index: false } };

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
