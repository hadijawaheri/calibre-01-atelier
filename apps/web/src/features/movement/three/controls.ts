import type { PartId } from "../parts";

/** Mutable state read every frame; React state would re-render the whole scene 60 times a second. */
export interface MovementControls {
  /** 0 = assembled, 1 = fully taken apart. */
  explode: number;
  /** 0..1 lifts only the bridges, winding works and rotor away, leaving the train running in place. */
  lift: number;
  /** 1 = real time; 0 freezes the movement. */
  timeScale: number;
  energy: boolean;
  selected: PartId | null;
  hovered: PartId | null;
  /** Extra rotor turns requested by the winding control. */
  windTurns: number;
  /** 0..1 while the crown is being turned by hand. */
  crownWinding: number;
  /** When set, the camera glides to this view instead of following the orbit controls. */
  view: { position: [number, number, number]; target: [number, number, number] } | null;
}

export const createControls = (overrides: Partial<MovementControls> = {}): MovementControls => ({
  explode: 0,
  lift: 0,
  timeScale: 1,
  energy: false,
  selected: null,
  hovered: null,
  windTurns: 0,
  crownWinding: 0,
  view: null,
  ...overrides,
});
