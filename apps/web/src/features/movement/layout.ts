/* Plan of the automatic calibre in millimetres, seen from the caseback (+z towards the viewer).
   Arbor positions were solved so that every wheel meshes its pinion at the exact centre distance
   (module × (z₁ + z₂) / 2) and no arbor passes through another wheel. */
import { TRAIN } from "./kinematics";

export type Vec2 = readonly [number, number];

export const MOVEMENT_RADIUS = 12.8; // ⌀ 25.6 mm, the size class of the classic Swiss automatics

/** Module (mm) of each mesh: tooth size, which sets the centre distance of a wheel and its pinion. */
export const MODULE = {
  barrelToCentre: 0.12,
  centreToThird: 0.1,
  thirdToFourth: 0.085,
  fourthToEscape: 0.065,
} as const;

export const pitchRadius = (module: number, teeth: number) => (module * teeth) / 2;

export const ARBOR: Record<
  "barrel" | "centre" | "third" | "fourth" | "escape" | "pallet" | "balance",
  Vec2
> = {
  fourth: [0, 0], // central seconds
  escape: [2.578, -2.084],
  pallet: [4.716, -0.994],
  balance: [7.504, 0.577],
  third: [0.438, 3.583],
  centre: [-3.986, 4.409],
  barrel: [-6.934, -0.54],
};

/** Heights (z, mm) of each wheel's mid-plane above the main plate's base. */
export const Z = {
  dial: -0.9,
  hands: -1.5,
  plate: 0,
  plateTop: 1,
  barrel: 1.05,
  barrelHeight: 2.1,
  centre: 2.05,
  third: 2.45,
  fourth: 2.85,
  escape: 1.95,
  pallet: 1.95,
  balance: 3.25,
  hairspring: 2.95,
  bridge: 3.55,
  bridgeHeight: 0.6,
  cock: 3.75,
  ratchet: 4.18,
  reverser: 4.55,
  rotor: 5.05,
} as const;

export const WHEEL = {
  barrel: { teeth: TRAIN.barrel.wheel, module: MODULE.barrelToCentre },
  centre: {
    teeth: TRAIN.centre.wheel,
    module: MODULE.centreToThird,
    pinion: TRAIN.centre.pinion,
    pinionModule: MODULE.barrelToCentre,
  },
  third: {
    teeth: TRAIN.third.wheel,
    module: MODULE.thirdToFourth,
    pinion: TRAIN.third.pinion,
    pinionModule: MODULE.centreToThird,
  },
  fourth: {
    teeth: TRAIN.fourth.wheel,
    module: MODULE.fourthToEscape,
    pinion: TRAIN.fourth.pinion,
    pinionModule: MODULE.thirdToFourth,
  },
  escape: {
    teeth: TRAIN.escape.teeth,
    pinion: TRAIN.escape.pinion,
    pinionModule: MODULE.fourthToEscape,
  },
} as const;

export const BALANCE_RADIUS = 4.3;
export const ESCAPE_RADIUS = 1.9;
