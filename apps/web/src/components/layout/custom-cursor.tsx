"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type Mode = "rest" | "link" | "label";

const FINE = "(pointer: fine) and (hover: hover)";
const readFine = () => window.matchMedia(FINE).matches;
function subscribeFine(onChange: () => void) {
  const query = window.matchMedia(FINE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * A small ring that trails the pointer and, over the parts of the page that do something unusual, names what
 * a drag or a click will do there (`data-cursor="..."`). Fine pointers only, and never for reduced motion.
 */
export function CustomCursor() {
  const reduceMotion = usePrefersReducedMotion();
  const fine = useSyncExternalStore(subscribeFine, readFine, () => false);
  const enabled = fine && !reduceMotion;
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("rest");
  const [label, setLabel] = useState("");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // The ring follows a little behind, as if it moved through a liquid; the dot stays exact
  const ringX = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.dataset.cursor = "on";
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = event.target instanceof Element ? event.target : null;
      const named = target?.closest<HTMLElement>("[data-cursor]");
      if (named?.dataset.cursor) {
        setMode("label");
        setLabel(named.dataset.cursor);
      } else if (target?.closest("a, button, [role=button], [role=slider], label, input")) {
        setMode("link");
      } else {
        setMode("rest");
      }
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      delete root.dataset.cursor;
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  // Pointer coordinates are physical; a left-to-right box keeps "start" on the left
  return (
    <div aria-hidden dir="ltr" className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        style={{ x: ringX, y: ringY }}
        className={cn(
          "absolute start-0 top-0 transition-opacity duration-300",
          !visible && "opacity-0",
        )}
      >
        <div
          className={cn(
            "grid -translate-1/2 place-items-center rounded-full border border-foreground/40 backdrop-blur-[2px] transition-[width,height,background-color,border-color] duration-500 ease-glide",
            mode === "rest" && "size-8",
            mode === "link" && "size-12 border-metal",
            mode === "label" && "size-24 border-metal bg-background/40",
          )}
        >
          <span
            className={cn(
              "px-2 text-center text-[11px] leading-5 text-foreground transition-opacity duration-300",
              mode === "label" ? "opacity-100" : "opacity-0",
            )}
          >
            {label}
          </span>
        </div>
      </motion.div>
      <motion.div
        style={{ x, y }}
        className={cn(
          "absolute start-0 top-0 transition-opacity duration-300",
          !visible && "opacity-0",
        )}
      >
        <div className="size-1 -translate-1/2 rounded-full bg-foreground" />
      </motion.div>
    </div>
  );
}
