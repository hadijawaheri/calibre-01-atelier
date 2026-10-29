/** The beat rates movements are built for, in beats (ticks and tocks) per hour. */
export const STANDARD_BPH = [18_000, 19_800, 21_600, 25_200, 28_800, 36_000] as const;

const SECONDS_PER_DAY = 86_400;

export interface Measurement {
  bph: number;
  /** Seconds gained (+) or lost (-) per day */
  rate: number;
  /** Milliseconds between where the tock falls and where it would fall with the tick exactly centred */
  beatError: number;
  /** Each beat's offset from a perfect clock in milliseconds, tick and tock alternating */
  points: { beat: number; offset: number }[];
  beats: number;
}

/**
 * Finds the beats in a recording: high-pass to drop hum and handling noise, a fast envelope, and an
 * adaptive threshold. After a beat the detector is deaf for most of the shortest possible beat
 * interval, which skips the echoes inside one tick.
 */
export function detectBeats(samples: Float32Array, sampleRate: number): number[] {
  // First-order high-pass near 1.5 kHz; the escapement's clicks are mostly above it
  const rc = 1 / (2 * Math.PI * 1500);
  const alpha = rc / (rc + 1 / sampleRate);
  const envelope = new Float32Array(samples.length);
  const decay = Math.exp(-1 / (0.002 * sampleRate));
  let previousIn = 0;
  let previousOut = 0;
  let level = 0;
  for (let i = 0; i < samples.length; i++) {
    const input = samples[i]!;
    const filtered = alpha * (previousOut + input - previousIn);
    previousIn = input;
    previousOut = filtered;
    level = Math.max(Math.abs(filtered), level * decay);
    envelope[i] = level;
  }

  // Percentiles from every few hundredth sample are close enough and keep a long window cheap
  const stride = Math.max(1, Math.floor(envelope.length / 50_000));
  const sorted = Float32Array.from(
    { length: Math.floor(envelope.length / stride) },
    (_, i) => envelope[i * stride]!,
  ).sort();
  const floor = sorted[Math.floor(sorted.length * 0.5)] ?? 0;
  const peak = sorted[Math.floor(sorted.length * 0.995)] ?? 0;
  if (peak <= floor * 2 || peak === 0) return [];
  const threshold = floor + (peak - floor) * 0.35;

  // 36,000 bph beats every 100 ms; stay deaf for 70 ms after each beat
  const deaf = Math.round(0.07 * sampleRate);
  const beats: number[] = [];
  for (let i = 1; i < envelope.length; i++) {
    if (envelope[i]! >= threshold && envelope[i - 1]! < threshold) {
      beats.push(i / sampleRate);
      i += deaf;
    }
  }
  return beats;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2;
}

/** The standard beat rate nearest to the median interval, or null when the beats fit none of them. */
export function nearestBph(beats: number[]): number | null {
  if (beats.length < 4) return null;
  const intervals = beats.slice(1).map((time, index) => time - beats[index]!);
  const bph = 3600 / median(intervals);
  const nearest = STANDARD_BPH.reduce((best, rate) =>
    Math.abs(rate - bph) < Math.abs(best - bph) ? rate : best,
  );
  // Anything more than 4% away is noise or missed beats, not a watch running fast or slow
  return Math.abs(nearest - bph) / nearest < 0.04 ? nearest : null;
}

/**
 * Fits the beats to a straight line against their index. The slope against the nominal period gives the
 * rate; the gap between where ticks and tocks sit on either side of the line gives the beat error.
 */
export function measure(beats: number[], bph = nearestBph(beats)): Measurement | null {
  if (!bph || beats.length < 6) return null;
  const period = 3600 / bph;
  const start = beats[0]!;
  // A missed beat skips an index rather than shifting every later beat by one
  const indexed = beats.map((time) => ({ index: Math.round((time - start) / period), time }));

  const n = indexed.length;
  const meanIndex = indexed.reduce((sum, beat) => sum + beat.index, 0) / n;
  const meanTime = indexed.reduce((sum, beat) => sum + beat.time, 0) / n;
  let covariance = 0;
  let variance = 0;
  for (const beat of indexed) {
    covariance += (beat.index - meanIndex) * (beat.time - meanTime);
    variance += (beat.index - meanIndex) ** 2;
  }
  if (variance === 0) return null;
  const slope = covariance / variance;
  const intercept = meanTime - slope * meanIndex;

  const residuals = indexed.map((beat) => ({
    beat: beat.index,
    offset: beat.time - (intercept + slope * beat.index),
  }));
  const meanOf = (parity: number) => {
    const group = residuals.filter((point) => point.beat % 2 === parity);
    return group.reduce((sum, point) => sum + point.offset, 0) / Math.max(group.length, 1);
  };

  return {
    bph,
    rate: ((period - slope) / slope) * SECONDS_PER_DAY,
    beatError: Math.abs(meanOf(0) - meanOf(1)) * 1000,
    // Against the nominal period, as a timegrapher draws it: a watch that gains climbs
    points: indexed.map((beat) => ({
      beat: beat.index,
      offset: (start + beat.index * period - beat.time) * 1000,
    })),
    beats: n,
  };
}
