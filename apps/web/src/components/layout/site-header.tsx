import { BrandMark } from "./brand-mark";
import { HeaderNav } from "./header-nav";
import { MobileNav } from "./mobile-nav";
import { buildSearchIndex } from "./search-index";
import { SiteSearch } from "./site-search";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const entries = buildSearchIndex();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only z-50 bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:start-4 focus:top-2"
      >
        رفتن به محتوای اصلی
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <MobileNav />
        <BrandMark />
        <SiteSearch entries={entries} className="ms-auto hidden max-w-xl flex-1 md:block" />
        <ThemeToggle className="ms-auto md:ms-0" />
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 md:pb-0">
        <SiteSearch entries={entries} className="md:hidden" />
        <HeaderNav className="max-md:hidden" />
      </div>
    </header>
  );
}
