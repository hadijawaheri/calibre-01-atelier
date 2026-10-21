import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MovementShowcase, REFERENCE_CALIBRE } from "@/features/movement";
import { formatNumber } from "@/lib/format";
import { paths } from "@/lib/paths";

const TRUST = ["ضمانت پنج‌ساله", "ارسال بیمه‌شده و رایگان", "گواهی اصالت امضاشده"];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:pt-16">
        <div className="flex flex-col gap-6 lg:pb-24">
          <p className="eyebrow">
            کالیبر{" "}
            <span dir="ltr" className="font-mono">
              KR-P36
            </span>{" "}
            · الهام‌گرفته از {REFERENCE_CALIBRE.name}
          </p>
          <h1 className="font-display text-5xl leading-[1.15] text-balance md:text-6xl xl:text-7xl">
            قلبی که <span className="text-gold-gradient">ده بار در ثانیه</span> می‌تپد
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            درِ پشت را باز کنید و لایه‌به‌لایه ببینید:{" "}
            {formatNumber(REFERENCE_CALIBRE.frequencyVph)} ضربان در ساعت،{" "}
            {formatNumber(REFERENCE_CALIBRE.jewels)} یاقوت و کرونوگرافی که تا یک‌دهم ثانیه را
            می‌شمارد. هر ساعت آتلیه را یک ساعت‌ساز از اول تا آخر می‌سازد.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 rounded-none px-8">
              <Link href={paths.watches}>
                دیدن کلکسیون
                <ArrowRight data-icon="inline-end" className="rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-none border-gold/40 px-8"
            >
              <Link href={paths.watch("primo-36000-chronograph")}>پریمو ۳۶۰۰۰</Link>
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-gold" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <MovementShowcase />
      </div>
    </section>
  );
}
