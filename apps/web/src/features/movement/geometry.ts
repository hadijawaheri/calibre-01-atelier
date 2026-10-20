/** Pure SVG path builders for the procedural movement. Angles in radians, y axis down. */

const TAU = Math.PI * 2;
const round = (value: number): number => Math.round(value * 100) / 100;

function polar(cx: number, cy: number, r: number, angle: number): string {
  return `${round(cx + r * Math.cos(angle))} ${round(cy + r * Math.sin(angle))}`;
}

export interface GearOptions {
  cx: number;
  cy: number;
  teeth: number;
  outer: number;
  root: number;
  /** Fraction of the pitch the tooth tip occupies (0..1) */
  tip?: number;
}

/** Closed outline of a spur gear with trapezoid teeth. */
export function gearOutline({ cx, cy, teeth, outer, root, tip = 0.32 }: GearOptions): string {
  if (teeth < 3) throw new Error("A gear needs at least 3 teeth");
  if (root >= outer) throw new Error("Root radius must be smaller than outer radius");
  const pitch = TAU / teeth;
  const flank = (1 - tip) / 4;
  const parts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * pitch;
    parts.push(
      `${i === 0 ? "M" : "L"}${polar(cx, cy, root, a)}`,
      `L${polar(cx, cy, outer, a + pitch * flank)}`,
      `L${polar(cx, cy, outer, a + pitch * (flank + tip))}`,
      `L${polar(cx, cy, root, a + pitch * (2 * flank + tip))}`,
    );
  }
  return `${parts.join(" ")} Z`;
}

/** Ring sector between two radii, used for the windows between wheel spokes. */
export function annularSector(
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  from: number,
  to: number,
): string {
  const large = to - from > Math.PI ? 1 : 0;
  return [
    `M${polar(cx, cy, outer, from)}`,
    `A${outer} ${outer} 0 ${large} 1 ${polar(cx, cy, outer, to)}`,
    `L${polar(cx, cy, inner, to)}`,
    `A${inner} ${inner} 0 ${large} 0 ${polar(cx, cy, inner, from)}`,
    "Z",
  ].join(" ");
}

export interface WheelOptions extends GearOptions {
  spokes: number;
  hub: number;
  rim: number;
  /** Spoke width as an angle */
  spokeWidth?: number;
}

/** Gear with crossed-out spokes; render with fill-rule="evenodd". */
export function wheelPath(options: WheelOptions): string {
  const { cx, cy, spokes, hub, rim, spokeWidth = 0.22 } = options;
  const parts = [gearOutline(options)];
  if (spokes > 0) {
    const step = TAU / spokes;
    for (let i = 0; i < spokes; i++) {
      const from = i * step + spokeWidth / 2;
      parts.push(annularSector(cx, cy, hub, rim, from, from + step - spokeWidth));
    }
  }
  return parts.join(" ");
}

export function circle(cx: number, cy: number, r: number): string {
  return `M${round(cx - r)} ${round(cy)} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
}

/** Archimedean spiral for the balance hairspring. */
export function spiral(cx: number, cy: number, from: number, to: number, turns: number): string {
  const steps = Math.max(24, Math.round(turns * 48));
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push(`${i === 0 ? "M" : "L"}${polar(cx, cy, from + (to - from) * t, t * turns * TAU)}`);
  }
  return points.join(" ");
}

/** Regular star polygon, e.g. the openwork in the oscillating weight. */
export function star(cx: number, cy: number, outer: number, inner: number, points: number, rotation = -Math.PI / 2): string {
  const parts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    parts.push(`${i === 0 ? "M" : "L"}${polar(cx, cy, r, rotation + (i * Math.PI) / points)}`);
  }
  return `${parts.join(" ")} Z`;
}

/** Positions on a circle, e.g. screws around a plate or columns of the column wheel. */
export function ring(cx: number, cy: number, r: number, count: number, offset = 0): Array<{ x: number; y: number }> {
  return Array.from({ length: count }, (_, i) => {
    const angle = offset + (i * TAU) / count;
    return { x: round(cx + r * Math.cos(angle)), y: round(cy + r * Math.sin(angle)) };
  });
}

/** Seconds per revolution of a wheel meshing with a driver (opposite direction). */
export function meshedPeriod(driverPeriod: number, driverTeeth: number, drivenTeeth: number): number {
  return (driverPeriod * drivenTeeth) / driverTeeth;
}
