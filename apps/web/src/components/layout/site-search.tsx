"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { SearchEntry } from "./search-index";

const LIMIT = 8;

/** Persian has two forms of ye and kaf in the wild; folding them lets "سیکو" find what was typed "سيكو". */
function fold(text: string) {
  return text.toLowerCase().replaceAll("ي", "ی").replaceAll("ك", "ک").replaceAll("‌", " ").trim();
}

/** The atlas's omni-search: families, watches and parts, filtered as the visitor types. */
export function SiteSearch({ entries, className }: { entries: SearchEntry[]; className?: string }) {
  const router = useRouter();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = fold(query);
    if (!q) return [];
    const words = q.split(/\s+/);
    return entries
      .filter((entry) => words.every((w) => fold(entry.terms).includes(w)))
      .slice(0, LIMIT);
  }, [entries, query]);

  const expanded = open && query.trim().length > 0;

  const go = (entry: SearchEntry | undefined) => {
    if (!entry) return;
    setOpen(false);
    setQuery("");
    input.current?.blur();
    router.push(entry.href);
  };

  return (
    <form
      role="search"
      className={cn("relative", className)}
      onSubmit={(event) => {
        event.preventDefault();
        go(results[active]);
      }}
    >
      <label htmlFor={`${id}-input`} className="sr-only">
        جستجو در کرونوس
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        ref={input}
        id={`${id}-input`}
        type="search"
        role="combobox"
        aria-expanded={expanded}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={expanded && results[active] ? `${id}-${active}` : undefined}
        autoComplete="off"
        value={query}
        placeholder="جستجوی موومنت، ساعت، کالیبر یا قطعه…"
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        className="h-10 w-full border border-input bg-card ps-10 pe-3 text-sm transition-colors duration-300 outline-none placeholder:text-muted-foreground focus:border-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      {expanded && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label="نتیجه‌های جستجو"
          className="absolute inset-x-0 top-full z-50 mt-1 max-h-[70dvh] overflow-y-auto border border-border bg-popover shadow-plate"
        >
          {results.length === 0 ? (
            <li
              role="option"
              aria-selected={false}
              aria-disabled
              className="px-4 py-3 text-sm text-muted-foreground"
            >
              چیزی پیدا نشد. نام یک برند، کالیبر یا قطعه را امتحان کنید.
            </li>
          ) : (
            results.map((entry, index) => (
              <li
                key={`${entry.kind}-${entry.label}`}
                id={`${id}-${index}`}
                role="option"
                aria-selected={index === active}
                // mousedown, not click: the input's blur would close the list before a click lands
                onMouseDown={(event) => {
                  event.preventDefault();
                  go(entry);
                }}
                onMouseEnter={() => setActive(index)}
                className={cn(
                  "flex cursor-pointer flex-col gap-0.5 border-b border-border px-4 py-2.5 last:border-b-0",
                  index === active && "bg-secondary",
                )}
              >
                <span className="flex items-baseline justify-between gap-4 text-sm">
                  <span>{entry.label}</span>
                  {entry.latin && (
                    <span className="truncate font-mono text-xs text-muted-foreground" dir="ltr">
                      {entry.latin}
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">{entry.kind}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </form>
  );
}
