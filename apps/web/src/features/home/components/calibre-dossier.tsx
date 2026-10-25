"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Tabs } from "radix-ui";

import { Spec, SpecGrid } from "@/components/atlas";
import type { CalibreInfo } from "@/features/movement";
import { paths } from "@/lib/paths";

/** The atlas's "calibre of the day": one family's dossier at a time, the four a tab apart. */
export function CalibreDossier({ calibres }: { calibres: readonly CalibreInfo[] }) {
  return (
    <Tabs.Root defaultValue={calibres[0]?.slug} className="flex flex-col shadow-plate plate">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <h2 className="text-sm">پروندهٔ کالیبر</h2>
        <span className="caps text-muted-foreground" dir="ltr">
          Calibre dossier
        </span>
      </div>
      <Tabs.List
        aria-label="خانوادهٔ موومنت"
        className="grid grid-cols-4 border-b border-border text-xs sm:text-sm"
      >
        {calibres.map((calibre) => (
          <Tabs.Trigger
            key={calibre.slug}
            value={calibre.slug}
            className="relative px-2 py-3 text-muted-foreground transition-colors duration-300 not-last:border-e not-last:border-border hover:text-foreground data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-px data-[state=active]:after:bg-metal"
          >
            {calibre.shortName}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {calibres.map((calibre) => (
        <Tabs.Content
          key={calibre.slug}
          value={calibre.slug}
          className="flex flex-col gap-5 p-5 outline-none sm:p-6"
        >
          <div className="flex flex-col gap-1">
            <p className="title">{calibre.name}</p>
            <p className="caps text-muted-foreground" dir="ltr">
              {calibre.reference}
            </p>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">{calibre.summary}</p>
          <SpecGrid className="grid-cols-2 [&>:last-child:nth-child(odd)]:col-span-2">
            {calibre.specs.slice(0, 4).map((spec) => (
              <Spec key={spec.label} label={spec.label} value={spec.value} />
            ))}
          </SpecGrid>
          <div className="flex flex-col gap-2">
            <p className="label">در کدام ساعت‌ها</p>
            <ul className="divide-y divide-border border-y border-border">
              {calibre.usedIn.slice(0, 3).map((watch) => (
                <li
                  key={`${watch.brand}-${watch.model}`}
                  className="flex items-baseline justify-between gap-4 py-2 text-sm"
                >
                  <span dir="ltr">
                    {watch.brand} {watch.model}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">{watch.calibre}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href={paths.labCalibre(calibre.slug)}
            className="group inline-flex items-center gap-2 self-start text-sm underline underline-offset-4 hover:text-metal-ink"
          >
            پروندهٔ کامل {calibre.name}
            <ArrowLeft
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
            />
          </Link>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
