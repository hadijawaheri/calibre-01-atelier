import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CALIBRES } from "@/features/movement";
import { paths } from "@/lib/paths";

import { CalibreDossier } from "./calibre-dossier";

/* The atlas opens on its data, not a picture: the title and the way in on one side, a working dossier of
   the four families on the other. */
export function HomeHero() {
  return (
    <section
      data-stage="hero"
      aria-labelledby="hero-title"
      className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-16 lg:py-20"
    >
      <div className="flex flex-col gap-6">
        <h1 id="hero-title" className="max-w-[14ch] display lg:text-[4.25rem]">
          موومنت واقعی، در حال کار
        </h1>
        <p className="max-w-lg text-lg leading-9 text-muted-foreground">
          دانشنامهٔ فارسی ساعت. یک موومنت اتوماتیک سوئیسی را با اسکرول باز کنید، چهار خانوادهٔ
          موومنت را کنار هم بگذارید و در آزمایشگاه، قطعه‌به‌قطعه جدایش کنید.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={paths.labCalibre("automatic")}>ورود به آزمایشگاه</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#families">مقایسهٔ چهار خانواده</Link>
          </Button>
        </div>
        <dl className="mt-4 grid max-w-lg grid-cols-3 border-t border-border pt-5">
          {[
            { label: "ضربه در ساعت", value: "28,800" },
            { label: "ذخیرهٔ انرژی", value: "38 h" },
            { label: "یاقوت", value: "25" },
          ].map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1">
              <dt className="label">{fact.label}</dt>
              <dd className="font-mono text-sm" dir="ltr">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <CalibreDossier calibres={CALIBRES} />
    </section>
  );
}
