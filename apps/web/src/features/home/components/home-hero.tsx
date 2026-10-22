import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

export function HomeHero() {
  return (
    <section
      data-stage="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex h-dvh min-h-[40rem] flex-col items-center justify-between overflow-hidden px-4 pt-28 pb-10 text-center sm:px-8 sm:pt-32"
    >
      <div aria-hidden className="absolute inset-0 -z-10 rim-light" />

      <div className="flex flex-col items-center gap-5">
        <h1 id="hero-title" className="max-w-[16ch] display">
          موومنت واقعی، در حال کار
        </h1>
        <p className="max-w-sm text-base leading-8 text-muted-foreground">
          دانشنامهٔ فارسی ساعت. یک موومنت اتوماتیک سوئیسی را با اسکرول باز کنید.
        </p>
      </div>

      {/* Shown until the travelling movement takes its place, and for visitors who prefer less motion */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center [[data-flight=on]_&]:opacity-0">
        <div className="relative aspect-[1500/635] w-[min(70vw,60rem)] translate-y-[6vh] max-lg:w-[108vw] max-lg:translate-x-[10vw]">
          <Image
            src="/media/movement-cutout/caseback.webp"
            alt="موومنت اتوماتیک سوئیسی از سمت پشت، با روتور نیم‌دایره و چرخ بالانس طلایی"
            fill
            priority
            sizes="(max-width: 1023px) 108vw, 60rem"
            className="object-contain drop-shadow-(--object-shadow-hero)"
          />
        </div>
      </div>

      <div className="grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-end gap-4">
        <p className="justify-self-start caps text-muted-foreground max-sm:invisible" dir="ltr">
          Swiss automatic
        </p>
        <Button asChild size="lg">
          <Link href={paths.labCalibre("automatic")} data-cursor="ورود">
            ورود به آزمایشگاه
          </Link>
        </Button>
        <p className="justify-self-end caps text-muted-foreground max-sm:invisible" dir="ltr">
          28,800 vph
        </p>
      </div>
    </section>
  );
}
