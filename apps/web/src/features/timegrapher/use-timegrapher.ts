import { useEffect, useRef, useState } from "react";

import type { Measurement } from "./analyse";
import { detectBeats, measure } from "./analyse";

/** How much recent sound each reading looks at; longer is steadier, shorter follows the watch faster. */
const WINDOW_SECONDS = 12;
const FIRST_READING_SECONDS = 3;

export type TimegrapherStatus =
  "idle" | "starting" | "listening" | "denied" | "unsupported" | "failed";

interface Capture {
  stream: MediaStream;
  context: AudioContext;
  timer: number;
}

export function useTimegrapher() {
  const [status, setStatus] = useState<TimegrapherStatus>("idle");
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [heard, setHeard] = useState(0);
  const capture = useRef<Capture | null>(null);

  const stop = () => {
    const current = capture.current;
    if (!current) return;
    capture.current = null;
    window.clearInterval(current.timer);
    for (const track of current.stream.getTracks()) track.stop();
    void current.context.close();
  };

  useEffect(() => stop, []);

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof AudioWorkletNode === "undefined") {
      setStatus("unsupported");
      return;
    }
    setStatus("starting");
    setMeasurement(null);
    setHeard(0);
    let stream: MediaStream;
    try {
      // The phone's voice processing would gate and smear the very clicks we are timing
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch (e: unknown) {
      setStatus(e instanceof DOMException && e.name === "NotAllowedError" ? "denied" : "failed");
      return;
    }
    const context = new AudioContext();
    try {
      await context.audioWorklet.addModule("/worklets/timegrapher-capture.js");
      const node = new AudioWorkletNode(context, "timegrapher-capture");
      // A silent path to the speakers keeps the browser pulling audio through the worklet
      const mute = context.createGain();
      mute.gain.value = 0;
      context
        .createMediaStreamSource(stream)
        .connect(node)
        .connect(mute)
        .connect(context.destination);

      const size = WINDOW_SECONDS * context.sampleRate;
      const buffer = new Float32Array(size);
      let written = 0;
      node.port.onmessage = (event: MessageEvent<Float32Array>) => {
        const block = event.data;
        // Slide the window along so it always ends with the newest sound
        if (block.length >= size) buffer.set(block.subarray(block.length - size));
        else {
          buffer.copyWithin(0, block.length);
          buffer.set(block, size - block.length);
        }
        written += block.length;
      };

      const timer = window.setInterval(() => {
        const filled = Math.min(written, size);
        setHeard(written / context.sampleRate);
        if (filled < FIRST_READING_SECONDS * context.sampleRate) return;
        const recent = buffer.subarray(size - filled);
        setMeasurement(measure(detectBeats(recent, context.sampleRate)));
      }, 1000);

      capture.current = { stream, context, timer };
      await context.resume();
      setStatus("listening");
    } catch {
      for (const track of stream.getTracks()) track.stop();
      void context.close();
      setStatus("failed");
    }
  };

  return {
    status,
    measurement,
    heard,
    start: () => void start(),
    stop: () => {
      stop();
      setStatus("idle");
    },
  };
}
