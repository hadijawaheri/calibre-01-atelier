import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { CALIBRES } from "@/features/movement";
import { paths } from "@/lib/paths";

const ROWS = [
  { key: "energy", label: "انرژی" },
  { key: "accuracy", label: "دقت" },
  { key: "beat", label: "تپش" },
  { key: "signature", label: "نشانه" },
] as const;

export function HomeFamilies() {
  return (
    <section
      data-stage="families"
      aria-labelledby="families-title"
      className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-40 sm:px-6"
    >
      <div className="flex flex-col gap-4">
        <p className="font-mono text-[11px] text-muted-foreground uppercase" dir="ltr">
          Four families
        </p>
        <h2 id="families-title" className="text-4xl font-bold sm:text-5xl">
          چهار خانوادهٔ موومنت
        </h2>
      </div>
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {CALIBRES.map((calibre, index) => (
          <li key={calibre.slug} className="bg-background">
            <Link
              href={paths.labCalibre(calibre.slug)}
              className="group flex h-full flex-col gap-6 p-6 transition-colors hover:bg-surface focus-visible:bg-surface"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-4xl text-gold">
                  {(index + 1).toLocaleString("fa-IR")}
                </span>
                <ArrowLeft
                  className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-1"
                  aria-hidden
                />
              </div>
              <h3 className="text-xl font-semibold">{calibre.name}</h3>
              <dl className="flex flex-col gap-3 text-sm">
                {ROWS.map((row) => (
                  <div key={row.key} className="flex flex-col gap-0.5">
                    <dt className="text-xs text-muted-foreground">{row.label}</dt>
                    <dd className="leading-6">{calibre.glance[row.key]}</dd>
                  </div>
                ))}
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
