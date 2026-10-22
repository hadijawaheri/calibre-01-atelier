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

/** The plate nearest the middle of the screen grows and sharpens; its neighbours wait smaller and dimmer. */
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
  const scale = useTransform(progress, range, [0.78, 1, 0.78]);
  const opacity = useTransform(progress, range, [0.5, 1, 0.5]);
  // Depth of field: the plate in focus is sharp, the ones waiting either side sit behind the lens's plane
  const filter = useTransform(progress, range, ["blur(6px)", "blur(0px)", "blur(6px)"]);
  return (
    <motion.figure
      style={{ scale, opacity, filter }}
      className="flex w-(--card) shrink-0 flex-col gap-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Image
          src={plate.src}
          alt={plate.alt}
          fill
          sizes="(max-width: 1023px) 70vw, 30vw"
          className="object-cover"
        />
      </div>
      <figcaption className="flex items-baseline justify-between gap-3 border-t hairline pt-3">
        <span>{plate.caption}</span>
        <span className="caps text-muted-foreground tabular-nums" dir="ltr">
          {String(index + 1).padStart(2, "0")} / {String(PLATES.length).padStart(2, "0")}
        </span>
      </figcaption>
    </motion.figure>
  );
}

/**
 * A horizontal strip of the same movement, taken apart and photographed, that slides past as the page
 * scrolls down, like the editorial strip on oryzo.
 */
export function HomeGallery() {
  const track = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  // RTL: the strip starts at the right edge, so later plates arrive from the left by moving it right
  const x = useTransform(scrollYProgress, (p) => `calc(${p} * var(--travel))`);
  const words = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section
      ref={track}
      data-stage="gallery"
      style={{ ["--steps" as string]: PLATES.length - 1 }}
      aria-labelledby="gallery-title"
      className="relative h-[420vh] [--card:70vw] [--gap:6vw] [--travel:calc((var(--card)+var(--gap))*var(--steps))] lg:[--card:28vw] lg:[--gap:4vw]"
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-center gap-10 overflow-hidden">
        <motion.p
          aria-hidden
          style={{ x: words }}
          dir="ltr"
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-[16vw] leading-none tracking-[0.2em] whitespace-nowrap text-foreground/[0.04] uppercase"
        >
          Piece by piece
        </motion.p>
        <div className="relative mx-auto flex w-full max-w-7xl items-end justify-between gap-6 px-4 sm:px-8">
          <h2 id="gallery-title" className="display">
            قطعه‌به‌قطعه
          </h2>
          <p className="max-w-xs text-base leading-8 text-muted-foreground max-sm:hidden">
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
