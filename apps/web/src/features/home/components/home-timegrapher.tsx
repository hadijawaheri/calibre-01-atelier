"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const WIDTH = 600;
const HEIGHT = 240;
/** Seconds per day shown from the top of the chart to the bottom. */
const SPAN = 20;
const RATE = 3;
const BEAT_ERROR = 0.4;

/* A timegrapher listens to the tick and the tock and plots each against a perfect clock: a level line
   is a perfect watch, a rising one gains. Two lines a little apart show the beat error. */
function trace(offset: number) {
  const y = (secondsPerDay: number) => HEIGHT / 2 - (secondsPerDay / SPAN) * HEIGHT;
  const points: string[] = [];
  for (let x = 0; x <= WIDTH; x += 6) {
    const wobble = Math.sin(x * 0.21) * 0.35 + Math.sin(x * 0.047) * 0.5;
    points.push(`${x},${y((RATE * x) / WIDTH + wobble + offset).toFixed(1)}`);
  }
  return points.join(" ");
}

const TICK = trace(BEAT_ERROR);
const TOCK = trace(-BEAT_ERROR);
const COSC_TOP = HEIGHT / 2 - (6 / SPAN) * HEIGHT;
const COSC_HEIGHT = (10 / SPAN) * HEIGHT;

const READINGS = [
  { label: "Rate", value: "+3 s/d", note: "روزی سه ثانیه جلو" },
  { label: "Amplitude", value: "287°", note: "دامنهٔ نوسان بالانس" },
  { label: "Beat error", value: "0.2 ms", note: "فاصلهٔ تیک و تاک" },
  { label: "Beat", value: "28,800", note: "ضربه در ساعت" },
] as const;

export function HomeTimegrapher() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "center 45%"] });
  const reveal = useTransform(scrollYProgress, [0, 1], [0, WIDTH]);

  return (
    <section
      ref={ref}
      data-stage="timegrapher"
      aria-labelledby="timegrapher-title"
      className="mx-auto grid max-w-7xl items-start gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16 lg:py-28"
    >
      <div className="flex flex-col gap-5">
        <h2 id="timegrapher-title" className="display">
          دقتی که آزمایش می‌شود
        </h2>
        <p className="leading-8 text-muted-foreground">
          عنوان کرونومتر را مؤسسهٔ COSC می‌دهد: پانزده روز آزمایش در پنج وضعیت و سه دما. میانگین
          خطای روزانه باید درون نوار روشن بماند، بین ۴ ثانیه عقب و ۶ ثانیه جلو.
        </p>
      </div>

      <figure className="flex flex-col plate">
        <div className="flex items-baseline justify-between gap-4 border-b border-border px-5 py-3">
          <span className="text-sm">تایم‌گرافر</span>
          <span className="caps text-muted-foreground" dir="ltr">
            Timegrapher · s/d
          </span>
        </div>
        <div className="px-5 py-6">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label="نمودار دستگاه تایم‌گرافر: دو خط تیک و تاک با شیب ملایم رو به بالا، درون نوار مجاز COSC"
          >
            <defs>
              <clipPath id="timegrapher-reveal">
                <motion.rect x={0} y={0} height={HEIGHT} style={{ width: reveal }} />
              </clipPath>
            </defs>
            <rect x={0} y={COSC_TOP} width={WIDTH} height={COSC_HEIGHT} className="fill-metal/12" />
            {[-10, -5, 0, 5, 10].map((s) => {
              const y = HEIGHT / 2 - (s / SPAN) * HEIGHT;
              return (
                <line
                  key={s}
                  x1={0}
                  x2={WIDTH}
                  y1={y}
                  y2={y}
                  className="stroke-border"
                  strokeWidth={s === 0 ? 1.5 : 1}
                />
              );
            })}
            <g
              clipPath="url(#timegrapher-reveal)"
              className="stroke-foreground"
              fill="none"
              strokeLinecap="round"
            >
              <polyline points={TICK} strokeWidth={3} strokeDasharray="0.1 6" />
              <polyline
                points={TOCK}
                strokeWidth={3}
                strokeDasharray="0.1 6"
                className="stroke-metal"
              />
            </g>
          </svg>
        </div>
        <dl className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-4">
          {READINGS.map((reading) => (
            <div key={reading.label} className="flex flex-col gap-1.5 bg-card p-4">
              <dt className="caps text-muted-foreground" dir="ltr">
                {reading.label}
              </dt>
              <dd className="text-start font-mono text-base tabular-nums" dir="ltr">
                {reading.value}
              </dd>
              <dd className="text-xs text-muted-foreground">{reading.note}</dd>
            </div>
          ))}
        </dl>
        <figcaption className="border-t border-border px-5 py-3 text-xs leading-6 text-muted-foreground">
          نمودار و عددها نمونهٔ نمایشی‌اند تا شکل یک آزمایش را نشان دهند، نه اندازه‌گیری همین
          موومنت.
        </figcaption>
      </figure>
    </section>
  );
}
