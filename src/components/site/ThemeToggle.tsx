"use client";

import { THEME_STORAGE_KEY } from "@/app/theme-script";

/**
 * Light by default; this button switches to dark and back.
 * No React state: the source of truth is data-theme on <html>, so the icon
 * swaps with CSS and there is nothing to hydrate.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    if (next === "dark") root.dataset.theme = "dark";
    else delete root.dataset.theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked: the choice lasts for this page view only.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-10 place-items-center rounded-pill text-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      <span className="sr-only">Toggle dark theme</span>
      <svg
        viewBox="0 0 20 20"
        className="size-5 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M16.5 12.2A6.5 6.5 0 0 1 7.8 3.5a6.5 6.5 0 1 0 8.7 8.7Z" strokeLinejoin="round" />
      </svg>
      <svg
        viewBox="0 0 20 20"
        className="hidden size-5 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="3.5" />
        <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6 16 16M4 16l1.4-1.4M14.6 5.4 16 4" />
      </svg>
    </button>
  );
}
