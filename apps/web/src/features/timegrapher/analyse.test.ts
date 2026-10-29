import { describe, expect, it } from "vitest";

import { detectBeats, measure, nearestBph } from "./analyse";

const SAMPLE_RATE = 48_000;

/** A recording of a watch: a short ringing click per beat over a little hiss, seeded so it never flakes. */
function recording({
  bph,
  rate = 0,
  beatError = 0,
  seconds = 10,
  noise = 0.01,
  skip = new Set<number>(),
}: {
  bph: number;
  rate?: number;
  beatError?: number;
  seconds?: number;
  noise?: number;
  skip?: Set<number>;
}) {
  const samples = new Float32Array(seconds * SAMPLE_RATE);
  let seed = 7;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  for (let i = 0; i < samples.length; i++) samples[i] = random() * noise;

  const period = 3600 / bph / (1 + rate / 86_400);
  const times: number[] = [];
  for (let k = 0; ; k++) {
    const time = 0.05 + k * period + ((k % 2 ? -1 : 1) * beatError) / 2000;
    if (time > seconds - 0.05) break;
    if (skip.has(k)) continue;
    times.push(time);
    const at = Math.round(time * SAMPLE_RATE);
    for (let i = 0; i < 0.004 * SAMPLE_RATE; i++) {
      const t = i / SAMPLE_RATE;
      samples[at + i]! += 0.6 * Math.exp(-t / 0.0008) * Math.sin(2 * Math.PI * 4000 * t);
    }
  }
  return { samples, times };
}

describe("detectBeats", () => {
  it("finds every click once, within a fraction of a millisecond", () => {
    const { samples, times } = recording({ bph: 28_800 });
    const beats = detectBeats(samples, SAMPLE_RATE);
    expect(beats).toHaveLength(times.length);
    beats.forEach((beat, index) => expect(Math.abs(beat - times[index]!)).toBeLessThan(0.0005));
  });

  it("finds nothing in silence or hiss", () => {
    expect(detectBeats(new Float32Array(SAMPLE_RATE), SAMPLE_RATE)).toEqual([]);
    let seed = 11;
    const hiss = Float32Array.from(
      { length: 2 * SAMPLE_RATE },
      () => (((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1) * 0.01,
    );
    expect(nearestBph(detectBeats(hiss, SAMPLE_RATE))).toBeNull();
  });
});

describe("nearestBph", () => {
  it.each([18_000, 21_600, 28_800, 36_000])("recognises %i bph", (bph) => {
    const { times } = recording({ bph, rate: 30 });
    expect(nearestBph(times)).toBe(bph);
  });

  it("gives up on beats that fit no standard rate", () => {
    expect(nearestBph([0, 0.15, 0.3, 0.45, 0.6])).toBeNull();
  });
});

describe("measure", () => {
  it.each([
    { bph: 28_800, rate: 6, beatError: 0.4 },
    { bph: 21_600, rate: -12, beatError: 1.2 },
    { bph: 18_000, rate: 0, beatError: 0 },
  ])("reads $rate s/d and $beatError ms at $bph bph", ({ bph, rate, beatError }) => {
    const { samples } = recording({ bph, rate, beatError, seconds: 20 });
    const result = measure(detectBeats(samples, SAMPLE_RATE));
    expect(result?.bph).toBe(bph);
    expect(result!.rate).toBeCloseTo(rate, 0);
    expect(Math.abs(result!.beatError - beatError)).toBeLessThan(0.05);
  });

  it("keeps the count right across a missed beat", () => {
    const { samples } = recording({ bph: 28_800, rate: 5, seconds: 20, skip: new Set([40, 41]) });
    const result = measure(detectBeats(samples, SAMPLE_RATE));
    expect(result!.rate).toBeCloseTo(5, 0);
  });

  it("needs a few beats before it says anything", () => {
    expect(measure([0, 0.125, 0.25])).toBeNull();
  });
});
