"use client";

import type { MotionValue } from "motion/react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/** Where the movement is, how big and which way up, while one stage of the page is centred on screen. */
interface Pose {
  /** Offset from the centre of the screen, in viewport widths and heights. */
  x: number;
  y: number;
  scale: number;
  /** Turn on the table, in degrees. */
  spin: number;
  /** Turn over around the winding stem: 0 shows the caseback, 180 the dial side. */
  flip: number;
  opacity: number;
}

interface Stage {
  /** The `data-stage` of the section this pose belongs to. */
  stage: string;
  /** Which moment of that section: its middle on screen, or its top reaching the bottom of the screen. */
  at: "centre" | "enter";
  desktop: Pose;
  mobile: Pose;
}

const pose = (
  x: number,
  y: number,
  scale: number,
  spin: number,
  flip: number,
  opacity = 1,
): Pose => ({
  x,
  y,
  scale,
  spin,
  flip,
  opacity,
});

/* The movement's path down the page. x is physical: negative moves it left, to the end side of a
   right-to-left page, away from the text. On phones the stem would push the disc off the left edge, so
   every pose there sits a tenth of the screen to the right. */
const STAGES: readonly Stage[] = [
  {
    stage: "hero",
    at: "centre",
    desktop: pose(0, 0.08, 1, 0, 0),
    mobile: pose(0.1, 0.04, 1, 0, 0),
  },
  // Lifted onto its edge under the headline, showing how thin the whole machine is
  {
    stage: "statement",
    at: "centre",
    desktop: pose(0, 0.16, 0.66, 10, 62),
    mobile: pose(0.1, 0.24, 0.62, 8, 58),
  },
  {
    stage: "wrist",
    at: "centre",
    desktop: pose(0, 0.22, 0.6, -6, 22),
    mobile: pose(0.1, 0.26, 0.6, -6, 20),
  },
  {
    stage: "feature-heart",
    at: "centre",
    desktop: pose(-0.2, 0, 0.62, 8, 0),
    mobile: pose(0.1, -0.24, 0.7, 6, 0),
  },
  {
    stage: "feature-sides",
    at: "centre",
    desktop: pose(-0.2, 0, 0.62, -4, 180),
    mobile: pose(0.1, -0.24, 0.7, -4, 180),
  },
  {
    stage: "feature-accuracy",
    at: "centre",
    desktop: pose(-0.2, 0.02, 0.56, -16, 180),
    mobile: pose(0.1, -0.25, 0.6, -12, 180),
  },
  {
    stage: "feature-finish",
    at: "centre",
    desktop: pose(-0.2, 0, 0.66, 4, 360),
    mobile: pose(0.1, -0.24, 0.74, 4, 360),
  },
  // It grows to the middle and hands over to the film of the same movement coming apart
  {
    stage: "film",
    at: "enter",
    desktop: pose(0, 0.05, 1.15, 0, 360, 0),
    mobile: pose(0.1, 0, 1.1, 0, 360, 0),
  },
  {
    stage: "finale",
    at: "enter",
    desktop: pose(0, 0.3, 0.7, -20, 360, 0),
    mobile: pose(0.1, 0.3, 0.7, -20, 360, 0),
  },
  {
    stage: "finale",
    at: "centre",
    desktop: pose(0, -0.12, 0.9, 0, 540, 1),
    mobile: pose(0.1, -0.16, 0.9, 0, 540, 1),
  },
];

function measure(desktop: boolean) {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const points: { at: number; pose: Pose }[] = [];
  for (const stage of STAGES) {
    const element = document.querySelector<HTMLElement>(`[data-stage="${stage.stage}"]`);
    if (!element) continue;
    const top = element.getBoundingClientRect().top + window.scrollY;
    const at = stage.at === "centre" ? top + element.offsetHeight / 2 - vh / 2 : top - vh * 0.6;
    points.push({ at: Math.max(0, at), pose: desktop ? stage.desktop : stage.mobile });
  }
  // Scroll stops must rise; a stage measured out of order (a short page) is dropped
  const rising = points.filter((p, i) => i === 0 || p.at > points[i - 1]!.at);
  return { rising, vw, vh };
}

type Track = ReturnType<typeof measure>;

function usePose(scrollY: MotionValue<number>, track: Track, key: keyof Pose, scale = 1) {
  const stops = track.rising.map((p) => p.at);
  const values = track.rising.map((p) => p.pose[key] * scale);
  return useTransform(
    scrollY,
    stops.length > 1 ? stops : [0, 1],
    values.length > 1 ? values : [values[0] ?? 0, values[0] ?? 0],
  );
}

function Face({ src, back = false }: { src: string; back?: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 [backface-visibility:hidden]",
        back && "[transform:rotateX(180deg)]",
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        priority={!back}
        sizes="(max-width: 1023px) 108vw, 64rem"
        className="object-contain drop-shadow-(--object-shadow)"
      />
      {/* A studio softbox sliding across the metal as it turns, clipped to the movement's own outline */}
      <div
        className="absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,var(--object-sheen)_48%,transparent_60%)] bg-size-[300%_100%] bg-(position:--sheen) [mask-mode:alpha] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] mix-blend-overlay"
        style={{ maskImage: `url(${src})` }}
      />
    </div>
  );
}

function Flight({
  track,
  tiltX,
  tiltY,
}: {
  track: Track;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
}) {
  const { scrollY } = useScroll();
  // A spring between scroll and pose gives the object weight instead of sticking to the scrollbar
  const smooth = useSpring(scrollY, { stiffness: 120, damping: 26, mass: 0.6 });
  const x = usePose(smooth, track, "x", track.vw);
  const y = usePose(smooth, track, "y", track.vh);
  const scale = usePose(smooth, track, "scale");
  const rotate = usePose(smooth, track, "spin");
  const flip = usePose(smooth, track, "flip");
  const opacity = usePose(smooth, track, "opacity");
  const rotateX = useTransform(() => flip.get() + tiltX.get());
  const sheen = useTransform(
    () => `${50 + ((rotate.get() + flip.get() + tiltY.get() * 4) % 360) * 0.6}% 0%`,
  );
  // The shadow on the table narrows as the movement stands on its edge
  const shadow = useTransform(flip, (f) => 0.35 + 0.65 * Math.abs(Math.cos((f * Math.PI) / 180)));

  return (
    <motion.div className="absolute inset-0 grid place-items-center" style={{ x, y, opacity }}>
      <motion.div
        className="relative aspect-[1500/635] w-[min(78vw,64rem)] [perspective:1600px] motion-safe:animate-[float_7s_ease-in-out_infinite] max-lg:w-[108vw]"
        style={{ scale, rotate, ["--sheen" as string]: sheen }}
      >
        <motion.div
          aria-hidden
          className="absolute inset-x-[18%] -bottom-[14%] h-[18%] rounded-[50%] bg-(--object-contact) blur-2xl"
          style={{ scaleY: shadow }}
        />
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{ rotateX, rotateY: tiltY }}
        >
          <Face src="/media/movement-cutout/caseback.webp" />
          {/* Turned over around the stem, so the stem stays on the same side, as it would in a hand */}
          <Face src="/media/movement-cutout/dial.webp" back />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/**
 * The real movement, cut out of its photographs, travelling down the home page: it turns, shrinks beside
 * the text, turns over to show its dial side, and hands over to the film where it comes apart.
 */
export function MovementFlight() {
  const reduceMotion = usePrefersReducedMotion();
  const [track, setTrack] = useState<Track | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  // The movement leans a few degrees towards a mouse, like an object turned in the hand under a lamp
  const tiltX = useSpring(pointerY, { stiffness: 60, damping: 18 });
  const tiltY = useSpring(pointerX, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduceMotion) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => setTrack(measure(desktop.matches));
    update();
    // The hero's still photograph steps aside once the travelling one is in place
    document.documentElement.dataset.flight = "on";
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    desktop.addEventListener("change", update);
    const fine = window.matchMedia("(pointer: fine)").matches;
    const lean = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth - 0.5) * 14);
      pointerY.set((0.5 - event.clientY / window.innerHeight) * 10);
    };
    if (fine) window.addEventListener("pointermove", lean, { passive: true });
    return () => {
      window.removeEventListener("pointermove", lean);
      observer.disconnect();
      desktop.removeEventListener("change", update);
      delete document.documentElement.dataset.flight;
    };
  }, [reduceMotion, pointerX, pointerY]);

  if (reduceMotion) return null;
  if (!track || track.rising.length < 2) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      <Flight
        key={`${track.vw}x${track.vh}:${track.rising.map((p) => Math.round(p.at)).join(",")}`}
        track={track}
        tiltX={tiltX}
        tiltY={tiltY}
      />
    </div>
  );
}
