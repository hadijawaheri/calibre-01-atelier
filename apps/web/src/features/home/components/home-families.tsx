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

const COLUMNS = "lg:grid-cols-[minmax(0,13rem)_repeat(4,minmax(0,1fr))_1.5rem]";

/* A collector's catalogue: one ruled line per family, the same four questions answered across. */
export function HomeFamilies() {
  return (
    <section
      data-stage="families"
      aria-labelledby="families-title"
      className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-48 sm:px-8"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <h2 id="families-title" className="display">
          چهار خانوادهٔ موومنت
        </h2>
        <p className="caps text-muted-foreground" dir="ltr">
          Four families
        </p>
      </div>
      <div className="flex flex-col">
        <div
          aria-hidden
          className={`hidden gap-8 border-b hairline pb-4 text-xs text-muted-foreground lg:grid ${COLUMNS}`}
        >
          <span />
          {ROWS.map((row) => (
            <span key={row.key}>{row.label}</span>
          ))}
        </div>
        <ul className="flex flex-col">
          {CALIBRES.map((calibre) => (
            <li key={calibre.slug} className="border-b border-border">
              <Link
                href={paths.labCalibre(calibre.slug)}
                data-cursor="باز کنید"
                className={`group grid gap-6 py-8 transition-colors duration-500 hover:bg-surface/60 focus-visible:bg-surface/60 lg:gap-8 lg:py-10 ${COLUMNS}`}
              >
                <h3 className="font-display text-3xl">{calibre.name}</h3>
                <dl className="contents">
                  {ROWS.map((row) => (
                    <div key={row.key} className="flex flex-col gap-1">
                      <dt className="text-xs text-muted-foreground lg:sr-only">{row.label}</dt>
                      <dd className="text-base leading-8 text-foreground/85">
                        {calibre.glance[row.key]}
                      </dd>
                    </div>
                  ))}
                </dl>
                <ArrowLeft
                  className="size-4 self-center text-muted-foreground transition-[translate,color] duration-500 ease-glide group-hover:-translate-x-1 group-hover:text-metal max-lg:hidden"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
