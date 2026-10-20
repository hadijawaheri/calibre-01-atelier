/* Procedural watch portrait for products without photography. Metals and the dial colour
   are physical materials taken from the product, so they stay fixed across themes. */
import type { CaseMaterial, DialLayout } from "@kronos/contracts";
import { useId } from "react";

import { gearOutline, wheelPath } from "@/features/movement";
import { cn } from "@/lib/utils";

const METALS: Record<CaseMaterial, readonly [string, string, string]> = {
  titanium: ["#d5d8dc", "#7d838b", "#b4b9c0"],
  steel: ["#f4f5f7", "#9aa1ab", "#dfe2e6"],
  "rose-gold": ["#f6d0b6", "#b77656", "#e8b597"],
  "yellow-gold": ["#f6e2a8", "#b98a2f", "#ecca76"],
  platinum: ["#eef0f3", "#a9adb4", "#d9dce0"],
};

const C = 200;
const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const at = (r: number, deg: number, cx = C, cy = C) => ({
  x: Math.round((cx + r * Math.cos(toRad(deg))) * 100) / 100,
  y: Math.round((cy + r * Math.sin(toRad(deg))) * 100) / 100,
});

interface WatchRenderProps {
  dial: string;
  accent: string;
  layout: DialLayout;
  material: CaseMaterial;
  /** Product name for screen readers; omit when a visible caption already names it */
  label?: string;
  className?: string;
}

function Hand({ length, width, angle, color, tail = 18 }: { length: number; width: number; angle: number; color: string; tail?: number }) {
  return (
    <path
      d={`M${C - width / 2} ${C + tail} L${C - width / 4} ${C - length} L${C} ${C - length - width} L${C + width / 4} ${C - length} L${C + width / 2} ${C + tail} Z`}
      fill={color}
      transform={`rotate(${angle} ${C} ${C})`}
    />
  );
}

function SubDial({ cx, cy, r, accent, ink, hand }: { cx: number; cy: number; r: number; accent: string; ink: string; hand: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={accent} fillOpacity={0.16} stroke={ink} strokeOpacity={0.35} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = at(r - 2, i * 30, cx, cy);
        const b = at(r - (i % 3 === 0 ? 8 : 5), i * 30, cx, cy);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink} strokeOpacity={0.7} strokeWidth={1} />;
      })}
      <line x1={cx} y1={cy} x2={at(r - 6, hand, cx, cy).x} y2={at(r - 6, hand, cx, cy).y} stroke={accent} strokeWidth={1.6} />
      <circle cx={cx} cy={cy} r={2} fill={accent} />
    </g>
  );
}

/** Relative luminance decides whether the printing is light or dark. */
function inkFor(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? "#1b1c20" : "#f1ede4";
}

export function WatchRender({ dial, accent, layout, material, label, className }: WatchRenderProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [light, dark, mid] = METALS[material];
  const ink = inkFor(dial);
  const id = (name: string) => `${name}-${uid}`;

  return (
    <svg
      viewBox="0 0 400 400"
      className={cn("size-full", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={id("metal")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.35" stopColor={dark} />
          <stop offset="0.6" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <radialGradient id={id("dial")} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor={dial} stopOpacity={0.75} />
          <stop offset="0.55" stopColor={dial} />
          <stop offset="1" stopColor="#000" stopOpacity={0.9} />
        </radialGradient>
        <radialGradient id={id("glass")} cx="0.3" cy="0.2" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity={0.22} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
        <filter id={id("shadow")} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter={`url(#${id("shadow")})`}>
        {/* Lugs and crown */}
        {[-1, 1].map((side) => (
          <g key={side}>
            <path d={`M${C - 70} ${C + side * 120} L${C - 58} ${C + side * 188} L${C - 30} ${C + side * 188} L${C - 34} ${C + side * 128} Z`} fill={`url(#${id("metal")})`} />
            <path d={`M${C + 70} ${C + side * 120} L${C + 58} ${C + side * 188} L${C + 30} ${C + side * 188} L${C + 34} ${C + side * 128} Z`} fill={`url(#${id("metal")})`} />
          </g>
        ))}
        <rect x={C + 142} y={C - 15} width={20} height={30} rx={4} fill={`url(#${id("metal")})`} />
        {layout === "chronograph" && (
          <>
            <rect x={C + 120} y={C - 92} width={16} height={22} rx={3} fill={`url(#${id("metal")})`} transform={`rotate(30 ${C + 128} ${C - 81})`} />
            <rect x={C + 120} y={C + 70} width={16} height={22} rx={3} fill={`url(#${id("metal")})`} transform={`rotate(-30 ${C + 128} ${C + 81})`} />
          </>
        )}
        <circle cx={C} cy={C} r={150} fill={`url(#${id("metal")})`} />
      </g>
      <circle cx={C} cy={C} r={138} fill="none" stroke="#000" strokeOpacity={0.25} strokeWidth={2} />
      <circle cx={C} cy={C} r={132} fill={`url(#${id("dial")})`} />

      {layout === "skeleton" && (
        <g fill="none" stroke={accent} strokeOpacity={0.75} strokeWidth={1.2}>
          <path d={wheelPath({ cx: C - 40, cy: C + 40, teeth: 40, outer: 50, root: 46, spokes: 5, hub: 9, rim: 40 })} fillRule="evenodd" fill={accent} fillOpacity={0.35} />
          <path d={gearOutline({ cx: C + 50, cy: C - 30, teeth: 30, outer: 36, root: 32 })} />
          <path d={gearOutline({ cx: C + 40, cy: C + 60, teeth: 18, outer: 22, root: 19 })} />
          <circle cx={C - 30} cy={C - 60} r={30} strokeDasharray="2 3" />
        </g>
      )}

      {/* Hour markers */}
      {Array.from({ length: 60 }, (_, i) => {
        const hour = i % 5 === 0;
        const a = at(128, i * 6);
        const b = at(hour ? 112 : 123, i * 6);
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={hour ? accent : ink}
            strokeOpacity={hour ? 1 : 0.5}
            strokeWidth={hour ? (i === 0 ? 6 : 3.5) : 1}
            strokeLinecap="round"
          />
        );
      })}
      <text x={C} y={C - 70} textAnchor="middle" fill={ink} fontSize={13} fontFamily="var(--font-display)" letterSpacing={4}>
        KRONOS
      </text>

      {layout === "chronograph" && (
        <>
          <SubDial cx={C - 56} cy={C + 8} r={30} accent={accent} ink={ink} hand={200} />
          <SubDial cx={C + 56} cy={C + 8} r={30} accent={accent} ink={ink} hand={40} />
          <SubDial cx={C} cy={C + 62} r={30} accent={accent} ink={ink} hand={300} />
        </>
      )}
      {layout === "three-hand" && <SubDial cx={C} cy={C + 62} r={28} accent={accent} ink={ink} hand={120} />}
      {layout === "tourbillon" && (
        <g>
          <circle cx={C} cy={C + 62} r={40} fill="#000" fillOpacity={0.55} stroke={accent} strokeWidth={2} />
          <path d={gearOutline({ cx: C, cy: C + 62, teeth: 3, outer: 34, root: 12, tip: 0.18 })} fill={accent} fillOpacity={0.85} />
          <circle cx={C} cy={C + 62} r={18} fill="none" stroke={ink} strokeOpacity={0.7} strokeWidth={1.4} />
          <circle cx={C} cy={C + 62} r={3} fill="#c2163f" />
        </g>
      )}

      <Hand length={68} width={9} angle={-60} color={ink} />
      <Hand length={104} width={7} angle={60} color={ink} />
      <line x1={C} y1={C + 30} x2={C} y2={C - 120} stroke={accent} strokeWidth={1.6} transform={`rotate(${layout === "chronograph" ? 0 : 168} ${C} ${C})`} />
      <circle cx={C} cy={C} r={6} fill={accent} />
      <circle cx={C} cy={C} r={132} fill={`url(#${id("glass")})`} />
    </svg>
  );
}
