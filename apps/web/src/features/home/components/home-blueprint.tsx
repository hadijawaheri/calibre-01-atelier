"use client";

import { motion, useReducedMotion } from "motion/react";

import {
  ARBOR,
  BALANCE_RADIUS,
  ESCAPE_RADIUS,
  MOVEMENT_RADIUS,
  PART_BY_ID,
  pitchRadius,
  WHEEL,
} from "@/features/movement";

type Key = "barrel" | "centre" | "third" | "fourth" | "escape" | "balance";

interface Wheel {
  key: Key;
  letter: string;
  cx: number;
  cy: number;
  r: number;
  teeth?: number;
  pinion?: number;
}

const at = (name: Key) => ({ cx: ARBOR[name][0], cy: -ARBOR[name][1] });

/* The real plan of the lab's calibre: every wheel at its arbor, drawn at its pitch radius, so the drawing
   is the same machine the 3D lab assembles. Letters key the drawing to the table beside it. */
const WHEELS: readonly Wheel[] = [
  {
    key: "barrel",
    letter: "A",
    ...at("barrel"),
    r: pitchRadius(WHEEL.barrel.module, WHEEL.barrel.teeth),
    teeth: WHEEL.barrel.teeth,
  },
  {
    key: "centre",
    letter: "B",
    ...at("centre"),
    r: pitchRadius(WHEEL.centre.module, WHEEL.centre.teeth),
    teeth: WHEEL.centre.teeth,
    pinion: WHEEL.centre.pinion,
  },
  {
    key: "third",
    letter: "C",
    ...at("third"),
    r: pitchRadius(WHEEL.third.module, WHEEL.third.teeth),
    teeth: WHEEL.third.teeth,
    pinion: WHEEL.third.pinion,
  },
  {
    key: "fourth",
    letter: "D",
    ...at("fourth"),
    r: pitchRadius(WHEEL.fourth.module, WHEEL.fourth.teeth),
    teeth: WHEEL.fourth.teeth,
    pinion: WHEEL.fourth.pinion,
  },
  {
    key: "escape",
    letter: "E",
    ...at("escape"),
    r: ESCAPE_RADIUS,
    teeth: WHEEL.escape.teeth,
    pinion: WHEEL.escape.pinion,
  },
  { key: "balance", letter: "F", ...at("balance"), r: BALANCE_RADIUS },
];

const R = MOVEMENT_RADIUS;
const PAD = 2;
const fa = (n: number) => n.toLocaleString("fa-IR");

export function HomeBlueprint() {
  const still = useReducedMotion();
  const draw = (index: number) =>
    still
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 1.6, delay: 0.15 * index, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section
      data-stage="blueprint"
      aria-labelledby="blueprint-title"
      className="border-y border-border bg-secondary/50"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:py-28">
        <figure className="flex flex-col plate">
          <div className="flex items-baseline justify-between gap-4 border-b border-border px-5 py-3">
            <span className="text-sm">نقشهٔ چرخ‌دنده‌ها</span>
            <span className="caps text-muted-foreground" dir="ltr">
              Plan · ⌀ {(R * 2).toFixed(1)} mm
            </span>
          </div>
          <svg
            viewBox={`${-R - PAD} ${-R - PAD} ${2 * (R + PAD)} ${2 * (R + PAD)}`}
            className="mx-auto aspect-square w-full max-w-lg p-6 text-foreground"
            role="img"
            aria-label="نقشهٔ واقعی چرخ‌دنده‌های موومنت اتوماتیک: بشکه، چرخ مرکز، چرخ سوم، چرخ چهارم، چرخ اسکیپمنت و چرخ بالانس، هر کدام سر محور خودش"
          >
            <g className="stroke-border" strokeWidth={1} vectorEffect="non-scaling-stroke">
              <line
                x1={-R - PAD}
                x2={R + PAD}
                y1={0}
                y2={0}
                strokeDasharray="4 3"
                vectorEffect="non-scaling-stroke"
              />
              <line
                y1={-R - PAD}
                y2={R + PAD}
                x1={0}
                x2={0}
                strokeDasharray="4 3"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            <motion.circle
              r={R}
              fill="none"
              className="stroke-foreground"
              strokeWidth={1.25}
              vectorEffect="non-scaling-stroke"
              {...draw(0)}
            />
            {WHEELS.map((wheel, index) => (
              <g key={wheel.key}>
                <motion.circle
                  cx={wheel.cx}
                  cy={wheel.cy}
                  r={wheel.r}
                  fill="none"
                  className={wheel.key === "balance" ? "stroke-metal" : "stroke-foreground/70"}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  {...draw(index + 1)}
                />
                <circle cx={wheel.cx} cy={wheel.cy} r={0.22} className="fill-foreground" />
                <text
                  x={wheel.cx + 0.5}
                  y={wheel.cy - 0.5}
                  className="fill-muted-foreground font-mono"
                  fontSize={1.05}
                >
                  {wheel.letter}
                </text>
              </g>
            ))}
          </svg>
        </figure>

        <div className="flex flex-col gap-6">
          <h2 id="blueprint-title" className="display">
            هر چرخ، درست سر جای خودش
          </h2>
          <p className="max-w-lg leading-8 text-muted-foreground">
            نقشهٔ واقعی چرخ‌دنده‌ها: فاصلهٔ هر دو محور دقیقاً به اندازهٔ دندانه‌هایی است که با هم
            درگیرند.
          </p>
          <div className="overflow-x-auto plate">
            <table className="w-full text-sm">
              <caption className="sr-only">دندانه‌های قطار چرخ‌دنده</caption>
              <thead className="border-b border-border bg-secondary/60">
                <tr className="text-start">
                  <th scope="col" className="px-4 py-2.5 text-start label font-normal">
                    قطعه
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-start label font-normal">
                    دندانهٔ چرخ
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-start label font-normal">
                    دندانهٔ پینیون
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {WHEELS.map((wheel) => (
                  <tr key={wheel.key}>
                    <th scope="row" className="px-4 py-2.5 text-start font-normal">
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                          {wheel.letter}
                        </span>
                        {PART_BY_ID[wheel.key].name}
                      </span>
                    </th>
                    <td className="px-4 py-2.5 tabular-nums">
                      {wheel.teeth ? fa(wheel.teeth) : "—"}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {wheel.pinion ? fa(wheel.pinion) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
