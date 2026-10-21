import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

/* The travelling movement comes back for the last time, turned over to its dial side, above the way in. */
export function HomeFinale() {
  return (
    <section
      data-stage="finale"
      aria-labelledby="finale-title"
      className="relative isolate flex h-[150dvh] flex-col items-center justify-end gap-6 overflow-hidden px-4 pb-[32dvh] text-center sm:px-6"
    >
      <div aria-hidden className="absolute inset-0 -z-10 opacity-60 warm-glow" />
      <p className="font-mono text-[11px] text-muted-foreground uppercase" dir="ltr">
        Two faces · One heart
      </p>
      <h2 id="finale-title" className="text-5xl leading-tight font-black text-balance sm:text-7xl">
        دو رو، یک قلب
      </h2>
      <p className="max-w-lg leading-8 text-muted-foreground">
        در آزمایشگاه همین موومنت را بچرخانید، قطعه‌هایش را از هم جدا کنید و زمان را آن‌قدر کند کنید
        که حرکت لنگر را ببینید.
      </p>
      <Button asChild size="lg">
        <Link href={paths.labCalibre("automatic")}>
          ورود به آزمایشگاه
          <ArrowLeft data-icon="inline-end" />
        </Link>
      </Button>
    </section>
  );
}
