import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

import type { CalibreInfo } from "../calibres";
import { CalibreHowItWorks, CalibreSpecs, CalibreUsedIn } from "./calibre-facts";

/** A calibre whose real 3D model is not ready yet: the facts now, the model when its CAD file arrives. */
export function CalibreProfile({ calibre }: { calibre: CalibreInfo }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-16 pb-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:pt-24">
      <div className="flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="eyebrow">آزمایشگاه موومنت</p>
          <h1 className="text-4xl leading-tight font-semibold sm:text-5xl">{calibre.name}</h1>
          <p className="font-mono text-sm text-muted-foreground" dir="ltr">
            {calibre.reference}
          </p>
          <p className="max-w-2xl leading-8 text-muted-foreground">{calibre.summary}</p>
        </header>
        <div
          role="status"
          className="grid aspect-[16/9] place-items-center rounded-xl border border-dashed border-border bg-[radial-gradient(circle_at_50%_40%,var(--color-muted),transparent_70%)] p-6 text-center"
        >
          <div className="flex max-w-sm flex-col items-center gap-3">
            <p className="font-semibold">مدل سه‌بعدی واقعی در راه است</p>
            <p className="text-sm leading-7 text-muted-foreground">
              این بخش فقط با مدل CAD یک موومنت واقعی ساخته می‌شود، نه با طرح خیالی. تا آن موقع،
              سازوکار و مشخصاتش را اینجا بخوانید.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href={paths.labCalibre("automatic")}>
                دیدن موومنت اتوماتیک در سه‌بعدی
                <ArrowLeft data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>
        <CalibreHowItWorks calibre={calibre} />
      </div>
      <aside className="flex flex-col gap-8 lg:pt-4">
        <CalibreSpecs calibre={calibre} />
        <CalibreUsedIn calibre={calibre} />
      </aside>
    </div>
  );
}
