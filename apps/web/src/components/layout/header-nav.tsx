"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { FAMILY_LINKS, NAV_LINKS } from "./nav-links";

/** The atlas's category row: the sections, then the four families, the current one underlined. */
export function HeaderNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const link = (href: string, label: string) => {
    const current = href === "/" ? pathname === "/" : pathname === href;
    return (
      <Link
        key={href}
        href={href}
        aria-current={current ? "page" : undefined}
        className={cn(
          "relative flex h-10 items-center text-sm whitespace-nowrap transition-colors duration-300",
          current
            ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {label}
      </Link>
    );
  };
  return (
    <nav
      aria-label="منوی اصلی"
      className={cn("flex items-center gap-7 overflow-x-auto", className)}
    >
      {NAV_LINKS.map((l) => link(l.href, l.label))}
      <span aria-hidden className="h-4 w-px shrink-0 bg-border" />
      {FAMILY_LINKS.map((l) => link(l.href, l.label))}
    </nav>
  );
}
