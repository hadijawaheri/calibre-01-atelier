"use client";

import type { MotionValue } from "motion/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import {
  ARBOR,
  BALANCE_RADIUS,
  ESCAPE_RADIUS,
  MOVEMENT_RADIUS,
  pitchRadius,
  WHEEL,
} from "@/features/movement";

interface Circle {
  key: string;
  cx: number;
  cy: number;
  r: number;
}

const at = (name: keyof typeof ARBOR) => ({ cx: ARBOR[name][0], cy: -ARBOR[name][1] });

/* The real plan of the lab's calibre: every wheel at its arbor, drawn at its pitch radius, so the drawing
   is the same machine the 3D lab assembles. */
const WHEELS: readonly Circle[] = [
  { key: "barrel", ...at("barrel"), r: pitchRadius(WHEEL.barrel.module, WHEEL.barrel.teeth) },
  { key: "centre", ...at("centre"), r: pitchRadius(WHEEL.centre.module, WHEEL.centre.teeth) },
  { key: "third", ...at("third"), r: pitchRadius(WHEEL.third.module, WHEEL.third.teeth) },
  { key: "fourth", ...at("fourth"), r: pitchRadius(WHEEL.fourth.module, WHEEL.fourth.teeth) },
  { key: "escape", ...at("escape"), r: ESCAPE_RADIUS },
  { key: "balance", ...at("balance"), r: BALANCE_RADIUS },
];

const PINIONS: readonly Circle[] = (["centre", "third", "fourth"] as const).map((key) => ({
  key,
  ...at(key),
  r: pitchRadius(WHEEL[key].pinionModule, WHEEL[key].pinion),
}));

const R = MOVEMENT_RADIUS;

function Drawn({
  circle,
  progress,
  index,
}: {
  circle: Circle;
  progress: MotionValue<number>;
  index: number;
}) {
  const start = 0.04 + index * 0.05;
  const pathLength = useTransform(progress, [start, start + 0.22], [0, 1]);
  return (
    <motion.circle
      cx={circle.cx}
      cy={circle.cy}
      r={circle.r}
      style={{ pathLength }}
      fill="none"
      vectorEffect="non-scaling-stroke"
    />
  );
}

/**
 * The gear train drawn as a technical plan while it scrolls into view; then the drawing falls away, the
 * outline of the movement shrinks, and it becomes the O of the wordmark.
 */
export function HomeBlueprint() {
  const track = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });

  const ring = useTransform(p, [0, 0.3], [0, 1]);
  const ringWidth = useTransform(p, [0.55, 0.85], [0.06, 2.3]);
  const detail = useTransform(p, [0.55, 0.72], [1, 0]);
  const scale = useTransform(p, [0.55, 0.85], [4.6, 1]);
  const letters = useTransform(p, [0.72, 0.92], [0, 1]);
  const kr = useTransform(p, [0.72, 0.92], ["-0.3em", "0em"]);
  const nos = useTransform(p, [0.72, 0.92], ["0.3em", "0em"]);
  const caption = useTransform(p, [0.45, 0.6], [1, 0]);

  return (
    <section
      ref={track}
      data-stage="blueprint"
      aria-labelledby="blueprint-title"
      className="relative h-[360vh]"
    >
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden px-4">
        <motion.div
          style={{ opacity: caption }}
          className="absolute inset-x-0 top-28 mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-8"
        >
          <h2 id="blueprint-title" className="max-w-[14ch] display">
            هر چرخ، درست سر جای خودش
          </h2>
          <p className="max-w-xs text-base leading-8 text-muted-foreground">
            نقشهٔ واقعی چرخ‌دنده‌ها: فاصلهٔ هر دو محور دقیقاً به اندازهٔ دندانه‌هایی است که با هم
            درگیرند.
          </p>
          <p className="caps text-muted-foreground" dir="ltr">
            Blueprint · ⌀ {(R * 2).toFixed(1)} mm
          </p>
        </motion.div>

        <p
          dir="ltr"
          aria-hidden
          className="grid grid-cols-[1fr_auto_1fr] items-center font-display text-[18vw] leading-none tracking-[0.12em] lg:text-[11vw]"
        >
          <motion.span aria-hidden style={{ opacity: letters, x: kr }} className="justify-self-end">
            KR
          </motion.span>
          <motion.svg
            aria-hidden
            viewBox={`${-R - 1.5} ${-R - 1.5} ${2 * R + 3} ${2 * R + 3}`}
            style={{ scale }}
            className="mx-[0.06em] size-[0.68em] overflow-visible text-metal"
          >
            <motion.g style={{ opacity: detail }} className="stroke-current" strokeWidth={1}>
              <line
                x1={-R - 1.5}
                x2={R + 1.5}
                y1={0}
                y2={0}
                vectorEffect="non-scaling-stroke"
                strokeDasharray="4 3"
                className="opacity-40"
              />
              <line
                y1={-R - 1.5}
                y2={R + 1.5}
                x1={0}
                x2={0}
                vectorEffect="non-scaling-stroke"
                strokeDasharray="4 3"
                className="opacity-40"
              />
              {WHEELS.map((circle, index) => (
                <Drawn key={circle.key} circle={circle} progress={p} index={index} />
              ))}
              {PINIONS.map((circle, index) => (
                <Drawn
                  key={`${circle.key}-pinion`}
                  circle={circle}
                  progress={p}
                  index={index + 3}
                />
              ))}
              {WHEELS.map((circle) => (
                <circle
                  key={`${circle.key}-arbor`}
                  cx={circle.cx}
                  cy={circle.cy}
                  r={0.22}
                  className="fill-current"
                  stroke="none"
                />
              ))}
            </motion.g>
            <motion.circle
              r={R}
              fill="none"
              className="stroke-current"
              style={{ pathLength: ring, strokeWidth: ringWidth }}
            />
          </motion.svg>
          <motion.span
            aria-hidden
            style={{ opacity: letters, x: nos }}
            className="justify-self-start"
          >
            NOS
          </motion.span>
        </p>
      </div>
    </section>
  );
}
