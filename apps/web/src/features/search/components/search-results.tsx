"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { search } from "@/components/layout/search-match";
import type { SearchEntry, SearchGroup } from "@/components/layout/search-types";
import { SEARCH_GROUPS } from "@/components/layout/search-types";
import { paths } from "@/lib/paths";
import { cn } from "@/lib/utils";

const GROUPS = Object.keys(SEARCH_GROUPS) as SearchGroup[];

const SUGGESTIONS = ["کرونوگراف", "رولکس", "۱۹۶۹", "ETA", "توربیون", "کوارتز"];

const isGroup = (value: string | null): value is SearchGroup =>
  value !== null && value in SEARCH_GROUPS;

const fa = (count: number) => count.toLocaleString("fa-IR");

function groupHref(query: string, group?: SearchGroup) {
  const params = new URLSearchParams({ q: query });
  if (group) params.set("group", group);
  return `${paths.search}?${params.toString()}`;
}

/* The query lives in the address, so a search can be shared and the form works before the script loads. */
export function SearchResults({ entries }: { entries: SearchEntry[] }) {
  const params = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const groupParam = params.get("group");
  const group = isGroup(groupParam) ? groupParam : undefined;

  const matches = useMemo(() => search(entries, query), [entries, query]);
  const counts = GROUPS.map((key) => ({
    key,
    count: matches.filter((entry) => entry.group === key).length,
  }));
  const shown = group ? matches.filter((entry) => entry.group === group) : matches;
  const sections = GROUPS.filter((key) => !group || key === group)
    .map((key) => ({ key, entries: shown.filter((entry) => entry.group === key) }))
    .filter((section) => section.entries.length > 0);

  return (
    <div className="flex flex-col gap-10">
      <form action={paths.search} role="search" className="relative max-w-2xl">
        <label htmlFor="search-page-input" className="sr-only">
          جستجو در کرونوس
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          // The key resets the field when the address changes, such as after a search from the header
          key={query}
          id="search-page-input"
          name="q"
          type="search"
          defaultValue={query}
          autoComplete="off"
          placeholder="مدل، برند، کالیبر، کمپلیکیشن یا سال…"
          className="h-14 w-full border border-input bg-card ps-12 pe-4 text-base transition-colors duration-300 outline-none placeholder:text-muted-foreground focus:border-foreground [&::-webkit-search-cancel-button]:hidden"
        />
      </form>

      {!query ? (
        <div className="flex flex-col gap-3">
          <p className="label">چند پیشنهاد</p>
          <ul className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <li key={suggestion}>
                <Link
                  href={groupHref(suggestion)}
                  className="inline-flex border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  {suggestion}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <nav aria-label="دسته‌های نتیجه" className="flex flex-wrap gap-2">
            <Link
              href={groupHref(query)}
              aria-current={!group ? "page" : undefined}
              className={cn(
                "border px-3 py-1 text-sm transition-colors duration-300",
                !group
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              همه ({fa(matches.length)})
            </Link>
            {counts
              .filter(({ count }) => count > 0)
              .map(({ key, count }) => (
                <Link
                  key={key}
                  href={groupHref(query, key)}
                  aria-current={group === key ? "page" : undefined}
                  className={cn(
                    "border px-3 py-1 text-sm transition-colors duration-300",
                    group === key
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {SEARCH_GROUPS[key]} ({fa(count)})
                </Link>
              ))}
          </nav>

          <p role="status" className="text-sm text-muted-foreground">
            {shown.length > 0
              ? `${fa(shown.length)} نتیجه برای «${query}»`
              : `برای «${query}» چیزی پیدا نشد. املای دیگری یا نام لاتین را امتحان کنید.`}
          </p>

          {sections.map((section) => (
            <section
              key={section.key}
              aria-labelledby={`results-${section.key}`}
              className="flex flex-col gap-4"
            >
              <h2
                id={`results-${section.key}`}
                className="border-b border-border pb-3 font-display text-2xl"
              >
                {SEARCH_GROUPS[section.key]}
              </h2>
              <ul className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {section.entries.map((entry) => (
                  <li key={entry.href + entry.label}>
                    <Link
                      href={entry.href}
                      className="flex h-full flex-col gap-1 bg-card p-4 transition-colors duration-300 hover:bg-secondary"
                    >
                      <span>{entry.label}</span>
                      {entry.latin && (
                        <span
                          className="truncate font-mono text-xs text-muted-foreground"
                          dir="ltr"
                        >
                          {entry.latin}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{entry.kind}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
