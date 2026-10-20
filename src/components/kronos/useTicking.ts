import { useEffect, useRef } from "react";

/** Synthesises a soft 4Hz (8 beats/s) mechanical tick via Web Audio. */
export function useTicking(on: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (!on) return;
    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    void ctx.resume();
    let beat = 0;
    const id = window.setInterval(() => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = beat++ % 2 ? 3200 : 2600;
      g.gain.setValueAtTime(0.05, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.03);
    }, 125);
    return () => window.clearInterval(id);
  }, [on]);
}
