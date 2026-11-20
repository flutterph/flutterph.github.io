"use client";

import { useEffect } from "react";

/**
 * Lenis smooths mouse-wheel scrolling in Chromium and Firefox. It is skipped
 * for reduced motion, for touch devices, and in Safari, where native trackpad
 * momentum is already smooth and Lenis made scroll-driven animations lag.
 * Loaded after hydration so it never delays first paint.
 */
function shouldSmooth() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (matchMedia("(pointer: coarse)").matches) return false;
  const ua = navigator.userAgent;
  const isSafari = /Safari\//.test(ua) && !/(Chrome|Chromium|CriOS|Edg|Firefox|FxiOS)\//.test(ua);
  return !isSafari;
}

export function SmoothScroll() {
  useEffect(() => {
    if (!shouldSmooth()) return;
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
