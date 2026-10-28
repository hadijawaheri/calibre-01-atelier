import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

type PagerEntry = { href: string; label: string } | undefined;

/* Icons are drawn for left-to-right and turned for Persian, so "previous" points to the start side. */

/** The previous and next entries of a register, so it can be read in order one page at a time. */
export function EntryPager({
  previous,
  next,
  label,
}: {
  previous: PagerEntry;
  next: PagerEntry;
  label: string;
}) {
  if (!previous && !next) return null;
  const linkClass =
    "group flex flex-col gap-1 bg-card p-4 transition-colors duration-300 hover:bg-secondary";
  return (
    <nav aria-label={label} className="grid gap-px border border-border bg-border sm:grid-cols-2">
      {previous ? (
        <Link href={previous.href} rel="prev" className={linkClass}>
          <span className="inline-flex items-center gap-1.5 label">
            <ArrowLeft aria-hidden className="size-3.5 rtl:rotate-180" />
            قبلی
          </span>
          <span>{previous.label}</span>
        </Link>
      ) : (
        <span aria-hidden className="hidden bg-card sm:block" />
      )}
      {next && (
        <Link href={next.href} rel="next" className={`${linkClass} sm:items-end sm:text-end`}>
          <span className="inline-flex items-center gap-1.5 label">
            بعدی
            <ArrowRight aria-hidden className="size-3.5 rtl:rotate-180" />
          </span>
          <span>{next.label}</span>
        </Link>
      )}
    </nav>
  );
}
