"use client";

import { useEffect } from "react";

/**
 * Lenis smooths mouse-wheel scrolling only. Touch, keyboard and assistive
 * tech scroll natively, and it is skipped entirely for reduced motion.
 * Loaded after hydration so it never delays first paint.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let destroy: (() => void) | undefined;
    let cancelled = false;
    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.12 });
      destroy = () => lenis.destroy();
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);
  return null;
}
