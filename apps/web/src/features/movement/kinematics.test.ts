import { describe, expect, it } from "vitest";

import { BARREL_TURNS_FULL, ESCAPE_STEP, periodOf, trainPose } from "./kinematics";

describe("going train", () => {
  it("turns the fourth wheel once a minute so it can carry the seconds hand", () => {
    expect(periodOf("fourth")).toBeCloseTo(60, 6);
  });

  it("turns the centre wheel once an hour", () => {
    expect(periodOf("centre")).toBeCloseTo(3600, 6);
  });

  it("turns the escape wheel 16 times a minute at 28,800 vph", () => {
    expect(60 / periodOf("escape")).toBeCloseTo(16, 6);
  });

  it("gives about five and a half barrel turns of reserve", () => {
    expect(BARREL_TURNS_FULL).toBeGreaterThan(5);
    expect(BARREL_TURNS_FULL).toBeLessThan(6);
  });

  it("advances the escape wheel half a tooth per beat and then locks", () => {
    const locked = trainPose(0.124);
    const nextLocked = trainPose(0.249);
    expect(nextLocked.escapeTurns - locked.escapeTurns).toBeCloseTo(ESCAPE_STEP, 9);
    // During the locked part of the beat nothing in the train moves
    expect(trainPose(0.1).escapeTurns).toBeCloseTo(trainPose(0.12).escapeTurns, 9);
  });

  it("flips the lever from one banking to the other every beat", () => {
    expect(Math.sign(trainPose(0.1).pallet)).toBe(-Math.sign(trainPose(0.2).pallet));
  });

  it("counter-rotates meshing wheels", () => {
    const { arbors } = trainPose(10.1);
    expect(Math.sign(arbors.escape)).toBe(-Math.sign(arbors.fourth));
    expect(Math.sign(arbors.fourth)).toBe(-Math.sign(arbors.third));
    expect(Math.sign(arbors.third)).toBe(-Math.sign(arbors.centre));
  });
});
