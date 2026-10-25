"use client";

import type { MotionValue } from "motion/react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

interface Plate {
  src: string;
  alt: string;
  caption: string;
}

const PLATES: readonly Plate[] = [
  {
    src: "/media/movement-film/lg/060.webp",
    alt: "روتور و پل‌ها از روی موومنت بلند می‌شوند و چرخ‌ها پیدا می‌شوند",
    caption: "روتور کنار می‌رود",
  },
  {
    src: "/media/movement-photos/rotor-side.webp",
    alt: "موومنت اتوماتیک از سمت پشت، با روتور نیم‌دایره و چرخ بالانس طلایی",
    caption: "از پشت قاب شیشه‌ای",
  },
  {
    src: "/media/movement-film/lg/100.webp",
    alt: "همهٔ قطعه‌های موومنت، جدا از هم، روی زمینهٔ تیره معلق‌اند",
    caption: "بیش از صد قطعه",
  },
  {
    src: "/media/movement-photos/balance-detail.webp",
    alt: "نمای نزدیک چرخ بالانس، پل بالانس و یاقوت ضربه‌گیر",
    caption: "قلب، از نزدیک",
  },
  {
    src: "/media/movement-photos/dial-side.webp",
    alt: "موومنت از سمت صفحه، با حلقهٔ تاریخ ۱ تا ۳۱",
    caption: "زیر صفحه",
  },
  {
    src: "/media/movement-film/lg/180.webp",
    alt: "قطعه‌ها دوباره سر جایشان می‌نشینند و پیچ‌ها بسته می‌شوند",
    caption: "دوباره، یک ماشین",
  },
];

const STEP = 1 / (PLATES.length - 1);

/** The plate nearest the middle of the screen comes forward; its neighbours wait a little smaller and dimmer. */
function PlateCard({
  plate,
  index,
  progress,
}: {
  plate: Plate;
  index: number;
  progress: MotionValue<number>;
}) {
  const centre = index * STEP;
  // Scroll-linked animations run on the compositor, whose keyframe offsets must stay within 0..1
  const range = [Math.max(0, centre - STEP), centre, Math.min(1, centre + STEP)];
  const scale = useTransform(progress, range, [0.9, 1, 0.9]);
  const opacity = useTransform(progress, range, [0.55, 1, 0.55]);
  return (
    <motion.figure style={{ scale }} className="flex w-(--card) shrink-0 flex-col plate">
      {/* Only the photograph dims; the caption stays legible */}
      <motion.div
        style={{ opacity }}
        className="relative aspect-[4/5] overflow-hidden bg-secondary"
      >
        <Image
          src={plate.src}
          alt={plate.alt}
          fill
          sizes="(max-width: 639px) 155vw, (max-width: 1023px) 100vw, 55vw"
          className="object-cover"
        />
      </motion.div>
      <figcaption className="flex items-baseline justify-between gap-3 border-t border-border px-4 py-3 text-sm">
        <span>{plate.caption}</span>
        <span
          className="shrink-0 caps whitespace-nowrap text-muted-foreground tabular-nums"
          dir="ltr"
        >
          Pl. {String(index + 1).padStart(2, "0")}
        </span>
      </figcaption>
    </motion.figure>
  );
}

/**
 * The plates of the atlas: the same movement, taken apart and photographed, sliding past as the page scrolls.
 */
export function HomeGallery() {
  const track = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  // RTL: the strip starts at the right edge, so later plates arrive from the left by moving it right
  const x = useTransform(scrollYProgress, (p) => `calc(${p} * var(--travel))`);

  return (
    <section
      ref={track}
      data-stage="gallery"
      style={{ ["--steps" as string]: PLATES.length - 1 }}
      aria-labelledby="gallery-title"
      className="relative h-[400vh] bg-secondary/50 [--card:68vw] [--gap:5vw] [--travel:calc((var(--card)+var(--gap))*var(--steps))] sm:[--card:44vw] lg:[--card:24vw] lg:[--gap:2.5vw]"
    >
      <div className="sticky top-(--header-height) flex h-[calc(100dvh-var(--header-height))] flex-col justify-center gap-8 overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 border-b border-border px-4 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <h2 id="gallery-title" className="title">
            قطعه‌به‌قطعه
          </h2>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            همان موومنتی که بالا دیدید، باز شده و از نزدیک عکاسی شده.
          </p>
        </div>
        <motion.ul
          style={{ x }}
          className="relative flex gap-(--gap) px-[calc(50vw-var(--card)/2)]"
        >
          {PLATES.map((plate, index) => (
            <li key={plate.src}>
              <PlateCard plate={plate} index={index} progress={scrollYProgress} />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
