import Link from "next/link";

import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="relative isolate mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-6 px-4 py-40 text-center">
        <div aria-hidden className="absolute inset-0 -z-10 rim-light" />
        <h1 className="display">این صفحه پیدا نشد</h1>
        <p className="leading-8 text-muted-foreground">شاید نشانی را اشتباه وارد کرده‌اید.</p>
        <div className="mt-4 flex gap-3">
          <Button asChild size="lg">
            <Link href={paths.lab}>آزمایشگاه موومنت</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={paths.home}>صفحهٔ اصلی</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
