"use client";

import { Pause, Play, Plus, Snail, Volume2, VolumeX } from "lucide-react";
import type { AnimationPlaybackControls, MotionValue } from "motion/react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useAnimationFrame,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { LayerId, LayerSpec } from "../calibre";
import { LAYERS, REFERENCE_CALIBRE } from "../calibre";
import { useTicking } from "../use-ticking";
import { ChronographPanel } from "./chronograph-panel";
import {
  BridgesLayer,
  CaseLayer,
  CasebackLayer,
  MovementDefs,
  PlateLayer,
  RegulatorLayer,
  RotorLayer,
  TrainLayer,
} from "./movement-art";
import styles from "./movement.module.css";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const LAYER_GAP = 112;
const PINS_FROM = 0.82;

interface LayerProps {
  spec: LayerSpec;
  progress: MotionValue<number>;
  dimmed: boolean;
  anchorRef: (node: HTMLSpanElement | null) => void;
  children: React.ReactNode;
}

function Layer({ spec, progress, dimmed, anchorRef, children }: LayerProps) {
  const isCaseback = spec.id === "caseback";
  const z = useTransform(progress, (p) => {
    // A small constant offset keeps coplanar layers from z-fighting while assembled
    const spread = spec.depth * 0.6 + clamp01((p - 0.3) / 0.7) * (spec.depth - 3) * LAYER_GAP;
    return isCaseback ? spread + clamp01(p / 0.3) * 280 : spread;
  });
  const rotateZ = useTransform(progress, (p) => (isCaseback ? -70 * clamp01(p / 0.3) : 0));
  const opacity = useTransform(progress, (p) => (isCaseback ? 1 - clamp01((p - 0.14) / 0.16) : 1));

  return (
    <motion.div
      className={cn("pointer-events-none absolute inset-0", dimmed && "[&>div]:opacity-25")}
      style={{ z, rotateZ, opacity, transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 transition-opacity duration-500">{children}</div>
      {spec.pin && (
        <span
          ref={anchorRef}
          aria-hidden
          className="absolute size-px"
          style={{ left: `${spec.pin.x / 8}%`, top: `${spec.pin.y / 8}%` }}
        />
      )}
    </motion.div>
  );
}

/**
 * Pins live in a flat overlay, positioned every frame from anchors inside the 3D layers,
 * so upper layers never hide them and they stay round instead of tilting with the stack.
 */
function usePinTracking(stageRef: React.RefObject<HTMLDivElement | null>) {
  const anchors = useRef(new Map<LayerId, HTMLSpanElement>());
  const pins = useRef(new Map<LayerId, HTMLDivElement>());

  useAnimationFrame(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const origin = stage.getBoundingClientRect();
    for (const [id, pin] of pins.current) {
      const anchor = anchors.current.get(id);
      if (!anchor) continue;
      const rect = anchor.getBoundingClientRect();
      pin.style.transform = `translate(${rect.left - origin.left}px, ${rect.top - origin.top}px)`;
    }
  });

  const register =
    <T extends HTMLElement>(map: React.RefObject<Map<LayerId, T>>, id: LayerId) =>
    (node: T | null) => {
      if (node) map.current.set(id, node);
      else map.current.delete(id);
    };

  return {
    anchorRef: (id: LayerId) => register(anchors, id),
    pinRef: (id: LayerId) => register(pins, id),
  };
}

export function MovementShowcase() {
  const reducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const [value, setValue] = useState(0);
  const [active, setActive] = useState<LayerId | null>(null);
  const [running, setRunning] = useState(true);
  const [slowMotion, setSlowMotion] = useState(false);
  const [sound, setSound] = useState(false);
  const [columnStep, setColumnStep] = useState(0);
  const [chronoRunning, setChronoRunning] = useState(false);
  const playback = useRef<AnimationPlaybackControls | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { anchorRef, pinRef } = usePinTracking(stageRef);

  useTicking(sound && running, slowMotion ? 1 : REFERENCE_CALIBRE.beatsPerSecond);

  useMotionValueEvent(progress, "change", (p) => {
    setValue(p);
    if (p < PINS_FROM) setActive(null);
  });

  // Opening sequence: unscrew the caseback, then fan the movement out layer by layer
  useEffect(() => {
    if (reducedMotion) {
      progress.set(1);
      return;
    }
    playback.current = animate(progress, 1, { duration: 4.2, delay: 0.7, ease: [0.65, 0, 0.35, 1] });
    return () => playback.current?.stop();
  }, [progress, reducedMotion]);

  const tilt = useTransform(progress, (p) => clamp01((p - 0.15) / 0.5));
  const pointerX = useSpring(0, { stiffness: 70, damping: 18 });
  const pointerY = useSpring(0, { stiffness: 70, damping: 18 });
  const rotateX = useTransform(() => 56 * tilt.get() - (reducedMotion ? 0 : pointerY.get() * 8));
  const rotateZ = useTransform(() => -30 * tilt.get() + (reducedMotion ? 0 : pointerX.get() * 6));
  const scale = useTransform(tilt, (t) => 1 - 0.27 * t);
  // The stack grows towards the viewer, so the open movement sits a little lower
  const y = useTransform(tilt, (t) => `${t * 9}%`);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const scrubTo = (target: number) => {
    playback.current?.stop();
    progress.set(target);
  };

  const toggleOpen = () => {
    playback.current?.stop();
    playback.current = animate(progress, value > 0.5 ? 0 : 1, {
      duration: reducedMotion ? 0 : 2.4,
      ease: [0.65, 0, 0.35, 1],
    });
  };

  const pinsEnabled = value >= PINS_FROM;
  const current = LAYERS.find((layer) => layer.id === active);
  const art: Record<LayerId, React.ReactNode> = {
    case: <CaseLayer />,
    plate: <PlateLayer />,
    train: <TrainLayer />,
    regulator: <RegulatorLayer columnStep={columnStep} chronoRunning={chronoRunning} />,
    bridges: <BridgesLayer />,
    rotor: <RotorLayer />,
    caseback: <CasebackLayer />,
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        ref={stageRef}
        className={cn("studio-light relative aspect-square w-full touch-pan-y select-none", styles.stage)}
        style={
          {
            perspective: "1800px",
            "--tempo": slowMotion ? 10 : 1,
            "--run": running ? "running" : "paused",
          } as CSSProperties
        }
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
      >
        <MovementDefs />
        <motion.div
          role="img"
          aria-label={`موومنت الهام‌گرفته از ${REFERENCE_CALIBRE.name}، با ${REFERENCE_CALIBRE.jewels} یاقوت و بسامد ${REFERENCE_CALIBRE.frequencyVph} ضربان در ساعت`}
          className="absolute inset-[6%]"
          style={{ rotateX, rotateZ, scale, y, transformStyle: "preserve-3d" }}
        >
          {LAYERS.map((spec) => (
            <Layer
              key={spec.id}
              spec={spec}
              progress={progress}
              dimmed={active !== null && active !== spec.id}
              anchorRef={anchorRef(spec.id)}
            >
              {art[spec.id]}
            </Layer>
          ))}
        </motion.div>

        {/* Physical `left`: positions come from getBoundingClientRect, which is not direction-aware */}
        {LAYERS.filter((spec) => spec.pin).map((spec, index) => (
          <div key={spec.id} ref={pinRef(spec.id)} className="absolute top-0 left-0 will-change-transform">
            <Button
              type="button"
              size="icon-sm"
              tabIndex={pinsEnabled ? 0 : -1}
              aria-hidden={!pinsEnabled}
              aria-label={`${spec.title}: ${spec.fact}`}
              aria-pressed={active === spec.id}
              onClick={() => setActive(active === spec.id ? null : spec.id)}
              className={cn(
                "bg-gold text-gold-foreground ring-gold/30 hover:bg-gold -translate-x-1/2 -translate-y-1/2 rounded-full text-sm font-medium shadow-lg ring-4 transition-[opacity,box-shadow] duration-500 hover:ring-8",
                pinsEnabled ? "opacity-100" : "pointer-events-none opacity-0",
                active === spec.id && "ring-8",
              )}
            >
              {active === spec.id ? <Plus className="rotate-45" /> : formatNumber(index + 1)}
            </Button>
          </div>
        ))}

        <AnimatePresence>
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-gold/30 bg-card/95 absolute inset-x-4 bottom-2 mx-auto flex max-w-sm flex-col gap-1 border p-4 backdrop-blur"
              role="status"
            >
              <p className="eyebrow">{current.title}</p>
              <p className="font-display text-2xl">{current.fact}</p>
              <p className="text-muted-foreground text-sm leading-7">{current.detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>بسته</span>
          <span className="text-gold font-mono tabular-nums" dir="ltr">
            {Math.round(value * 100)}%
          </span>
          <span>باز</span>
        </div>
        <Slider
          value={[value * 100]}
          min={0}
          max={100}
          step={0.5}
          aria-label="میزان باز شدن موومنت"
          onValueChange={([next]) => scrubTo((next ?? 0) / 100)}
        />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button type="button" variant="outline" onClick={toggleOpen} className="border-gold/40 text-gold rounded-none">
            {value > 0.5 ? "بستن درِ پشت" : "باز کردن موومنت"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setRunning((state) => !state)}
            aria-label={running ? "توقف حرکت" : "ادامه‌ی حرکت"}
          >
            {running ? <Pause /> : <Play />}
          </Button>
          <Toggle
            pressed={slowMotion}
            onPressedChange={setSlowMotion}
            aria-label="حرکت آهسته (ده برابر)"
            title="حرکت آهسته (ده برابر)"
          >
            <Snail />
          </Toggle>
          <Toggle pressed={sound} onPressedChange={setSound} aria-label="صدای تیک‌تاک" title="صدای تیک‌تاک">
            {sound ? <Volume2 /> : <VolumeX />}
          </Toggle>
        </div>
        <ChronographPanel
          running={chronoRunning}
          onRunningChange={setChronoRunning}
          onPush={() => setColumnStep((step) => step + 1)}
        />
      </div>
    </div>
  );
}
