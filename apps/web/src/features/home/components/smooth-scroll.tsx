"use client";

import "lenis/dist/lenis.css";

import Lenis from "lenis";
import { useEffect } from "react";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Inertial scrolling for the home page only: the wheel eases into motion and glides to a stop, so the
 * travelling movement turns with the weight of the hand instead of jumping a notch at a time. The lab is
 * left alone because its canvas needs the wheel for zooming.
 */
export function SmoothScroll() {
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.9, anchors: true });
    return () => lenis.destroy();
  }, [reduceMotion]);

  return null;
}
