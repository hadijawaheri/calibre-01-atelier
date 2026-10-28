"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import type { CompareMode, CompareSet } from "../rows";
import { compareRows, MAX_ITEMS, MISSING, pickSlugs } from "../rows";

const MODES: Record<CompareMode, { tab: string; noun: string }> = {
  watches: { tab: "ساعت‌ها", noun: "ساعت" },
  calibres: { tab: "کالیبرها", noun: "کالیبر" },
};

const ordinal = ["اول", "دوم", "سوم"];

/* The choice lives in the address (?watches=a,b), so a comparison can be shared and survives a reload. */
export function CompareTool({ sets }: { sets: Record<CompareMode, CompareSet> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const id = useId();
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  const mode: CompareMode =
    params.has("calibres") && !params.has("watches") ? "calibres" : "watches";
  const set = sets[mode];
  const slugs = pickSlugs(set, params.get(mode));
  const items = slugs.map((slug) => set.items.find((item) => item.slug === slug)!);
  const rows = compareRows(set, slugs, onlyDifferences);
  // One empty slot after the chosen ones, until all three are taken
  const slots = Math.min(Math.max(slugs.length + 1, 2), MAX_ITEMS);

  const choose = (index: number, slug: string) => {
    const next = [...slugs];
    if (slug) next[index] = slug;
    else next.splice(index, 1);
    const query = next.filter(Boolean).join(",");
    router.replace(query ? `${pathname}?${mode}=${query}` : `${pathname}?${mode}=`, {
      scroll: false,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <nav aria-label="نوع مقایسه" className="flex gap-2">
        {(Object.keys(MODES) as CompareMode[]).map((key) => (
          <Link
            key={key}
            href={`${pathname}?${key}=`}
            replace
            scroll={false}
            aria-current={mode === key ? "page" : undefined}
            className={cn(
              "border px-4 py-1.5 text-sm transition-colors duration-300",
              mode === key
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {MODES[key].tab}
          </Link>
        ))}
      </nav>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: slots }, (_, index) => {
          const selectId = `${id}-slot-${index}`;
          const value = slugs[index] ?? "";
          return (
            <div key={index} className="flex flex-col gap-1.5">
              <label htmlFor={selectId} className="label">
                {MODES[mode].noun} {ordinal[index]}
              </label>
              <select
                id={selectId}
                value={value}
                onChange={(event) => choose(index, event.target.value)}
                className="h-11 w-full border border-input bg-card px-3 text-sm transition-colors duration-300 outline-none focus:border-foreground"
              >
                <option value="">{value ? "برداشتن از مقایسه" : "انتخاب کنید…"}</option>
                {set.items.map((item) => (
                  <option
                    key={item.slug}
                    value={item.slug}
                    // An item already in another slot cannot be picked twice
                    disabled={item.slug !== value && slugs.includes(item.slug)}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {items.length < 2 ? (
        <p className="border border-dashed border-border bg-secondary/50 p-6 text-sm leading-7 text-muted-foreground">
          {items.length === 0
            ? `دو یا سه ${MODES[mode].noun} انتخاب کنید تا مشخصاتشان کنار هم بیاید.`
            : `یک ${MODES[mode].noun} دیگر انتخاب کنید تا مقایسه شروع شود.`}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Switch
              id={`${id}-diff`}
              checked={onlyDifferences}
              onCheckedChange={setOnlyDifferences}
            />
            <Label htmlFor={`${id}-diff`} className="text-sm font-normal">
              فقط تفاوت‌ها
            </Label>
          </div>
          {/* On phones the table scrolls inside its own frame; the page itself never scrolls sideways */}
          <div className="overflow-x-auto plate">
            <table className="w-full min-w-[34rem] text-sm">
              <caption className="sr-only">مقایسهٔ {MODES[mode].tab}</caption>
              <thead className="border-b border-border bg-secondary/60">
                <tr>
                  <th
                    scope="col"
                    className="sticky start-0 w-32 bg-secondary px-4 py-3 text-start label font-normal sm:w-40"
                  >
                    <span className="sr-only">مشخصه</span>
                  </th>
                  {items.map((item) => (
                    <th key={item.slug} scope="col" className="px-4 py-3 text-start font-normal">
                      <Link
                        href={item.href}
                        className="font-display text-xl underline-offset-4 hover:underline"
                      >
                        {item.name}
                      </Link>
                      {item.latin && (
                        <p className="caps text-muted-foreground" dir="ltr">
                          {item.latin}
                        </p>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={row.label} className="align-top">
                    {/* The labels stay in view while a phone scrolls the columns */}
                    <th
                      scope="row"
                      className="sticky start-0 bg-card px-4 py-3 text-start label font-normal"
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, index) => (
                      <td
                        key={items[index]!.slug}
                        className={cn(
                          "px-4 py-3 leading-6",
                          value === MISSING ? "text-muted-foreground" : "text-foreground/85",
                        )}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && (
            <p className="text-sm text-muted-foreground">این‌ها در همهٔ مشخصات یکسان‌اند.</p>
          )}
          <p className="text-xs leading-6 text-muted-foreground">
            هر عدد از منابعی آمده که در صفحهٔ همان {MODES[mode].noun} فهرست شده‌اند؛ خط تیره یعنی
            منبعی آن را نداده است.
          </p>
        </div>
      )}
    </div>
  );
}
