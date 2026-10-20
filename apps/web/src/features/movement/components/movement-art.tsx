/* Procedural artwork for the hero. Colours are physical materials (rhodium, gold, rubies,
   heat-blued steel), so they stay fixed across themes instead of using UI tokens. */
import type { CSSProperties } from "react";

import { GEOMETRY as G } from "../calibre";
import {
  annularSector,
  circle,
  gearOutline,
  ring,
  spiral,
  star,
  wheelPath,
} from "../geometry";
import styles from "./movement.module.css";

const VIEWBOX = "0 0 800 800";
const C = G.center;

const origin = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px` });

function Svg({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <svg
      viewBox={VIEWBOX}
      className="absolute inset-0 size-full overflow-visible"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {children}
    </svg>
  );
}

/** Shared gradients and patterns; referenced by id from every layer. */
export function MovementDefs() {
  return (
    <svg aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
      <defs>
        <linearGradient id="mv-rhodium" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e4e7ec" />
          <stop offset="0.45" stopColor="#aab0b9" />
          <stop offset="1" stopColor="#7c838e" />
        </linearGradient>
        <linearGradient id="mv-steel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f7f9" />
          <stop offset="0.5" stopColor="#b7bdc6" />
          <stop offset="1" stopColor="#e9ecf0" />
        </linearGradient>
        <linearGradient id="mv-case" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f3f5" />
          <stop offset="0.3" stopColor="#8c929b" />
          <stop offset="0.55" stopColor="#d9dce1" />
          <stop offset="1" stopColor="#5d636c" />
        </linearGradient>
        <linearGradient id="mv-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3d9a0" />
          <stop offset="0.5" stopColor="#c9993f" />
          <stop offset="1" stopColor="#8f6626" />
        </linearGradient>
        <radialGradient id="mv-ruby" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ff8aa6" />
          <stop offset="0.45" stopColor="#c2163f" />
          <stop offset="1" stopColor="#5e0619" />
        </radialGradient>
        <linearGradient id="mv-blued" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6f9cff" />
          <stop offset="1" stopColor="#1c3a8f" />
        </linearGradient>
        <linearGradient id="mv-column" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7fb2ff" />
          <stop offset="1" stopColor="#1f5fd1" />
        </linearGradient>
        <radialGradient id="mv-sunburst" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f4f5f7" />
          <stop offset="1" stopColor="#9aa1ab" />
        </radialGradient>
        {/* Côtes de Genève: broad parallel waves across the bridges */}
        <pattern id="mv-cotes" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
          <rect width="46" height="46" fill="#b9bfc8" />
          <rect width="23" height="46" fill="#d7dbe1" />
          <rect x="21" width="4" height="46" fill="#eef0f3" />
        </pattern>
        {/* Perlage: overlapping circular grain on the main plate */}
        <radialGradient id="mv-perle" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c9ced5" />
          <stop offset="0.7" stopColor="#9da4ae" />
          <stop offset="1" stopColor="#7d848e" />
        </radialGradient>
        <pattern id="mv-perlage" width="22" height="19" patternUnits="userSpaceOnUse">
          <rect width="22" height="19" fill="#8b929c" />
          <circle cx="11" cy="9.5" r="11" fill="url(#mv-perle)" />
          <circle cx="0" cy="0" r="11" fill="url(#mv-perle)" />
          <circle cx="22" cy="0" r="11" fill="url(#mv-perle)" />
        </pattern>
        <pattern id="mv-brushed" width="800" height="800" patternUnits="userSpaceOnUse">
          <rect width="800" height="800" fill="url(#mv-case)" />
          {Array.from({ length: 34 }, (_, i) => (
            <circle
              key={i}
              cx="400"
              cy="400"
              r={20 + i * 10}
              fill="none"
              stroke={i % 2 ? "#ffffff" : "#000000"}
              strokeOpacity="0.07"
              strokeWidth="4"
            />
          ))}
        </pattern>
        <filter id="mv-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#000" floodOpacity="0.55" />
        </filter>
        <path id="mv-caseback-text" d={circle(400, 400, 286)} />
        <path id="mv-rotor-text" d="M 138 400 A 262 262 0 0 1 662 400" />
      </defs>
    </svg>
  );
}

function Jewel({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 4} fill="url(#mv-gold)" />
      <circle cx={x} cy={y} r={r} fill="url(#mv-ruby)" />
      <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.25} fill="#fff" opacity="0.7" />
    </g>
  );
}

function Screw({ x, y, angle = 30 }: { x: number; y: number; angle?: number }) {
  return (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <circle cx={x} cy={y} r="8" fill="url(#mv-blued)" stroke="#0e1f52" strokeWidth="1" />
      <rect x={x - 7} y={y - 1.4} width="14" height="2.8" fill="#0b1638" />
    </g>
  );
}

export function CaseLayer() {
  const lug = (x: number, y: number, flip: boolean) => (
    <path
      d={`M${x - 46} ${y} C ${x - 44} ${flip ? y + 70 : y - 70}, ${x - 30} ${flip ? y + 92 : y - 92}, ${x - 24} ${flip ? y + 96 : y - 96} L ${x + 24} ${flip ? y + 96 : y - 96} C ${x + 30} ${flip ? y + 92 : y - 92}, ${x + 44} ${flip ? y + 70 : y - 70}, ${x + 46} ${y} Z`}
      fill="url(#mv-case)"
    />
  );
  return (
    <Svg>
      {lug(250, 120, false)}
      {lug(550, 120, false)}
      {lug(250, 680, true)}
      {lug(550, 680, true)}
      {/* Crown: at three o'clock seen from the dial, so on the left from the back */}
      <rect x="18" y="372" width="34" height="56" rx="6" fill="url(#mv-steel)" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x="18" y={376 + i * 7.5} width="34" height="2" fill="#6b717a" />
      ))}
      <path d={`${circle(400, 400, 358)} ${circle(400, 400, 304)}`} fillRule="evenodd" fill="url(#mv-case)" filter="url(#mv-shadow)" />
      <circle cx="400" cy="400" r="304" fill="#1a1b1f" />
    </Svg>
  );
}

export function PlateLayer() {
  return (
    <Svg>
      <circle cx={C.x} cy={C.y} r="300" fill="url(#mv-perlage)" />
      <circle cx={C.x} cy={C.y} r="300" fill="none" stroke="#6d747e" strokeWidth="3" />
      <circle cx={C.x} cy={C.y} r="292" fill="none" stroke="#ffffff" strokeOpacity="0.25" />
      {/* Sinks for the wheels give the plate depth */}
      {[G.balance, G.escape, G.fourth, G.third, G.columnWheel, G.coupling].map((p) => (
        <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="36" fill="#000" opacity="0.18" />
      ))}
      <Jewel x={C.x} y={C.y} r={6} />
    </Svg>
  );
}

export function TrainLayer() {
  const wheels = [
    {
      key: "barrel",
      at: G.barrel,
      path: wheelPath({ cx: G.barrel.x, cy: G.barrel.y, teeth: 84, outer: 92, root: 87, spokes: 0, hub: 0, rim: 0 }),
      fill: "url(#mv-gold)",
      period: 600,
      reverse: false,
    },
    {
      key: "center",
      at: C,
      path: wheelPath({ cx: C.x, cy: C.y, teeth: 80, outer: 66, root: 62, spokes: 4, hub: 12, rim: 54 }),
      fill: "url(#mv-gold)",
      period: 120,
      reverse: true,
    },
    {
      key: "third",
      at: G.third,
      path: wheelPath({ cx: G.third.x, cy: G.third.y, teeth: 60, outer: 48, root: 45, spokes: 5, hub: 8, rim: 38 }),
      fill: "url(#mv-gold)",
      period: 40,
      reverse: false,
    },
    {
      key: "fourth",
      at: G.fourth,
      path: wheelPath({ cx: G.fourth.x, cy: G.fourth.y, teeth: 56, outer: 44, root: 41, spokes: 4, hub: 7, rim: 34 }),
      fill: "url(#mv-gold)",
      period: 12,
      reverse: true,
    },
  ];

  return (
    <Svg>
      {/* Mainspring barrel: drum with the coiled spring hinted through the cover */}
      {wheels.map((wheel) => (
        <g
          key={wheel.key}
          className={`${styles.part} ${wheel.reverse ? styles.spinReverse : styles.spin}`}
          style={{ ...origin(wheel.at.x, wheel.at.y), animationDuration: `${wheel.period}s` }}
        >
          <path d={wheel.path} fill={wheel.fill} fillRule="evenodd" stroke="#6e4f1c" strokeWidth="0.6" filter="url(#mv-shadow)" />
          {wheel.key === "barrel" && (
            <>
              <circle cx={G.barrel.x} cy={G.barrel.y} r="80" fill="#a77b33" />
              <path d={spiral(G.barrel.x, G.barrel.y, 18, 76, 7)} fill="none" stroke="#5c4113" strokeOpacity="0.55" strokeWidth="1.5" />
            </>
          )}
          <circle cx={wheel.at.x} cy={wheel.at.y} r="7" fill="url(#mv-steel)" />
        </g>
      ))}

      {/* Escape wheel: 20 club teeth in polished steel, advancing on every beat */}
      <g className={`${styles.part} ${styles.escape}`} style={origin(G.escape.x, G.escape.y)}>
        <path
          d={wheelPath({ cx: G.escape.x, cy: G.escape.y, teeth: 20, outer: 28, root: 21, tip: 0.18, spokes: 5, hub: 4, rim: 17 })}
          fill="url(#mv-steel)"
          fillRule="evenodd"
          stroke="#5f6670"
          strokeWidth="0.6"
        />
      </g>
    </Svg>
  );
}

export function RegulatorLayer({ columnStep, chronoRunning }: { columnStep: number; chronoRunning: boolean }) {
  const b = G.balance;
  const arms = [0, 120, 240];
  return (
    <Svg>
      {/* Pallet fork, flicking left and right ten times a second */}
      <g className={`${styles.part} ${styles.pallet}`} style={origin(G.pallet.x, G.pallet.y)}>
        <path
          d={`M ${G.pallet.x - 54} ${G.pallet.y - 10} L ${G.pallet.x + 30} ${G.pallet.y - 4} L ${G.pallet.x + 46} ${G.pallet.y + 14} L ${G.pallet.x + 38} ${G.pallet.y + 22} L ${G.pallet.x + 22} ${G.pallet.y + 8} L ${G.pallet.x - 54} ${G.pallet.y + 4} Z`}
          fill="url(#mv-steel)"
          stroke="#59606a"
          strokeWidth="0.8"
        />
        <rect x={G.pallet.x + 30} y={G.pallet.y + 6} width="10" height="7" fill="url(#mv-ruby)" transform={`rotate(40 ${G.pallet.x + 35} ${G.pallet.y + 9})`} />
        <circle cx={G.pallet.x} cy={G.pallet.y} r="5" fill="url(#mv-steel)" stroke="#59606a" />
      </g>

      {/* Balance wheel with timing screws and Breguet-style hairspring: 5 Hz */}
      <g className={`${styles.part} ${styles.balance}`} style={origin(b.x, b.y)}>
        <path d={`${circle(b.x, b.y, 76)} ${circle(b.x, b.y, 66)}`} fillRule="evenodd" fill="url(#mv-gold)" stroke="#6e4f1c" strokeWidth="0.6" filter="url(#mv-shadow)" />
        {arms.map((angle) => (
          <rect key={angle} x={b.x - 3} y={b.y - 68} width="6" height="68" fill="url(#mv-gold)" transform={`rotate(${angle} ${b.x} ${b.y})`} />
        ))}
        {ring(b.x, b.y, 71, 12).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.4" fill="url(#mv-gold)" stroke="#6e4f1c" strokeWidth="0.5" />
        ))}
        <circle cx={b.x} cy={b.y} r="10" fill="url(#mv-gold)" />
      </g>
      <g className={`${styles.part} ${styles.hairspring}`} style={origin(b.x, b.y)}>
        <path d={spiral(b.x, b.y, 9, 50, 10)} fill="none" stroke="#3f6fd8" strokeWidth="1.3" opacity="0.95" />
      </g>

      {/* Column wheel: the chronograph's brain, turning one column per push */}
      <g className={styles.column} style={{ ...origin(G.columnWheel.x, G.columnWheel.y), transform: `rotate(${columnStep * 30}deg)` }}>
        <path
          d={gearOutline({ cx: G.columnWheel.x, cy: G.columnWheel.y, teeth: 18, outer: 34, root: 28, tip: 0.12 })}
          fill="url(#mv-column)"
          stroke="#123a85"
          strokeWidth="0.8"
          filter="url(#mv-shadow)"
        />
        <circle cx={G.columnWheel.x} cy={G.columnWheel.y} r="24" fill="#2b6ae0" />
        {ring(G.columnWheel.x, G.columnWheel.y, 17, 6).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="6.5" fill="url(#mv-column)" stroke="#0f2f6e" strokeWidth="0.8" />
        ))}
        <Screw x={G.columnWheel.x} y={G.columnWheel.y} angle={10} />
      </g>

      {/* Coupling wheel and minute counter: spin only while the chronograph runs */}
      <g
        className={`${styles.part} ${styles.spin}`}
        style={{
          ...origin(G.coupling.x, G.coupling.y),
          animationDuration: "6s",
          animationPlayState: chronoRunning ? "var(--run)" : "paused",
        }}
      >
        <path
          d={wheelPath({ cx: G.coupling.x, cy: G.coupling.y, teeth: 64, outer: 34, root: 32, spokes: 3, hub: 6, rim: 27 })}
          fill="url(#mv-gold)"
          fillRule="evenodd"
          stroke="#6e4f1c"
          strokeWidth="0.5"
        />
      </g>
      <g
        className={`${styles.part} ${styles.spinReverse}`}
        style={{
          ...origin(G.minuteCounter.x, G.minuteCounter.y),
          animationDuration: "30s",
          animationPlayState: chronoRunning ? "var(--run)" : "paused",
        }}
      >
        <path
          d={wheelPath({ cx: G.minuteCounter.x, cy: G.minuteCounter.y, teeth: 30, outer: 22, root: 20, spokes: 3, hub: 4, rim: 16 })}
          fill="url(#mv-gold)"
          fillRule="evenodd"
        />
      </g>
    </Svg>
  );
}

export function BridgesLayer() {
  const b = G.balance;
  // A three-quarter plate with windows over the moving parts
  const windows = [
    circle(b.x, b.y, 92),
    circle(G.escape.x, G.escape.y, 40),
    circle(G.pallet.x, G.pallet.y, 30),
    circle(G.fourth.x, G.fourth.y, 34),
    annularSector(G.third.x, G.third.y, 0.01, 52, -0.3, 1.9),
    circle(G.columnWheel.x, G.columnWheel.y, 44),
    circle(G.coupling.x, G.coupling.y, 40),
    circle(G.minuteCounter.x, G.minuteCounter.y, 28),
  ].join(" ");

  const gaps: Array<[number, number, number, number]> = [
    [400, 100, 400, 330],
    [470, 400, 690, 470],
    [300, 380, 110, 330],
  ];

  return (
    <Svg>
      <path d={`${circle(C.x, C.y, 296)} ${windows}`} fill="url(#mv-cotes)" fillRule="evenodd" filter="url(#mv-shadow)" />
      <path d={`${circle(C.x, C.y, 296)} ${windows}`} fill="none" stroke="#f5f6f8" strokeOpacity="0.55" strokeWidth="2.5" fillRule="evenodd" />
      {gaps.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4b525c" strokeWidth="3" strokeLinecap="round" />
      ))}

      {/* Balance cock, with its regulator index */}
      <path
        d={`M 98 520 C 140 520, 190 540, ${b.x - 18} ${b.y - 6} A 22 22 0 1 1 ${b.x - 18} ${b.y + 6} C 190 580, 140 600, 104 600 Z`}
        fill="url(#mv-cotes)"
        stroke="#f5f6f8"
        strokeOpacity="0.6"
        strokeWidth="2"
        filter="url(#mv-shadow)"
      />
      <path d={`M ${b.x} ${b.y} L ${b.x + 70} ${b.y - 48}`} stroke="url(#mv-steel)" strokeWidth="5" strokeLinecap="round" />
      <Jewel x={b.x} y={b.y} r={7} />

      {/* Ratchet wheel over the barrel, with a sunburst finish */}
      <path d={gearOutline({ cx: G.barrel.x, cy: G.barrel.y, teeth: 48, outer: 62, root: 57, tip: 0.2 })} fill="url(#mv-sunburst)" stroke="#6b727c" strokeWidth="0.8" filter="url(#mv-shadow)" />
      {Array.from({ length: 36 }, (_, i) => (
        <line
          key={i}
          x1={G.barrel.x}
          y1={G.barrel.y}
          x2={G.barrel.x + 54 * Math.cos((i * Math.PI) / 18)}
          y2={G.barrel.y + 54 * Math.sin((i * Math.PI) / 18)}
          stroke="#ffffff"
          strokeOpacity="0.18"
        />
      ))}
      <Screw x={G.barrel.x} y={G.barrel.y} angle={-20} />

      {[C, G.third, G.fourth, G.escape, G.pallet].map((p) => (
        <Jewel key={`${p.x}-${p.y}`} x={p.x} y={p.y} r={p === C ? 9 : 7} />
      ))}
      {[
        [330, 170, 15], [480, 150, -40], [640, 220, 70], [690, 470, 5], [560, 660, -30],
        [420, 700, 55], [170, 440, 20], [200, 250, -60], [330, 470, 35], [590, 520, 80],
      ].map(([x, y, a]) => (
        <Screw key={`${x}-${y}`} x={x!} y={y!} angle={a} />
      ))}

      <g fontFamily="var(--font-jetbrains), monospace" fill="#4a515b" fontSize="13" letterSpacing="2">
        <text x="520" y="610">KR-P36</text>
        <text x="510" y="632" fontSize="10">THIRTY-ONE (31) JEWELS</text>
        <text x="150" y="380" fontSize="11">36&apos;000 A/h</text>
        <text x="330" y="664" fontSize="10">SWISS · UNADJUSTED</text>
      </g>
    </Svg>
  );
}

export function RotorLayer() {
  const rotor = [
    annularSector(C.x, C.y, 46, 292, Math.PI, Math.PI * 2),
    star(C.x, C.y - 165, 64, 26, 4, -Math.PI / 2),
    annularSector(C.x, C.y, 72, 118, Math.PI * 1.08, Math.PI * 1.42),
    annularSector(C.x, C.y, 72, 118, Math.PI * 1.58, Math.PI * 1.92),
  ].join(" ");
  return (
    <Svg>
      <g className={`${styles.part} ${styles.rotorSwing}`} style={origin(C.x, C.y)}>
        <path d={rotor} fill="url(#mv-cotes)" fillRule="evenodd" stroke="#e9ecf0" strokeWidth="2" filter="url(#mv-shadow)" />
        {/* 22K gold heavy-metal rim carries most of the mass */}
        <path d={annularSector(C.x, C.y, 262, 292, Math.PI, Math.PI * 2)} fill="url(#mv-gold)" stroke="#6e4f1c" strokeWidth="0.8" />
        <text fontFamily="var(--font-cormorant), serif" fontSize="17" letterSpacing="5" fill="#5a3f12">
          <textPath href="#mv-rotor-text" startOffset="50%" textAnchor="middle">
            KRONOS · CALIBRE KR-P36 · 22K
          </textPath>
        </text>
        <circle cx={C.x} cy={C.y} r="48" fill="url(#mv-steel)" stroke="#727983" strokeWidth="1.5" />
        {ring(C.x, C.y, 30, 3, -Math.PI / 2).map((p, i) => (
          <Screw key={i} x={p.x} y={p.y} angle={i * 40} />
        ))}
        <Jewel x={C.x} y={C.y} r={8} />
      </g>
    </Svg>
  );
}

export function CasebackLayer() {
  const notches = ring(400, 400, 342, 6, Math.PI / 6);
  return (
    <Svg>
      <circle cx="400" cy="400" r="352" fill="url(#mv-case)" filter="url(#mv-shadow)" />
      {notches.map((p, i) => (
        <rect
          key={i}
          x={p.x - 14}
          y={p.y - 6}
          width="28"
          height="12"
          rx="2"
          fill="#4d535b"
          transform={`rotate(${30 + i * 60 + 90} ${p.x} ${p.y})`}
        />
      ))}
      <circle cx="400" cy="400" r="318" fill="url(#mv-brushed)" />
      <circle cx="400" cy="400" r="318" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" />
      <text fontFamily="var(--font-jetbrains), monospace" fontSize="15" letterSpacing="6" fill="#555b64">
        <textPath href="#mv-caseback-text" startOffset="0">
          KRONOS ATELIER · LE BRASSUS · SWISS MADE · 10 BAR · CALIBRE KR-P36 · 36&apos;000 A/h · Nº 036/150 ·
        </textPath>
      </text>
      <circle cx="400" cy="400" r="120" fill="none" stroke="#6b717a" strokeWidth="1.5" />
      <path d={star(400, 400, 76, 30, 4, -Math.PI / 2)} fill="url(#mv-gold)" stroke="#6e4f1c" strokeWidth="1" />
      <circle cx="400" cy="400" r="16" fill="url(#mv-case)" />
      <text x="400" y="560" textAnchor="middle" fontFamily="var(--font-cormorant), serif" fontSize="34" letterSpacing="12" fill="#3f444b">
        KRONOS
      </text>
    </Svg>
  );
}
