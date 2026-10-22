import Link from "next/link";

import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

/* The travelling movement comes back for the last time, turned over to its dial side, above the way in. */
export function HomeFinale() {
  return (
    <section
      data-stage="finale"
      aria-labelledby="finale-title"
      className="relative isolate flex h-[150dvh] flex-col items-center justify-end gap-6 overflow-hidden px-4 pb-[30dvh] text-center sm:px-8"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-2/3 rim-light" />
      <h2 id="finale-title" className="display">
        دو رو، یک قلب
      </h2>
      <p className="max-w-md leading-8 text-muted-foreground">
        در آزمایشگاه همین موومنت را بچرخانید، قطعه‌هایش را جدا کنید و زمان را آن‌قدر کند کنید که
        حرکت لنگر را ببینید.
      </p>
      <Button asChild size="lg" className="mt-4">
        <Link href={paths.labCalibre("automatic")} data-cursor="ورود">
          ورود به آزمایشگاه
        </Link>
      </Button>
      <p className="caps text-muted-foreground" dir="ltr">
        Two faces · One heart
      </p>
    </section>
  );
}
