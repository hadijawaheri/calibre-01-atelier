import Link from "next/link";

import { BrandMark } from "./brand-mark";
import { FAMILY_LINKS, NAV_LINKS } from "./nav-links";

export function SiteFooter() {
  const column = (title: string, links: readonly { href: string; label: string }[]) => (
    <nav aria-label={title} className="flex flex-col gap-3">
      <p className="label">{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-foreground/80 transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,2fr)_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <BrandMark />
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            مرجع فارسی ساعت‌های مکانیکی، از قلب یک موومنت تا برندهایی که زمان را به هنر تبدیل کردند.
          </p>
        </div>
        {column("بخش‌ها", NAV_LINKS)}
        {column("خانواده‌ها", FAMILY_LINKS)}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs leading-6 text-muted-foreground">
            نام برندها، مدل‌ها و کالیبرها فقط برای معرفی و آموزش آمده و کرونوس به هیچ‌کدام وابسته
            نیست.
          </p>
          <p className="caps text-muted-foreground" dir="ltr">
            Kronos · Persian atlas of horology
          </p>
        </div>
      </div>
    </footer>
  );
}
