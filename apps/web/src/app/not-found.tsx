import Link from "next/link";

import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-32 text-center">
        <p className="font-display text-8xl text-gold">۴۰۴</p>
        <h1 className="font-display text-4xl">این صفحه پیدا نشد</h1>
        <p className="leading-7 text-muted-foreground">
          شاید نشانی را اشتباه وارد کرده‌اید یا این ساعت دیگر در کلکسیون نیست.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href={paths.watches}>دیدن ساعت‌ها</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={paths.home}>صفحه‌ی اصلی</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
