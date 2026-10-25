/* The going train of a 28,800 vph Swiss lever automatic, as numbers. Everything visible on screen is
   derived from one clock, the escapement count, so the wheels move in the same discrete steps a real
   train does: the escape wheel jumps half a tooth per beat and every other wheel follows by its ratio. */

export const BEATS_PER_HOUR = 28_800;
export const BEATS_PER_SECOND = BEATS_PER_HOUR / 3600; // 8
export const BALANCE_HZ = BEATS_PER_SECOND / 2; // one oscillation = two beats
export const ESCAPE_TEETH = 15;
/** Swiss lever: each beat releases half a tooth. */
export const ESCAPE_STEP = 1 / (ESCAPE_TEETH * 2);

/** Tooth counts. wheel → the pinion it drives. */
export const TRAIN = {
  barrel: { wheel: 84 },
  centre: { pinion: 12, wheel: 80 },
  third: { pinion: 10, wheel: 75 },
  fourth: { pinion: 10, wheel: 96 },
  escape: { pinion: 6, teeth: ESCAPE_TEETH },
} as const;

/** Revolutions of each arbor per revolution of the escape wheel; the sign alternates mesh by mesh. */
export const RATIO_FROM_ESCAPE = (() => {
  const fourth = -TRAIN.escape.pinion / TRAIN.fourth.wheel;
  const third = -fourth * (TRAIN.fourth.pinion / TRAIN.third.wheel);
  const centre = -third * (TRAIN.third.pinion / TRAIN.centre.wheel);
  const barrel = -centre * (TRAIN.centre.pinion / TRAIN.barrel.wheel);
  return { escape: 1, fourth, third, centre, barrel } as const;
})();

/** Balance amplitude in radians (≈ 270°, a healthy fully wound reading). */
export const BALANCE_AMPLITUDE = (270 * Math.PI) / 180;
/** Lever swing either side of the line of centres, from banking pin to banking pin. */
export const PALLET_SWING = (8 * Math.PI) / 180;
/** Share of a beat taken by unlocking, impulse and drop; the rest of the beat the train is locked. */
const IMPULSE_SHARE = 0.18;
/** Mainspring reserve in hours, typical for this class of calibre. */
export const POWER_RESERVE_HOURS = 38;

const TAU = Math.PI * 2;

const smoothstep = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

export interface TrainPose {
  /** Escape wheel turns (signed), stepping once per beat. */
  escapeTurns: number;
  /** Balance angle in radians. */
  balance: number;
  /** Lever angle in radians. */
  pallet: number;
  /** 0 → 1 while the impulse of the current beat is being delivered. */
  impulse: number;
  /** Angles in radians for each train arbor. */
  arbors: { escape: number; fourth: number; third: number; centre: number; barrel: number };
}

/** Pose of the escapement and train at simulated time `t` (seconds). */
export function trainPose(t: number): TrainPose {
  const beatPos = t * BEATS_PER_SECOND;
  const beat = Math.floor(beatPos);
  const within = beatPos - beat;
  const impulse = smoothstep(within / IMPULSE_SHARE);

  // The balance crosses its dead point at the start of each beat; that is when the lever is kicked over.
  const balance = BALANCE_AMPLITUDE * Math.sin(TAU * BALANCE_HZ * t);
  const side = beat % 2 === 0 ? 1 : -1;
  const pallet = PALLET_SWING * side * (2 * impulse - 1);

  const escapeTurns = (beat + impulse) * ESCAPE_STEP;
  const angle = (ratio: number) => -escapeTurns * ratio * TAU;
  return {
    escapeTurns,
    balance,
    pallet,
    impulse,
    arbors: {
      escape: angle(RATIO_FROM_ESCAPE.escape),
      fourth: angle(RATIO_FROM_ESCAPE.fourth),
      third: angle(RATIO_FROM_ESCAPE.third),
      centre: angle(RATIO_FROM_ESCAPE.centre),
      barrel: angle(RATIO_FROM_ESCAPE.barrel),
    },
  };
}

/** Seconds for one revolution of an arbor while running. */
export function periodOf(arbor: keyof typeof RATIO_FROM_ESCAPE): number {
  const escapeRevsPerSecond = BEATS_PER_SECOND * ESCAPE_STEP;
  return 1 / (escapeRevsPerSecond * Math.abs(RATIO_FROM_ESCAPE[arbor]));
}

/** Turns of the barrel from let down to fully wound. */
export const BARREL_TURNS_FULL = (POWER_RESERVE_HOURS * 3600) / periodOf("barrel");
