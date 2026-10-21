import { SiteShell } from "@/components/layout/site-shell";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
