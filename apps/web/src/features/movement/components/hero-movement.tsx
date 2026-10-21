"use client";

import { ArrowLeft } from "lucide-react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";
import { cn } from "@/lib/utils";

import type { MovementControls } from "../three/controls";
import { createControls } from "../three/controls";
import { MovementCanvas } from "./movement-canvas";

type View = NonNullable<MovementControls["view"]>;

interface Chapter {
  eyebrow: string;
  title: string;
  body: string;
  until: number;
  explode: number;
  lift: number;
  timeScale: number;
  view: View;
}

/* Each chapter of the scroll story: what is said, and how the movement is posed while it is said. */
const CHAPTERS: readonly Chapter[] = [
  {
    eyebrow: "موومنت اتوماتیک سوئیسی",
    title: "قلبی که بی‌وقفه می‌تپد",
    body: "هشت ضربه در هر ثانیه، بدون باتری. فقط یک فنر، چند ده چرخ‌دنده و یاقوت. اسکرول کنید تا جلوی چشمتان باز شود.",
    until: 0.16,
    explode: 0,
    lift: 0,
    timeScale: 1,
    view: { position: [16, -30, 30], target: [0, 0, 2] },
  },
  {
    eyebrow: "۱ · روتور",
    title: "انرژی از مچ دست شما",
    body: "این وزنهٔ نیم‌دایره با هر حرکت دست می‌چرخد و فنر اصلی را آرام‌آرام کوک می‌کند. ساعت را که از دست باز کنید، تا یک روز و نیم بعد هم کار می‌کند.",
    until: 0.34,
    explode: 0,
    lift: 0.45,
    timeScale: 1,
    view: { position: [-8, -32, 26], target: [0, 0, 5] },
  },
  {
    eyebrow: "۲ · پل‌ها و یاقوت‌ها",
    title: "زیبایی‌ای که فقط صاحب ساعت می‌بیند",
    body: "نوارهای براق کوت دو ژنو روی پل‌ها با دست ساخته می‌شوند. هر نقطهٔ قرمز یک یاقوت است که محور فولادی یک چرخ داخلش می‌چرخد، تا سال‌ها بدون سایش کار کند.",
    until: 0.52,
    explode: 0,
    lift: 1,
    timeScale: 1,
    view: { position: [26, -24, 24], target: [0, 0, 6] },
  },
  {
    eyebrow: "۳ · قطار چرخ‌دنده",
    title: "از یک دور در ساعت تا شانزده دور در دقیقه",
    body: "فنر اصلی هر هفت ساعت یک دور می‌زند. چرخ‌دنده‌ها این حرکت کند و پرقدرت را قدم‌به‌قدم سریع و ظریف می‌کنند: چرخ مرکزی ساعتی یک دور، چرخ ثانیه دقیقه‌ای یک دور.",
    until: 0.72,
    explode: 1,
    lift: 0.3,
    timeScale: 1,
    view: { position: [40, -34, 14], target: [0, 0, 9] },
  },
  {
    eyebrow: "۴ · اسکیپمنت",
    title: "تیک‌تاک، با سرعت یک‌چهارم",
    body: "لنگر چرخ اسکیپمنت را قفل می‌کند و در هر ضربه فقط نیم دندانه رها می‌کند. همزمان ضربهٔ کوچکی به بالانس می‌زند تا نوسانش متوقف نشود. اینجا زمان ساخته می‌شود.",
    until: 0.9,
    explode: 0,
    lift: 1,
    timeScale: 0.25,
    view: { position: [13, -9, 15], target: [6, -0.5, 2.5] },
  },
  {
    eyebrow: "آزمایشگاه موومنت",
    title: "حالا خودتان بازش کنید",
    body: "هر قطعه را بچرخانید، رویش کلیک کنید، زمان را کند کنید و ببینید انرژی از فنر تا بالانس چطور جریان دارد.",
    until: 1.01,
    explode: 0,
    lift: 0,
    timeScale: 1,
    view: { position: [0, -22, 36], target: [0, 0, 2] },
  },
];

const STILL: View = { position: [10, -26, 32], target: [0, 0, 2] };

export function HeroMovement() {
  const reduceMotion = useReducedMotion();
  const controls = useRef<MovementControls>(createControls({ view: CHAPTERS[0]!.view }));
  const track = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const index = CHAPTERS.findIndex((chapter) => progress < chapter.until);
    const chapterIndex = index === -1 ? CHAPTERS.length - 1 : index;
    const chapter = CHAPTERS[chapterIndex]!;
    const c = controls.current;
    c.explode = chapter.explode;
    c.lift = chapter.lift;
    c.timeScale = reduceMotion ? Math.min(chapter.timeScale, 0.25) : chapter.timeScale;
    c.view = reduceMotion ? STILL : chapter.view;
    if (chapterIndex !== active) setActive(chapterIndex);
  });

  return (
    <section ref={track} aria-label="داستان یک موومنت" className="relative h-[620vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <MovementCanvas controls={controls} backdrop="night" className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--color-background)_0%,transparent_45%)] lg:bg-[linear-gradient(to_left,var(--color-background)_0%,transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex max-w-7xl items-end px-4 pb-14 sm:px-6 lg:inset-y-0 lg:items-center lg:pb-0">
          <div className="relative w-full max-w-md lg:max-w-sm">
            {CHAPTERS.map((chapter, index) => (
              <article
                key={chapter.title}
                aria-hidden={index !== active}
                className={cn(
                  "flex flex-col gap-4 transition-all duration-700 ease-out",
                  index === active
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none absolute inset-x-0 bottom-0 translate-y-6 opacity-0",
                )}
              >
                <p className="eyebrow">{chapter.eyebrow}</p>
                {index === 0 ? (
                  <h1 className="text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                    {chapter.title}
                  </h1>
                ) : (
                  <h2 className="text-3xl leading-tight font-semibold text-balance sm:text-4xl">
                    {chapter.title}
                  </h2>
                )}
                <p className="leading-8 text-muted-foreground">{chapter.body}</p>
                {index === CHAPTERS.length - 1 && (
                  <Button
                    asChild
                    size="lg"
                    className="self-start"
                    tabIndex={index === active ? 0 : -1}
                  >
                    <Link href={paths.labCalibre("automatic")}>
                      ورود به آزمایشگاه
                      <ArrowLeft data-icon="inline-end" />
                    </Link>
                  </Button>
                )}
              </article>
            ))}
          </div>
        </div>
        <ol
          aria-hidden
          className="absolute end-4 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:end-6 sm:flex"
        >
          {CHAPTERS.map((chapter, index) => (
            <li
              key={chapter.title}
              className={cn(
                "h-8 w-px transition-colors duration-500",
                index === active ? "bg-gold" : "bg-border",
              )}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
