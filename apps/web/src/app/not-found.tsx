import Link from "next/link";

import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-24 sm:px-6 lg:py-32">
        <h1 className="max-w-[20ch] display">این صفحه پیدا نشد</h1>
        <p className="caps text-muted-foreground" dir="ltr">
          Error 404 · Not in the atlas
        </p>
        <p className="max-w-lg leading-8 text-muted-foreground">
          شاید نشانی را اشتباه وارد کرده‌اید. از جستجوی بالای صفحه استفاده کنید یا از یکی از این دو
          راه شروع کنید.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
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
