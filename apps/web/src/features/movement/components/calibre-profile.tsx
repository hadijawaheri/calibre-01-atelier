import { Box } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/atlas";
import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

import type { CalibreInfo } from "../calibres";
import { CalibreHowItWorks, CalibreSpecs, CalibreUsedIn } from "./calibre-facts";

/** A calibre whose real 3D model is not ready yet: the dossier now, the model when its CAD file arrives. */
export function CalibreProfile({ calibre }: { calibre: CalibreInfo }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-14 sm:px-6 lg:py-20">
      <nav aria-label="مسیر" className="text-sm text-muted-foreground">
        <Link href={paths.lab} className="hover:text-foreground">
          آزمایشگاه موومنت
        </Link>
        <span aria-hidden className="mx-2">
          /
        </span>
        <span aria-current="page" className="text-foreground">
          {calibre.name}
        </span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
        <div className="flex flex-col gap-12">
          <PageHeader title={calibre.name} reference={calibre.reference} intro={calibre.summary} />
          <div
            role="status"
            className="flex flex-col items-start gap-4 p-6 plate sm:flex-row sm:items-center sm:p-8"
          >
            <Box aria-hidden className="size-6 shrink-0 text-metal" strokeWidth={1.25} />
            <div className="flex flex-1 flex-col gap-2">
              <p className="font-display text-2xl">مدل سه‌بعدی واقعی در راه است</p>
              <p className="text-sm leading-7 text-muted-foreground">
                این بخش فقط با مدل CAD یک موومنت واقعی ساخته می‌شود، نه با طرح خیالی. تا آن موقع،
                سازوکار و مشخصاتش را اینجا بخوانید.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href={paths.labCalibre("automatic")}>دیدن موومنت اتوماتیک در سه‌بعدی</Link>
            </Button>
          </div>
          <CalibreHowItWorks calibre={calibre} />
        </div>
        <aside className="flex flex-col gap-10">
          <CalibreSpecs calibre={calibre} columns={1} />
          <CalibreUsedIn calibre={calibre} />
        </aside>
      </div>
    </div>
  );
}
