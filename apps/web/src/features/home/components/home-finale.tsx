import Link from "next/link";

import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

import { StillMovement } from "./still-movement";

/* The close: the dial side on its plate, the way into the lab beside it. */
export function HomeFinale() {
  return (
    <section
      data-stage="finale"
      aria-labelledby="finale-title"
      className="mx-auto max-w-7xl px-4 pt-4 pb-8 sm:px-6"
    >
      <div className="grid items-center shadow-plate plate lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-5 p-8 sm:p-12">
          <h2 id="finale-title" className="display">
            دو رو، یک قلب
          </h2>
          <p className="max-w-md leading-8 text-muted-foreground">
            در آزمایشگاه همین موومنت را بچرخانید، قطعه‌هایش را جدا کنید و زمان را آن‌قدر کند کنید که
            حرکت لنگر را ببینید.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={paths.labCalibre("automatic")}>ورود به آزمایشگاه</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={paths.lab}>همهٔ خانواده‌ها</Link>
            </Button>
          </div>
        </div>
        <figure className="flex flex-col border-border bg-secondary/50 max-lg:border-t lg:h-full lg:border-s">
          <div className="flex flex-1 items-center px-8 py-12 sm:px-12">
            <StillMovement side="dial" className="w-full" />
          </div>
          <figcaption className="flex items-baseline justify-between gap-4 border-t border-border px-4 py-3 text-sm">
            <span>همان موومنت، از سمت صفحه</span>
            <span className="shrink-0 caps whitespace-nowrap text-muted-foreground" dir="ltr">
              Fig. 2 · Dial side
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
