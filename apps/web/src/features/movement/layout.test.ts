import { describe, expect, it } from "vitest";

import { ARBOR, MODULE, MOVEMENT_RADIUS, pitchRadius, WHEEL } from "./layout";

const distance = (a: readonly [number, number], b: readonly [number, number]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);

describe("calibre plan", () => {
  it.each([
    ["barrel", "centre", MODULE.barrelToCentre, WHEEL.barrel.teeth, WHEEL.centre.pinion],
    ["centre", "third", MODULE.centreToThird, WHEEL.centre.teeth, WHEEL.third.pinion],
    ["third", "fourth", MODULE.thirdToFourth, WHEEL.third.teeth, WHEEL.fourth.pinion],
    ["fourth", "escape", MODULE.fourthToEscape, WHEEL.fourth.teeth, WHEEL.escape.pinion],
  ] as const)(
    "meshes the %s wheel with the %s pinion at the exact centre distance",
    (a, b, m, z1, z2) => {
      expect(distance(ARBOR[a], ARBOR[b])).toBeCloseTo(pitchRadius(m, z1) + pitchRadius(m, z2), 2);
    },
  );

  it("keeps every arbor inside the movement", () => {
    for (const point of Object.values(ARBOR)) {
      expect(Math.hypot(...point)).toBeLessThan(MOVEMENT_RADIUS);
    }
  });
});
