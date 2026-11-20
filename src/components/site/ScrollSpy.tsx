"use client";

import { useEffect } from "react";
import { primaryNav } from "./nav";

/**
 * Marks the nav link for the section in the middle of the viewport.
 * Toggles data-active and aria-current on links that carry data-nav, so the
 * header stays a server component and nothing re-renders.
 */
export function ScrollSpy() {
  useEffect(() => {
    const sections = primaryNav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const setActive = (id: string | null) => {
      for (const link of document.querySelectorAll<HTMLElement>("[data-nav]")) {
        const on = link.dataset.nav === id;
        link.toggleAttribute("data-active", on);
        if (on) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    };

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // The last section in page order that crosses the middle band wins.
        const current = [...primaryNav].reverse().find((n) => visible.has(n.id));
        setActive(current?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const el of sections) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return null;
}
