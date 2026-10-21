"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface SectionNavProps {
  label: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}

export function SectionNav({ label, links }: SectionNavProps) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="flex gap-6 overflow-x-auto border-b border-border">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px shrink-0 border-b-2 py-3 text-sm transition-colors",
              active
                ? "border-gold text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
