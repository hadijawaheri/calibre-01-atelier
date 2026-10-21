import { ArrowDown } from "lucide-react";
import Image from "next/image";

export function HomeHero() {
  return (
    <section
      data-stage="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex h-dvh min-h-[36rem] flex-col justify-between overflow-hidden px-4 pt-20 pb-8 sm:px-6"
    >
      <div aria-hidden className="absolute inset-0 -z-10 warm-glow" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
        <p className="font-mono text-[11px] text-muted-foreground uppercase" dir="ltr">
          Made for wrists · Built for generations
        </p>
        <h1
          id="hero-title"
          className="font-display text-[22vw] leading-[0.8] text-foreground lg:text-[13vw]"
        >
          <span aria-hidden dir="ltr" className="block text-start">
            KRONOS
          </span>
          <span className="sr-only">کرونوس، دانشنامهٔ فارسی ساعت</span>
        </h1>
      </div>

      {/* Shown until the travelling movement takes its place, and for visitors who prefer less motion */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center [[data-flight=on]_&]:opacity-0">
        <div className="relative aspect-[1500/635] w-[min(70vw,60rem)] translate-y-[8vh] max-lg:w-[108vw] max-lg:translate-x-[10vw]">
          <Image
            src="/media/movement-cutout/caseback.webp"
            alt="موومنت اتوماتیک سوئیسی از سمت پشت، با روتور نیم‌دایره و چرخ بالانس طلایی"
            fill
            priority
            sizes="(max-width: 1023px) 108vw, 60rem"
            className="object-contain drop-shadow-[0_50px_70px_oklch(0_0_0/0.65)]"
          />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-end gap-6 lg:grid-cols-3">
        <div className="flex max-w-xs flex-col gap-2 rounded-lg border border-border bg-background/40 p-4 backdrop-blur-md">
          <p className="text-sm font-semibold">دانشنامهٔ فارسی ساعت</p>
          <p className="text-xs leading-6 text-muted-foreground">
            موومنت‌ها، کالیبرها و داستان برندها؛ قطعه‌به‌قطعه.
          </p>
        </div>
        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground max-lg:hidden">
          <ArrowDown className="size-4 motion-safe:animate-bounce" aria-hidden />
          اسکرول کنید
        </p>
        <p className="max-w-sm text-sm leading-7 text-muted-foreground lg:justify-self-end">
          ساخته شده تا بی‌وقفه بتپد، نسل‌به‌نسل بماند و هر بار که نگاهش می‌کنید چیز تازه‌ای نشان
          دهد. کرونوس این ماشین کوچک را جلوی چشم شما باز می‌کند.
        </p>
      </div>
    </section>
  );
}
