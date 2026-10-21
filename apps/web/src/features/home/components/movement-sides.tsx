"use client";

import type { MotionValue } from "motion/react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface View {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  body: string;
}

const VIEWS: readonly View[] = [
  {
    src: "/media/movement-photos/rotor-side.webp",
    alt: "موومنت اتوماتیک از سمت پشت، با روتور نیم‌دایره، پل‌ها و چرخ بالانس طلایی",
    eyebrow: "پشت موومنت",
    title: "آنچه از پشت قاب شیشه‌ای می‌بینید",
    body: "روتور با ابزار پرداخت شعاعی، پل‌های فولادی و چرخ بالانس طلایی که هشت بار در ثانیه از وسط عبور می‌کند.",
  },
  {
    src: "/media/movement-photos/dial-side.webp",
    alt: "همان موومنت از سمت صفحه، با حلقهٔ تاریخ ۱ تا ۳۱ و چرخ‌های زیر صفحه",
    eyebrow: "زیر صفحه",
    title: "طرفی که هیچ‌وقت دیده نمی‌شود",
    body: "زیر صفحهٔ ساعت، حلقهٔ تاریخ و چرخ‌های کوچکی که عقربه‌ها را می‌گردانند. هر نیمه‌شب، یک دندانه تاریخ را یک روز جلو می‌برد.",
  },
  {
    src: "/media/movement-photos/balance-detail.webp",
    alt: "نمای نزدیک چرخ بالانس، پل بالانس و یاقوت ضربه‌گیر",
    eyebrow: "از نزدیک",
    title: "جایی که زمان ساخته می‌شود",
    body: "چرخ بالانس زیر پلش، با یاقوتی که در ضربه‌گیر نشسته. اگر ساعت زمین بخورد، فنر این ضربه‌گیر محور ظریف بالانس را از شکستن نجات می‌دهد.",
  },
];

/** Scroll stretches where one photograph opens over the previous one. */
const REVEALS: readonly [number, number][] = [
  [0.28, 0.5],
  [0.62, 0.84],
];

/** On a phone the photo is shown whole and enlarged, since the movement only fills the middle of the frame. */
function Photo({ view, priority = false }: { view: View; priority?: boolean }) {
  return (
    <div className="absolute inset-0 max-lg:scale-[1.6]">
      <Image
        src={view.src}
        alt={view.alt}
        fill
        priority={priority}
        sizes="(max-width: 1023px) 160vw, 100vw"
        className="object-contain lg:object-cover"
      />
    </div>
  );
}

function Reveal({
  view,
  progress,
  range,
  kind,
}: {
  view: View;
  progress: MotionValue<number>;
  range: [number, number];
  kind: "wipe" | "iris";
}) {
  // The dial side slides in like a page turned from the right; the detail opens like a loupe on the balance
  const clipPath = useTransform(
    progress,
    range,
    kind === "wipe"
      ? ["inset(0 0 0 100%)", "inset(0 0 0 0%)"]
      : ["circle(0% at 50% 68%)", "circle(120% at 50% 68%)"],
  );
  const scale = useTransform(progress, range, [1.08, 1]);
  return (
    <motion.div className="absolute inset-0" style={{ clipPath }}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Photo view={view} />
      </motion.div>
    </motion.div>
  );
}

export function MovementSides() {
  const track = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const baseScale = useTransform(scrollYProgress, [0, REVEALS[0]![0]], [1, 1.04]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = REVEALS.filter(([start, end]) => progress >= (start + end) / 2).length;
    if (next !== active) setActive(next);
  });

  return (
    <section ref={track} aria-labelledby="sides-title" className="relative h-[380vh] bg-studio">
      <h2 id="sides-title" className="sr-only">
        موومنت از دو رو و از نزدیک
      </h2>
      <div className="sticky top-0 h-dvh overflow-hidden bg-studio text-studio-foreground">
        <div className="absolute inset-x-0 top-16 bottom-48 lg:inset-0">
          <motion.div className="absolute inset-0" style={{ scale: baseScale }}>
            <Photo view={VIEWS[0]!} priority />
          </motion.div>
          <Reveal view={VIEWS[1]!} progress={scrollYProgress} range={REVEALS[0]!} kind="wipe" />
          <Reveal view={VIEWS[2]!} progress={scrollYProgress} range={REVEALS[1]!} kind="iris" />
        </div>
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:top-28 lg:bottom-auto">
          <div className="relative max-w-md rounded-xl bg-studio/85 p-5 backdrop-blur-md lg:ms-auto">
            {VIEWS.map((view, index) => (
              <article
                key={view.src}
                aria-hidden={index !== active}
                className={cn(
                  "flex flex-col gap-3 transition-all duration-700 ease-out",
                  index === active
                    ? "translate-y-0 opacity-100"
                    : "absolute inset-x-0 bottom-0 translate-y-4 opacity-0",
                )}
              >
                <p className="text-sm font-medium opacity-60">
                  {(index + 1).toLocaleString("fa-IR")} / {VIEWS.length.toLocaleString("fa-IR")} ·{" "}
                  {view.eyebrow}
                </p>
                <p className="text-2xl leading-tight font-semibold text-balance sm:text-3xl">
                  {view.title}
                </p>
                <p className="leading-8 opacity-75">{view.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
