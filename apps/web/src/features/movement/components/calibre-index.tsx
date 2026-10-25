import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { PageHeader, Tag } from "@/components/atlas";
import { paths } from "@/lib/paths";

import { CALIBRES } from "../calibres";

/* The four families as the atlas's database: one ruled entry each, reference and first figures beside it. */
export function CalibreIndex() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 lg:py-20">
      <PageHeader
        title="موومنت را باز کنید، قطعه‌به‌قطعه"
        reference="Movement laboratory · 4 families"
        intro="چهار خانوادهٔ بزرگ موومنت: اتوماتیک، فوق‌باریک، کوارتز و توربیون. هر کدام با سازوکار، مشخصات و ساعت‌هایی که در آن‌ها می‌تپد."
      />
      <ul className="divide-y divide-border plate">
        {CALIBRES.map((calibre) => (
          <li key={calibre.slug}>
            <Link
              href={paths.labCalibre(calibre.slug)}
              className="group grid gap-5 p-5 transition-colors duration-300 hover:bg-secondary/50 focus-visible:bg-secondary/50 sm:p-7 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,15rem)_auto] lg:items-start lg:gap-10"
            >
              <div className="flex flex-col gap-1.5">
                <h2 className="font-display text-[1.75rem] leading-snug">{calibre.name}</h2>
                <p className="font-mono text-xs text-muted-foreground" dir="ltr">
                  {calibre.reference}
                </p>
              </div>
              <p className="max-w-[60ch] leading-8 text-muted-foreground">{calibre.summary}</p>
              <dl className="flex flex-col divide-y divide-border border-y border-border text-sm">
                {calibre.specs.slice(0, 2).map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-0.5 py-2">
                    <dt className="label">{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                <Tag tone={calibre.hasModel ? "ink" : "muted"}>
                  {calibre.hasModel ? "مدل سه‌بعدی" : "سه‌بعدی به‌زودی"}
                </Tag>
                <ArrowLeft
                  aria-hidden
                  className="size-4 text-muted-foreground transition-[translate,color] duration-300 group-hover:-translate-x-1 group-hover:text-foreground"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
