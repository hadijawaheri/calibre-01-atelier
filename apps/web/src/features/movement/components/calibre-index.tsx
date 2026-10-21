import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { paths } from "@/lib/paths";

import { CALIBRES } from "../calibres";

export function CalibreIndex() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 pt-32 pb-24 sm:px-6">
      <header className="flex max-w-2xl flex-col gap-4">
        <p className="eyebrow">آزمایشگاه موومنت</p>
        <h1 className="text-4xl leading-tight font-semibold sm:text-5xl">
          موومنت را باز کنید، قطعه‌به‌قطعه
        </h1>
        <p className="leading-8 text-muted-foreground">
          چهار خانوادهٔ بزرگ موومنت: اتوماتیک، فوق‌باریک، کوارتز و توربیون. هر کدام با سازوکار،
          مشخصات و ساعت‌هایی که در آن‌ها می‌تپد؛ و مدل سه‌بعدی واقعی که قطعه‌به‌قطعه باز می‌شود.
        </p>
      </header>
      <ul className="grid gap-4">
        {CALIBRES.map((calibre) => (
          <li key={calibre.slug}>
            <Link
              href={paths.labCalibre(calibre.slug)}
              className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-gold/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-2">
                <p className="font-mono text-xs text-muted-foreground" dir="ltr">
                  {calibre.reference}
                </p>
                <h2 className="flex flex-wrap items-center gap-3 text-2xl font-semibold">
                  {calibre.name}
                  {calibre.hasModel ? (
                    <Badge variant="secondary">سه‌بعدی</Badge>
                  ) : (
                    <Badge variant="outline">به‌زودی سه‌بعدی</Badge>
                  )}
                </h2>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                  {calibre.summary}
                </p>
              </div>
              <span className="flex items-center gap-2 text-sm text-gold">
                باز کردن
                <ArrowLeft
                  className="size-4 transition-transform group-hover:-translate-x-1"
                  aria-hidden
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
