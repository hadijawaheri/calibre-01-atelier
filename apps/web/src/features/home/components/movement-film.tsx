"use client";

import { ArrowLeft } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";
import { cn } from "@/lib/utils";

const FRAME_COUNT = 240;
/** The last stretch of the scroll holds the final frame, so the closing words are read on a still movement. */
const FILM_END = 0.9;
const frameUrl = (size: "lg" | "sm", index: number) =>
  `/media/movement-film/${size}/${String(index + 1).padStart(3, "0")}.webp`;

interface Chapter {
  eyebrow: string;
  title: string;
  body: string;
  /** Scroll progress at which the next chapter takes over. */
  until: number;
}

/* Timed to the film: assembled on the white table, coming apart, floating in the dark, reassembled. */
const CHAPTERS: readonly Chapter[] = [
  {
    eyebrow: "موومنت اتوماتیک سوئیسی",
    title: "قلبی که بی‌وقفه می‌تپد",
    body: "هشت ضربه در هر ثانیه، بدون باتری. فقط یک فنر، چند ده چرخ‌دنده و یاقوت. اسکرول کنید تا جلوی چشمتان باز شود.",
    until: 0.15,
  },
  {
    eyebrow: "۱ · روتور و پل‌ها",
    title: "انرژی از مچ دست شما",
    body: "وزنهٔ نیم‌دایره با هر حرکت دست می‌چرخد و فنر اصلی را آرام‌آرام کوک می‌کند. زیر آن، پل‌های فولادی محور چرخ‌ها را در یاقوت نگه می‌دارند.",
    until: 0.33,
  },
  {
    eyebrow: "۲ · قطعه‌به‌قطعه",
    title: "از فنر تا بالانس",
    body: "چرخ‌دنده‌های طلایی حرکت کند فنر را قدم‌به‌قدم سریع می‌کنند تا به چرخ اسکیپمنت برسد. لنگر هر ثانیه هشت بار آن را رها می‌کند و چرخ بالانس، ریتم زمان را می‌سازد.",
    until: 0.52,
  },
  {
    eyebrow: "۳ · مونتاژ",
    title: "کار دست ساعت‌ساز",
    body: "هر قطعه با پنس و ذره‌بین سر جایش می‌نشیند؛ بعضی پیچ‌ها از دانهٔ برنج کوچک‌ترند. یک ذره گرد و غبار کافی است تا ساعت بایستد.",
    until: 0.74,
  },
  {
    eyebrow: "آزمایشگاه موومنت",
    title: "حالا خودتان بازش کنید",
    body: "قطعه‌ها را جدا کنید، رویشان کلیک کنید، زمان را کند کنید و ببینید انرژی از فنر تا بالانس چطور جریان دارد.",
    until: 1.01,
  },
];

/** Loads the frames coarse to fine, so scrubbing works long before the last frame has arrived. */
function loadOrder() {
  const order: number[] = [];
  const seen = new Set<number>();
  for (const step of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < FRAME_COUNT; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

export function MovementFilm() {
  const track = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | undefined)[]>([]);
  const wanted = useRef(0);
  const drawn = useRef(-1);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext("2d");
    if (!context) return;
    let raf = 0;

    const nearestLoaded = (index: number) => {
      for (let d = 0; d < FRAME_COUNT; d++) {
        const before = frames.current[index - d];
        if (before) return { image: before, index: index - d };
        const after = frames.current[index + d];
        if (after) return { image: after, index: index + d };
      }
      return null;
    };

    const draw = () => {
      raf = 0;
      const found = nearestLoaded(wanted.current);
      if (!found) return;
      const { width, height } = element;
      const { image } = found;
      // Cover: fill the stage and crop the overflow, like object-fit for a video
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const w = image.naturalWidth * scale;
      const h = image.naturalHeight * scale;
      context.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
      drawn.current = found.index;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(element.clientWidth * ratio);
      element.height = Math.round(element.clientHeight * ratio);
      drawn.current = -1;
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);

    // Small stages get the lighter frames; "cover" can make the film wider than the stage itself
    const coverWidth = Math.max(element.clientWidth, (element.clientHeight * 16) / 9);
    const size = coverWidth * Math.min(window.devicePixelRatio || 1, 2) > 900 ? "lg" : "sm";
    let cancelled = false;
    const queue = loadOrder();
    const next = () => {
      const index = queue.shift();
      if (index === undefined || cancelled) return;
      const image = new window.Image();
      image.decoding = "async";
      image.src = frameUrl(size, index);
      image
        .decode()
        .then(() => {
          if (cancelled) return;
          frames.current[index] = image;
          if (index === 0) setReady(true);
          if (drawn.current !== wanted.current) schedule();
        })
        .catch(() => {})
        .finally(next);
    };
    // A few requests in flight keep the network busy without starving the rest of the page
    for (let i = 0; i < 4; i++) next();

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      wanted.current = Math.round(Math.min(1, progress / FILM_END) * (FRAME_COUNT - 1));
      if (wanted.current !== drawn.current) schedule();
    });

    return () => {
      cancelled = true;
      unsubscribe();
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const index = CHAPTERS.findIndex((chapter) => progress < chapter.until);
    const chapterIndex = index === -1 ? CHAPTERS.length - 1 : index;
    if (chapterIndex !== active) setActive(chapterIndex);
  });

  return (
    <section ref={track} aria-label="داستان یک موومنت" className="relative h-[520vh]">
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden lg:block">
        <div className="relative mt-16 h-[46dvh] w-full shrink-0 lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
          {/* The first frame paints with the page; the canvas takes over once the film starts loading */}
          <Image
            src={frameUrl("lg", 0)}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className={cn("object-cover transition-opacity duration-500", ready && "opacity-0")}
          />
          <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background to-transparent lg:hidden" />
        </div>
        <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_left,var(--color-background)_0%,color-mix(in_oklab,var(--color-background)_70%,transparent)_30%,transparent_55%)] lg:block" />
        <div className="pointer-events-none relative mx-auto flex w-full max-w-7xl flex-1 items-start px-4 pt-6 sm:px-6 lg:absolute lg:inset-0 lg:items-center lg:pt-0">
          <div className="relative w-full max-w-md lg:max-w-sm">
            {CHAPTERS.map((chapter, index) => (
              <article
                key={chapter.title}
                aria-hidden={index !== active}
                className={cn(
                  "flex flex-col gap-4 transition-all duration-700 ease-out",
                  index === active
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none absolute inset-x-0 top-0 translate-y-6 opacity-0",
                )}
              >
                <p className="eyebrow">{chapter.eyebrow}</p>
                {index === 0 ? (
                  <h1 className="text-3xl leading-tight font-semibold text-balance sm:text-5xl">
                    {chapter.title}
                  </h1>
                ) : (
                  <h2 className="text-2xl leading-tight font-semibold text-balance sm:text-4xl">
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
          className="absolute end-4 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:end-6 lg:flex"
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
