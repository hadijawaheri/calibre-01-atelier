import Link from "next/link";

import { Separator } from "@/components/ui/separator";

import { BrandMark } from "./brand-mark";
import { NAV_LINKS } from "./nav-links";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[2fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          <BrandMark />
          <p className="max-w-md text-sm leading-7 text-muted-foreground">
            مرجع فارسی ساعت‌های مکانیکی: از قلب یک موومنت تا تاریخ برندهایی که زمان را به هنر تبدیل
            کردند.
          </p>
        </div>
        <nav aria-label="پیوندهای پایین صفحه" className="flex flex-col gap-3">
          <p className="eyebrow">کاوش</p>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs leading-6 text-muted-foreground sm:px-6">
        <p>
          نام برندها، مدل‌ها و کالیبرها فقط برای معرفی و آموزش آمده و کرونوس به هیچ‌کدام وابسته
          نیست.
        </p>
      </div>
    </footer>
  );
}
