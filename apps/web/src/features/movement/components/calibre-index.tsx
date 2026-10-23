import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { paths } from "@/lib/paths";

import { CALIBRES } from "../calibres";

/* The four families as a catalogue: one ruled entry each, the reference set small beside the name. */
export function CalibreIndex() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-20 px-4 pt-40 pb-32 sm:px-8">
      <header className="flex flex-col items-center gap-6 text-center">
        <h1 className="max-w-[22ch] display">موومنت را باز کنید، قطعه‌به‌قطعه</h1>
        <p className="max-w-lg leading-8 text-muted-foreground">
          چهار خانوادهٔ بزرگ موومنت: اتوماتیک، فوق‌باریک، کوارتز و توربیون. هر کدام با سازوکار،
          مشخصات و ساعت‌هایی که در آن‌ها می‌تپد.
        </p>
      </header>
      <ul className="flex flex-col border-t hairline">
        {CALIBRES.map((calibre) => (
          <li key={calibre.slug} className="border-b border-border">
            <Link
              href={paths.labCalibre(calibre.slug)}
              data-cursor="باز کنید"
              className="group grid gap-4 py-10 transition-colors duration-500 hover:bg-surface/60 focus-visible:bg-surface/60 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-10 sm:px-6"
            >
              <div className="flex flex-col gap-3">
                <h2 className="font-display text-3xl">{calibre.name}</h2>
                <p className="max-w-xl leading-8 text-muted-foreground">{calibre.summary}</p>
              </div>
              <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-3">
                <span className="caps text-muted-foreground" dir="ltr">
                  {calibre.reference}
                </span>
                <span className="flex items-center gap-2 text-xs text-metal">
                  {calibre.hasModel ? "مدل سه‌بعدی" : "سه‌بعدی به‌زودی"}
                  <ArrowLeft
                    className="size-4 transition-transform duration-500 ease-glide group-hover:-translate-x-1"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
