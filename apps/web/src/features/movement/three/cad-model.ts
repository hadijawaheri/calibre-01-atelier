import type { PartId } from "../parts";
import type { MovementMaterials } from "./materials";

export type CadSpin =
  "barrel" | "centre" | "third" | "fourth" | "escape" | "pallet" | "balance" | "rotor";

/** Maps the parts of a converted CAD movement (scripts/step-to-glb.mjs) onto the lab's parts. */
export interface CadRule {
  /** Case-insensitive regular expression tested against CAD node names; the first rule that matches wins. */
  match: string;
  part: PartId;
  /** Explode layer: 0 is the main plate, higher floats further from it. */
  layer: number;
  /** Replaces the CAD colour with one of the lab's finished materials. */
  material?: keyof MovementMaterials;
  /** Turns around its own axis with this arbor of the going train. */
  spin?: CadSpin;
}

export interface CadModel {
  url: string;
  rules: CadRule[];
  /** Euler angles (radians) that put the caseback towards +z. */
  rotation?: [number, number, number];
  /** Brings the file to millimetres when it was exported in other units. */
  scale?: number;
  /** Parts no rule names fall back to this. */
  fallback: Omit<CadRule, "match">;
}
