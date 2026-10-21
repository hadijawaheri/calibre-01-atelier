"use client";

import { Hand, Pause, Play, RotateCcw, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

import type { CalibreInfo } from "../calibres";
import type { PartGroup, PartId } from "../parts";
import { GROUP_LABELS, PART_BY_ID, PARTS } from "../parts";
import type { MovementControls } from "../three/controls";
import { createControls } from "../three/controls";
import { CalibreHowItWorks, CalibreSpecs, CalibreUsedIn } from "./calibre-facts";
import { MovementCanvas } from "./movement-canvas";

const SPEEDS = [
  { value: "1", label: "واقعی" },
  { value: "0.25", label: "۱/۴" },
  { value: "0.05", label: "۱/۲۰" },
  { value: "0", label: "توقف" },
] as const;

/** Parts that sit under the bridges: selecting one lifts the covers so it can be seen. */
const UNDER_COVERS = new Set<PartId>([
  "barrel",
  "centre",
  "third",
  "fourth",
  "escape",
  "pallet",
  "balance",
  "hairspring",
  "plate",
]);

const HOME_VIEW: NonNullable<MovementControls["view"]> = {
  position: [0, -60, 26],
  target: [0, 0, 0],
};
/** Wider and higher, so the floating parts stay in frame. */
const EXPLODED_VIEW: NonNullable<MovementControls["view"]> = {
  position: [18, -78, 38],
  target: [0, 0, 7],
};

/** The show: rest, come apart, float, come back together, rest. Seconds. */
const SHOW = { rest: 1.2, open: 2.6, float: 3, close: 2.4 };
const SHOW_LENGTH = SHOW.rest * 2 + SHOW.open + SHOW.float + SHOW.close;
const smooth = (x: number) => x * x * (3 - 2 * x);
function showExplode(t: number) {
  let k = t - SHOW.rest;
  if (k < 0) return 0;
  if (k < SHOW.open) return smooth(k / SHOW.open);
  k -= SHOW.open;
  if (k < SHOW.float) return 1;
  k -= SHOW.float;
  if (k < SHOW.close) return 1 - smooth(k / SHOW.close);
  return 0;
}

const GROUP_ORDER: PartGroup[] = [
  "winding",
  "energy",
  "train",
  "escapement",
  "regulator",
  "frame",
  "display",
];

export function MovementLab({ calibre }: { calibre: CalibreInfo }) {
  const controls = useRef<MovementControls>(createControls({ view: HOME_VIEW }));
  const [selected, setSelected] = useState<PartId | null>(null);
  const [explode, setExplode] = useState(0);
  const [lifted, setLifted] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [energy, setEnergy] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const c = controls.current;
    const started = performance.now();
    c.lift = 0;
    c.view = EXPLODED_VIEW;
    let frame = 0;
    const tick = (now: number) => {
      const t = (now - started) / 1000;
      if (t >= SHOW_LENGTH) {
        c.explode = 0;
        c.view = { ...HOME_VIEW };
        setExplode(0);
        setPlaying(false);
        return;
      }
      c.explode = showExplode(t);
      if (t > SHOW.rest + SHOW.open + SHOW.float) c.view = HOME_VIEW;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const select = (id: PartId | null) => {
    setSelected(id);
    controls.current.selected = id;
    if (id && UNDER_COVERS.has(id) && controls.current.explode < 0.3) {
      controls.current.lift = 1;
      setLifted(true);
    }
    if (id === "dial") {
      controls.current.view = { position: [0, 34, -48], target: [0, 0, -1] };
    }
  };

  const hover = (id: PartId | null) => {
    controls.current.hovered = id;
    document.body.style.cursor = id ? "pointer" : "";
  };

  const changeExplode = (value: number) => {
    setPlaying(false);
    setExplode(value);
    controls.current.explode = value;
  };

  const toggleLift = (value: boolean) => {
    setLifted(value);
    controls.current.lift = value ? 1 : 0;
  };

  const changeSpeed = (value: string) => {
    if (!value) return;
    setSpeed(value);
    controls.current.timeScale = Number(value);
  };

  const toggleEnergy = (value: boolean) => {
    setEnergy(value);
    controls.current.energy = value;
  };

  const winding = (on: boolean) => {
    controls.current.crownWinding = on ? 1 : 0;
  };

  const reset = () => {
    setPlaying(false);
    select(null);
    changeExplode(0);
    toggleLift(false);
    changeSpeed("1");
    toggleEnergy(false);
    controls.current.view = { ...HOME_VIEW };
  };

  const detail = selected ? PART_BY_ID[selected] : null;

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className="relative h-[58dvh] lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)]">
        <MovementCanvas
          controls={controls}
          cad={calibre.cad}
          orbit
          onSelect={select}
          onHover={hover}
          onOrbitStart={() => {
            controls.current.view = null;
          }}
          className="absolute inset-0"
        />
        <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-muted-foreground">
          بکشید تا بچرخد · روی قطعه‌ها کلیک کنید
        </p>
      </div>

      <aside aria-label="کنترل‌ها و قطعه‌ها" className="border-border bg-surface/60 lg:border-s">
        <div className="flex flex-col gap-6 p-5 sm:p-6">
          <header className="flex flex-col gap-2">
            <p className="eyebrow">آزمایشگاه موومنت</p>
            <h1 className="text-2xl font-semibold">{calibre.name}</h1>
            <p className="text-sm text-muted-foreground">
              <span dir="ltr">{calibre.reference}</span>
            </p>
          </header>

          <section
            aria-live="polite"
            className="min-h-40 rounded-lg border border-border bg-card p-4"
          >
            {detail ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg font-semibold">{detail.name}</h2>
                  <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                    {detail.nameEn}
                  </span>
                </div>
                <p className="text-sm font-medium text-gold">{detail.role}</p>
                <p className="text-sm leading-7 text-muted-foreground">{detail.body}</p>
                {detail.fact && (
                  <p className="flex items-baseline gap-2 border-t border-border pt-3">
                    <span className="text-xl font-semibold">{detail.fact.value}</span>
                    <span className="text-xs text-muted-foreground">{detail.fact.label}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">یک قطعه انتخاب کنید</h2>
                <p className="text-sm leading-7 text-muted-foreground">{calibre.summary}</p>
              </div>
            )}
          </section>

          <section aria-label="کنترل‌ها" className="flex flex-col gap-5">
            <Button onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
              {playing ? <Pause data-icon="inline-start" /> : <Play data-icon="inline-start" />}
              {playing ? "توقف نمایش" : "نمایش باز و بسته شدن"}
            </Button>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="explode">جدا کردن قطعه‌ها</Label>
                <span className="font-mono text-xs text-muted-foreground">
                  {Math.round(explode * 100)}٪
                </span>
              </div>
              <Slider
                id="explode"
                min={0}
                max={1}
                step={0.01}
                value={[explode]}
                onValueChange={([value]) => changeExplode(value ?? 0)}
                thumbLabel="میزان جدا شدن قطعه‌ها"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="lift">برداشتن پل‌ها و روتور</Label>
              <Switch id="lift" checked={lifted} onCheckedChange={toggleLift} />
            </div>

            <div className="flex flex-col gap-3">
              <span id="speed-label" className="text-sm font-medium">
                سرعت زمان
              </span>
              <ToggleGroup
                type="single"
                variant="outline"
                value={speed}
                onValueChange={changeSpeed}
                aria-labelledby="speed-label"
                className="w-full"
              >
                {SPEEDS.map((s) => (
                  <ToggleGroupItem key={s.value} value={s.value} className="flex-1">
                    {s.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="energy" className="flex items-center gap-2">
                <Zap className="size-4 text-gold" aria-hidden />
                مسیر انرژی
              </Label>
              <Switch id="energy" checked={energy} onCheckedChange={toggleEnergy} />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 select-none"
                onPointerDown={() => winding(true)}
                onPointerUp={() => winding(false)}
                onPointerLeave={() => winding(false)}
                onKeyDown={(e) => (e.key === " " || e.key === "Enter") && winding(true)}
                onKeyUp={() => winding(false)}
              >
                <Hand data-icon="inline-start" />
                نگه دارید تا کوک شود
              </Button>
              <Button variant="ghost" size="icon" onClick={reset} aria-label="بازگشت به حالت اول">
                <RotateCcw />
              </Button>
            </div>
          </section>

          <Separator />

          <nav aria-label="فهرست قطعه‌ها" className="flex flex-col gap-5">
            {GROUP_ORDER.map((group) => (
              <div key={group} className="flex flex-col gap-1">
                <p className="mb-1 eyebrow">{GROUP_LABELS[group]}</p>
                {PARTS.filter((part) => part.group === group).map((part) => (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => select(selected === part.id ? null : part.id)}
                    aria-pressed={selected === part.id}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-2 text-start text-sm transition-colors",
                      selected === part.id
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                    )}
                  >
                    {part.name}
                    <span className="font-mono text-[11px] opacity-60" dir="ltr">
                      {part.nameEn}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <Separator />

          <CalibreHowItWorks calibre={calibre} />
          <Separator />
          <CalibreSpecs calibre={calibre} />
          <Separator />
          <CalibreUsedIn calibre={calibre} />
        </div>
      </aside>
    </div>
  );
}
