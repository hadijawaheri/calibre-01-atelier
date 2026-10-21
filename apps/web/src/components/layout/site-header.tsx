import Link from "next/link";

import { UserMenu } from "@/features/auth";
import { CartSheet } from "@/features/cart";

import { BrandMark } from "./brand-mark";
import { MobileNav } from "./mobile-nav";
import { NAV_LINKS } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only z-50 bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:start-4 focus:top-2"
      >
        رفتن به محتوای اصلی
      </a>
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-1">
          <MobileNav />
          <nav aria-label="منوی اصلی" className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <BrandMark />
        <div className="flex items-center justify-end gap-1">
          <ThemeToggle />
          <UserMenu />
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
