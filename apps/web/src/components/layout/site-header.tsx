import Link from "next/link";

import { BrandMark } from "./brand-mark";
import { HeaderReveal } from "./header-reveal";
import { MobileNav } from "./mobile-nav";
import { NAV_LINKS } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <HeaderReveal>
      <header className="border-b border-border/60 bg-background/55 backdrop-blur-xl backdrop-saturate-150">
        <a
          href="#main"
          className="sr-only z-50 bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:start-4 focus:top-2"
        >
          رفتن به محتوای اصلی
        </a>
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-8">
          <div className="flex items-center">
            <MobileNav />
            <nav aria-label="منوی اصلی" className="hidden items-center gap-10 lg:flex">
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
          </div>
          <BrandMark />
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </header>
    </HeaderReveal>
  );
}
