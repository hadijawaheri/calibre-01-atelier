import Link from "next/link";

import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

import type { CalibreInfo } from "../calibres";
import { CalibreHowItWorks, CalibreSpecs, CalibreUsedIn } from "./calibre-facts";

/** A calibre whose real 3D model is not ready yet: the facts now, the model when its CAD file arrives. */
export function CalibreProfile({ calibre }: { calibre: CalibreInfo }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-24 px-4 pt-24 pb-32 sm:px-8 lg:pt-32">
      <header className="flex flex-col items-center gap-6 text-center">
        <h1 className="display">{calibre.name}</h1>
        <p className="caps text-muted-foreground" dir="ltr">
          {calibre.reference}
        </p>
        <p className="max-w-xl leading-8 text-muted-foreground">{calibre.summary}</p>
      </header>

      <div
        role="status"
        className="relative isolate grid aspect-[16/9] place-items-center border-y hairline p-6 text-center max-sm:aspect-[4/5]"
      >
        <div aria-hidden className="absolute inset-0 -z-10 rim-light" />
        <div className="flex max-w-sm flex-col items-center gap-5">
          <p className="font-display text-3xl">مدل سه‌بعدی واقعی در راه است</p>
          <p className="leading-8 text-muted-foreground">
            این بخش فقط با مدل CAD یک موومنت واقعی ساخته می‌شود، نه با طرح خیالی. تا آن موقع،
            سازوکار و مشخصاتش را اینجا بخوانید.
          </p>
          <Button asChild variant="outline" size="lg" className="mt-2">
            <Link href={paths.labCalibre("automatic")}>دیدن موومنت اتوماتیک در سه‌بعدی</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-24">
        <CalibreHowItWorks calibre={calibre} />
        <aside className="flex flex-col gap-16">
          <CalibreSpecs calibre={calibre} />
          <CalibreUsedIn calibre={calibre} />
        </aside>
      </div>
    </div>
  );
}
