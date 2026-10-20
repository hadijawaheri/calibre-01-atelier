import { useEffect, useRef } from "react";

/** Synthesises the escapement's tick-tock with Web Audio; starts only after a user gesture. */
export function useTicking(on: boolean, beatsPerSecond: number): void {
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!on) return;
    const context = contextRef.current ?? new AudioContext();
    contextRef.current = context;
    void context.resume();

    let beat = 0;
    const id = window.setInterval(() => {
      const t = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "square";
      // Tick and tock differ slightly, as the two pallet stones do
      oscillator.frequency.value = beat++ % 2 ? 3400 : 2700;
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(t);
      oscillator.stop(t + 0.025);
    }, 1000 / beatsPerSecond);

    return () => window.clearInterval(id);
  }, [on, beatsPerSecond]);

  useEffect(() => () => void contextRef.current?.close(), []);
}
