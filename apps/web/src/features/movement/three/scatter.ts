/* How an assembly flies apart: up by its layer and outwards from the movement's centre, with a slight
   tumble, like a watchmaker's exploded drawing rather than a stack of pancakes. */

export const LAYER_GAP = 2.4;
const RADIAL_BASE = 2.2;
const RADIAL_GAIN = 0.55;
const TILT = 0.2;

export interface Scatter {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
}

/** A stable pseudo-random angle per assembly, so the explode looks the same on every visit. */
export function seedOf(name: string) {
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) h = Math.imul(h ^ name.charCodeAt(i), 16777619);
  return ((h >>> 0) / 2 ** 32) * Math.PI * 2;
}

export function scatter(
  centre: readonly [number, number],
  layer: number,
  seed: number,
  explode: number,
  out: Scatter,
): Scatter {
  const r = Math.hypot(centre[0], centre[1]);
  // Parts on the axis (plate, dial, rotor) have no outward direction of their own; they only rise
  const dx = r > 0.8 ? centre[0] / r : 0;
  const dy = r > 0.8 ? centre[1] / r : 0;
  const reach = explode * (RADIAL_BASE + r * RADIAL_GAIN);
  out.x = dx * reach;
  out.y = dy * reach;
  out.z = layer * LAYER_GAP * explode;
  const tilt = r > 0.8 ? TILT * explode : TILT * 0.25 * explode;
  out.rx = Math.sin(seed) * tilt;
  out.ry = Math.cos(seed * 1.7) * tilt;
  return out;
}
