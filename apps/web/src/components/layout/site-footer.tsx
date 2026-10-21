import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { paths } from "@/lib/paths";

import { BrandMark } from "./brand-mark";

const COLUMNS = [
  {
    title: "کلکسیون",
    links: [
      { href: `${paths.watches}?collection=tourbillon`, label: "توربیون" },
      { href: `${paths.watches}?collection=chronograph`, label: "کرونوگراف" },
      { href: `${paths.watches}?collection=heritage`, label: "هریتیج" },
      { href: `${paths.watches}?collection=diver`, label: "غواصی" },
      { href: `${paths.watches}?collection=dress`, label: "رسمی" },
    ],
  },
  {
    title: "خدمات",
    links: [
      { href: `${paths.home}#services`, label: "ضمانت پنج‌ساله" },
      { href: `${paths.home}#services`, label: "سرویس دوره‌ای موتور" },
      { href: `${paths.home}#services`, label: "حکاکی اختصاصی" },
      { href: paths.orders, label: "پیگیری سفارش" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          <BrandMark />
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            ساعت‌های مکانیکی دست‌ساز، مونتاژ و تنظیم‌شده به دست یک ساعت‌ساز. نمایشگاه آتلیه: تهران،
            خیابان فرشته، با هماهنگی قبلی.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
            <p className="eyebrow">{column.title}</p>
            {column.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <p>© ۱۴۰۵ آتلیه کرونوس. برند کرونوس ساختگی است و برای نمایش این فروشگاه ساخته شده.</p>
        <p>
          طرح موومنت صفحه‌ی اول از Zenith El Primero 400 الهام گرفته و هیچ وابستگی‌ای به Zenith
          ندارد.
        </p>
      </div>
    </footer>
  );
}
