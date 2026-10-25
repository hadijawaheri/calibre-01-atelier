/* Procedural 2D profiles of the movement's parts, extruded into solids. Units are millimetres. */
import * as THREE from "three";

import type { Vec2 } from "../layout";

const TAU = Math.PI * 2;

interface GearOptions {
  teeth: number;
  module: number;
  /** Radius of the central hole for the arbor. */
  bore?: number;
  /** Crossings (spokes); 0 makes a solid disc as on pinions and small wheels. */
  spokes?: number;
  /** Width of the toothed rim left around the crossings. */
  rim?: number;
  /** Radius of the hub left around the arbor. */
  hub?: number;
}

/** A clock-type tooth: straight flanks, rounded addendum, like the cycloidal-ish profiles of watch wheels. */
export function gearShape({
  teeth,
  module,
  bore = 0,
  spokes = 0,
  rim,
  hub,
}: GearOptions): THREE.Shape {
  const pitch = (module * teeth) / 2;
  const tip = pitch + module * 1.1;
  const root = pitch - module * 1.4;
  const shape = new THREE.Shape();
  const pitchAngle = TAU / teeth;
  const toothHalf = pitchAngle * 0.22;
  const tipHalf = pitchAngle * 0.12;
  for (let i = 0; i < teeth; i++) {
    const a = i * pitchAngle;
    const p = (r: number, ang: number) => [Math.cos(ang) * r, Math.sin(ang) * r] as const;
    const [x0, y0] = p(root, a - pitchAngle / 2);
    const [x1, y1] = p(root, a - toothHalf * 1.3);
    const [x2, y2] = p(tip * 0.985, a - tipHalf);
    const [cx, cy] = p(tip, a);
    const [x3, y3] = p(tip * 0.985, a + tipHalf);
    const [x4, y4] = p(root, a + toothHalf * 1.3);
    if (i === 0) shape.moveTo(x0, y0);
    else shape.lineTo(x0, y0);
    shape.lineTo(x1, y1);
    shape.lineTo(x2, y2);
    shape.quadraticCurveTo(cx, cy, x3, y3);
    shape.lineTo(x4, y4);
  }
  shape.closePath();

  if (spokes > 0) {
    const rimInner = root - (rim ?? Math.max(module * 4, pitch * 0.12));
    const hubOuter = hub ?? Math.max(bore * 2.2, pitch * 0.22);
    const spokeHalf = Math.asin(Math.min(0.9, (pitch * 0.07) / hubOuter));
    for (let s = 0; s < spokes; s++) {
      const start = (s / spokes) * TAU;
      const end = ((s + 1) / spokes) * TAU;
      const hole = new THREE.Path();
      const outerHalf = Math.asin(Math.min(0.9, (pitch * 0.07) / rimInner));
      hole.absarc(0, 0, rimInner, start + outerHalf, end - outerHalf, false);
      hole.absarc(0, 0, hubOuter, end - spokeHalf, start + spokeHalf, true);
      hole.closePath();
      shape.holes.push(hole);
    }
  }
  if (bore > 0) {
    const hole = new THREE.Path();
    hole.absarc(0, 0, bore, 0, TAU, true);
    shape.holes.push(hole);
  }
  return shape;
}

/** Swiss club-tooth escape wheel: hooked teeth whose flat "club" tips carry the impulse face. */
export function escapeWheelShape(teeth: number, radius: number): THREE.Shape {
  const root = radius * 0.7;
  const shape = new THREE.Shape();
  const step = TAU / teeth;
  const p = (r: number, a: number) => [Math.cos(a) * r, Math.sin(a) * r] as const;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const [rx, ry] = p(root, a);
    const [lx, ly] = p(radius, a + step * 0.28); // locking corner, leaning forward
    const [cx, cy] = p(radius * 0.96, a + step * 0.42); // club
    const [bx, by] = p(root * 1.05, a + step * 0.5);
    if (i === 0) shape.moveTo(rx, ry);
    else shape.lineTo(rx, ry);
    shape.lineTo(lx, ly);
    shape.lineTo(cx, cy);
    shape.quadraticCurveTo(...p(root * 1.2, a + step * 0.62), bx, by);
    shape.lineTo(...p(root, a + step));
  }
  shape.closePath();
  const spokes = 4;
  const inner = root * 0.72;
  const hub = radius * 0.2;
  for (let s = 0; s < spokes; s++) {
    const hole = new THREE.Path();
    const start = (s / spokes) * TAU + 0.28;
    const end = ((s + 1) / spokes) * TAU - 0.28;
    hole.absarc(0, 0, inner, start, end, false);
    hole.absarc(0, 0, hub * 1.6, end - 0.12, start + 0.12, true);
    hole.closePath();
    shape.holes.push(hole);
  }
  return shape;
}

/** Pallet fork seen from above with its pivot at the origin; +x points at the balance. */
export function palletShape(): THREE.Shape {
  const s = new THREE.Shape();
  // Fork horns and lever body towards the balance
  s.moveTo(2.15, 0.32);
  s.lineTo(2.35, 0.22);
  s.lineTo(2.35, 0.1);
  s.lineTo(1.95, 0.1);
  s.lineTo(1.95, -0.1);
  s.lineTo(2.35, -0.1);
  s.lineTo(2.35, -0.22);
  s.lineTo(2.15, -0.32);
  s.lineTo(0.45, -0.14);
  // Exit arm
  s.lineTo(-0.25, -0.35);
  s.lineTo(-0.95, -1.35);
  s.lineTo(-1.2, -1.2);
  s.lineTo(-0.55, -0.2);
  // Entry arm
  s.lineTo(-0.55, 0.2);
  s.lineTo(-1.2, 1.2);
  s.lineTo(-0.95, 1.35);
  s.lineTo(-0.25, 0.35);
  s.lineTo(0.45, 0.14);
  s.closePath();
  const bore = new THREE.Path();
  bore.absarc(0, 0, 0.12, 0, TAU, true);
  s.holes.push(bore);
  return s;
}

/** Balance wheel rim with two arms. */
export function balanceShape(radius: number): THREE.Shape {
  const s = new THREE.Shape();
  s.absarc(0, 0, radius, 0, TAU, false);
  const rimWidth = radius * 0.1;
  const inner = radius - rimWidth;
  const arm = 0.22;
  const armAngle = Math.asin(arm / inner);
  for (const base of [0, Math.PI]) {
    const hole = new THREE.Path();
    hole.absarc(0, 0, inner, base + armAngle, base + Math.PI - armAngle, false);
    hole.absarc(0, 0, 0.5, base + Math.PI - 0.5, base + 0.5, true);
    hole.closePath();
    s.holes.push(hole);
  }
  return s;
}

/** Rounded outline enclosing a set of circles: how bridges are drawn around the pivots they carry. */
export function hullShape(circles: readonly { c: Vec2; r: number }[], segments = 28): THREE.Shape {
  const pts: [number, number][] = [];
  for (const { c, r } of circles) {
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * TAU;
      pts.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]);
    }
  }
  const hull = convexHull(pts);
  const shape = new THREE.Shape();
  hull.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
  shape.closePath();
  return shape;
}

function convexHull(points: [number, number][]): [number, number][] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const pt of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, pt) <= 0)
      lower.pop();
    lower.push(pt);
  }
  const upper: [number, number][] = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const pt = p[i]!;
    while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, pt) <= 0)
      upper.pop();
    upper.push(pt);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

/** Half-moon oscillating weight with the heavy segment on the outside. */
export function rotorShape(radius: number): THREE.Shape {
  const s = new THREE.Shape();
  const hub = 1.6;
  s.absarc(0, 0, radius, Math.PI * 1.02, Math.PI * 1.98, false);
  s.absarc(0, 0, hub, Math.PI * 1.98 + 0.9, Math.PI * 1.02 - 0.9, false);
  s.closePath();
  // Openings that lighten the inner part so the mass sits on the rim
  for (const [a0, a1] of [
    [1.12, 1.42],
    [1.58, 1.88],
  ] as const) {
    const hole = new THREE.Path();
    hole.absarc(0, 0, radius * 0.72, Math.PI * a0, Math.PI * a1, false);
    hole.absarc(0, 0, hub * 1.9, Math.PI * a1 - 0.05, Math.PI * a0 + 0.05, true);
    hole.closePath();
    s.holes.push(hole);
  }
  return s;
}

export function ringShape(outer: number, inner: number): THREE.Shape {
  const s = new THREE.Shape();
  s.absarc(0, 0, outer, 0, TAU, false);
  const h = new THREE.Path();
  h.absarc(0, 0, inner, 0, TAU, true);
  s.holes.push(h);
  return s;
}

export function extrude(
  shape: THREE.Shape,
  depth: number,
  bevel = 0,
  curveSegments = 24,
): THREE.ExtrudeGeometry {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments,
  });
  // Centre the solid on its mid-plane so z positions in the plan refer to the middle of each part
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

/** Points of an Archimedean hairspring; the inner coils turn with the balance, the outer end stays pinned. */
export function hairspringPoints(
  turns: number,
  inner: number,
  outer: number,
  twist: number,
  out: Float32Array,
): Float32Array {
  const count = out.length / 3;
  for (let i = 0; i < count; i++) {
    const s = i / (count - 1);
    const r = inner + (outer - inner) * s;
    const a = s * turns * TAU + twist * (1 - s);
    out[i * 3] = Math.cos(a) * r;
    out[i * 3 + 1] = Math.sin(a) * r;
    out[i * 3 + 2] = 0;
  }
  return out;
}
