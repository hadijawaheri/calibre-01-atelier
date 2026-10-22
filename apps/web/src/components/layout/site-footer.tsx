import Link from "next/link";

import { BrandMark } from "./brand-mark";
import { NAV_LINKS } from "./nav-links";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-24 text-center sm:px-8">
        <BrandMark />
        <p className="max-w-sm text-sm leading-7 text-muted-foreground">
          مرجع فارسی ساعت‌های مکانیکی، از قلب یک موومنت تا برندهایی که زمان را به هنر تبدیل کردند.
        </p>
        <nav aria-label="پیوندهای پایین صفحه" className="flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-muted-foreground transition-colors duration-500 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="h-px w-16 bg-metal/50" aria-hidden />
        <p className="max-w-md text-xs leading-6 text-muted-foreground">
          نام برندها، مدل‌ها و کالیبرها فقط برای معرفی و آموزش آمده و کرونوس به هیچ‌کدام وابسته
          نیست.
        </p>
      </div>
    </footer>
  );
}
