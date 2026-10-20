import { describe, expect, it } from "vitest";

import { gearOutline, meshedPeriod, ring, spiral, star, wheelPath } from "./geometry";

const countCommands = (path: string, command: string) =>
  path.split("").filter((ch) => ch === command).length;

describe("movement geometry", () => {
  it("draws four vertices per tooth and closes the outline", () => {
    const path = gearOutline({ cx: 0, cy: 0, teeth: 12, outer: 10, root: 8 });
    expect(countCommands(path, "M")).toBe(1);
    expect(countCommands(path, "L")).toBe(12 * 4 - 1);
    expect(path.endsWith("Z")).toBe(true);
  });

  it("keeps every vertex between the root and outer radius", () => {
    const path = gearOutline({ cx: 100, cy: 100, teeth: 20, outer: 50, root: 44 });
    const numbers = path.match(/-?\d+(\.\d+)?/g)!.map(Number);
    for (let i = 0; i < numbers.length; i += 2) {
      const r = Math.hypot(numbers[i]! - 100, numbers[i + 1]! - 100);
      expect(r).toBeGreaterThan(43.9);
      expect(r).toBeLessThan(50.1);
    }
  });

  it("rejects impossible gears", () => {
    expect(() => gearOutline({ cx: 0, cy: 0, teeth: 2, outer: 10, root: 8 })).toThrow();
    expect(() => gearOutline({ cx: 0, cy: 0, teeth: 10, outer: 8, root: 8 })).toThrow();
  });

  it("adds one window per spoke", () => {
    const path = wheelPath({ cx: 0, cy: 0, teeth: 30, outer: 40, root: 37, spokes: 5, hub: 8, rim: 32 });
    expect(countCommands(path, "M")).toBe(1 + 5);
  });

  it("builds stars, spirals and rings", () => {
    expect(countCommands(star(0, 0, 10, 4, 5), "L")).toBe(9);
    expect(spiral(0, 0, 2, 20, 6).startsWith("M")).toBe(true);
    expect(ring(0, 0, 10, 4)[1]).toEqual({ x: 0, y: 10 });
  });

  it("derives a driven wheel's period from the tooth ratio", () => {
    expect(meshedPeriod(60, 80, 10)).toBe(7.5);
  });
});
