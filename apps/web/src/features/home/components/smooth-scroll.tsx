"use client";

import "lenis/dist/lenis.css";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { useEffect } from "react";

/**
 * Inertial scrolling for the home page only: the wheel eases into motion and glides to a stop, so the
 * travelling movement turns with the weight of the hand instead of jumping a notch at a time. The lab is
 * left alone because its canvas needs the wheel for zooming.
 */
export function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.9, anchors: true });
    return () => lenis.destroy();
  }, [reduceMotion]);

  return null;
}
