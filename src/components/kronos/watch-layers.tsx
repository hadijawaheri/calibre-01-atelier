/**
 * SVG artwork for each layer of the exploded view.
 * Swap the whole <ExplodedView /> for an R3F <Canvas> loading a .glb later;
 * LAYERS (data) stays reusable for hotspots + labels.
 */
import type { ReactNode } from "react";

export type StrapId = "alligator" | "titanium" | "milanese";

export interface LayerDef {
  id: string;
  index: number;
  name: string;
  hotspot: { x: number; y: number; title: string; body: string };
  art: ReactNode;
}

const ticks = (n: number, r1: number, r2: number, w = 1, cls = "stroke-gold") =>
  Array.from({ length: n }).map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    return (
      <line
        key={i}
        x1={100 + Math.cos(a) * r1}
        y1={100 + Math.sin(a) * r1}
        x2={100 + Math.cos(a) * r2}
        y2={100 + Math.sin(a) * r2}
        className={cls}
        strokeWidth={w}
      />
    );
  });

const Gear = ({ cx, cy, r, teeth, className = "" }: { cx: number; cy: number; r: number; teeth: number; className?: string }) => (
  <g className={className} style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: "view-box" }}>
    <circle cx={cx} cy={cy} r={r} className="fill-none stroke-gold" strokeWidth={1.4} />
    {Array.from({ length: teeth }).map((_, i) => {
      const a = (i / teeth) * Math.PI * 2;
      return <line key={i} x1={cx + Math.cos(a) * r} y1={cy + Math.sin(a) * r} x2={cx + Math.cos(a) * (r + 3)} y2={cy + Math.sin(a) * (r + 3)} className="stroke-gold" strokeWidth={1.6} />;
    })}
    {[0, 1, 2, 3].map((i) => {
      const a = (i / 4) * Math.PI * 2;
      return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} className="stroke-gold/70" strokeWidth={1} />;
    })}
    <circle cx={cx} cy={cy} r={2} className="fill-rose" />
  </g>
);

export const LAYERS: LayerDef[] = [
  {
    id: "crystal", index: 0, name: "Sapphire Crystal",
    hotspot: { x: 30, y: 28, title: "Domed Sapphire", body: "9H synthetic sapphire, 7-layer anti-reflective coating on both faces." },
    art: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <radialGradient id="glass" cx="35%" cy="30%">
            <stop offset="0%" stopColor="var(--color-sapphire)" stopOpacity="0.45" />
            <stop offset="70%" stopColor="var(--color-sapphire)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--color-titanium)" stopOpacity="0.25" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="92" fill="url(#glass)" className="stroke-titanium/50" strokeWidth="1" />
        <path d="M45 60 Q70 30 110 26" className="fill-none stroke-foreground/40" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "dial", index: 1, name: "Skeleton Dial & Hands",
    hotspot: { x: 72, y: 30, title: "Rose-Gold Indices", body: "Hand-applied 18K rose-gold indices with Super-LumiNova® hands." },
    art: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="92" className="fill-onyx/40 stroke-gold" strokeWidth="3" />
        <circle cx="100" cy="100" r="84" className="fill-none stroke-titanium/30" strokeWidth="0.6" />
        {ticks(60, 80, 84, 0.6, "stroke-titanium/60")}
        {ticks(12, 70, 82, 3.5, "stroke-rose")}
        <line x1="100" y1="100" x2="100" y2="40" className="stroke-lume" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="100" y1="100" x2="145" y2="118" className="stroke-lume" strokeWidth="3" strokeLinecap="round" />
        <line x1="100" y1="112" x2="100" y2="28" className="stroke-gold" strokeWidth="1" />
        <circle cx="100" cy="100" r="4" className="fill-gold" />
      </svg>
    ),
  },
  {
    id: "complication", index: 2, name: "Flying Tourbillon",
    hotspot: { x: 50, y: 72, title: "Flying Tourbillon", body: "60-second cage, 68 components weighing just 0.29 g. Cantilevered with no upper bridge." },
    art: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="88" className="fill-none stroke-titanium/30" strokeWidth="10" strokeDasharray="2 4" />
        <g className="animate-spin-med" style={{ transformOrigin: "100px 145px" }}>
          <circle cx="100" cy="145" r="24" className="fill-none stroke-gold" strokeWidth="1.5" />
          <path d="M100 121 L100 169 M76 145 L124 145" className="stroke-gold/80" strokeWidth="1.5" />
          <circle cx="100" cy="145" r="10" className="fill-none stroke-sapphire" strokeWidth="2" />
        </g>
        <rect x="128" y="94" width="20" height="12" className="fill-foreground/90" />
        <text x="138" y="103.5" textAnchor="middle" className="fill-onyx font-mono" fontSize="8">20</text>
      </svg>
    ),
  },
  {
    id: "movement", index: 3, name: "Calibre 01 Movement",
    hotspot: { x: 64, y: 52, title: "4Hz · 28,800 vph", body: "Co-axial escapement, free-sprung balance with Breguet overcoil hairspring." },
    art: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="86" className="fill-card stroke-gold/60" strokeWidth="1.5" />
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={20 + i * 12} y1="20" x2={20 + i * 12} y2="180" className="stroke-gold/10" strokeWidth="5" />
        ))}
        <Gear cx={70} cy={80} r={22} teeth={30} className="animate-spin-slow" />
        <Gear cx={118} cy={70} r={14} teeth={20} className="animate-spin-med" />
        <g style={{ transformOrigin: "128px 128px", transformBox: "view-box" }} className="animate-balance">
          <circle cx="128" cy="128" r="22" className="fill-none stroke-titanium" strokeWidth="2.5" />
          <line x1="106" y1="128" x2="150" y2="128" className="stroke-titanium" strokeWidth="1.5" />
        </g>
        {[[40, 130], [80, 150], [160, 100], [100, 40]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" className="fill-destructive/80 stroke-gold" strokeWidth="0.8" />
        ))}
      </svg>
    ),
  },
  {
    id: "rotor", index: 4, name: "22K Gold Rotor",
    hotspot: { x: 32, y: 66, title: "72-Hour Power Reserve", body: "Bi-directional 22K gold oscillating weight on ceramic ball bearings; twin barrels." },
    art: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <g className="animate-spin-slow" style={{ transformOrigin: "100px 100px" }}>
          <path d="M100 100 L18 100 A82 82 0 0 1 182 100 Z" className="fill-gold/25 stroke-gold" strokeWidth="2" />
          {[40, 55, 70].map((r) => (
            <path key={r} d={`M${100 - r} 100 A${r} ${r} 0 0 1 ${100 + r} 100`} className="fill-none stroke-gold/60" strokeWidth="1" />
          ))}
          <text x="100" y="62" textAnchor="middle" className="fill-gold font-serif" fontSize="9" letterSpacing="3">KRONOS</text>
        </g>
        <circle cx="100" cy="100" r="7" className="fill-gold" />
      </svg>
    ),
  },
  {
    id: "caseback", index: 5, name: "Titanium Caseback",
    hotspot: { x: 74, y: 70, title: "100m Water Resistance", body: "Grade 5 titanium exhibition caseback, screw-down, sapphire window." },
    art: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" className="fill-titanium/20 stroke-titanium" strokeWidth="5" />
        <circle cx="100" cy="100" r="74" className="fill-onyx/60 stroke-titanium/60" strokeWidth="1" />
        {ticks(6, 84, 92, 4, "stroke-titanium")}
        <text x="100" y="186" textAnchor="middle" className="fill-titanium font-mono" fontSize="5" letterSpacing="2">SWISS MADE · Nº 001/088</text>
      </svg>
    ),
  },
];
