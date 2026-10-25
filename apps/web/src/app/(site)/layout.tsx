import type { PropsWithChildren } from "react";

import { SiteShell } from "@/components/layout/site-shell";

export default function SiteLayout({ children }: PropsWithChildren) {
  return <SiteShell>{children}</SiteShell>;
}
