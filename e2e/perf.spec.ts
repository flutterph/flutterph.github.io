import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

type Report = {
  frames: number;
  p50: number;
  p95: number;
  p99: number;
  max: number;
  slowRatio: number;
  layoutShift: number | null;
  longAnimationFrames: number | null;
};

/**
 * Scrolls the home page top to bottom at a steady pace and records the time
 * between animation frames. Fails on sustained jank, very long frames, or any
 * layout shift caused by scrolling.
 */
test("home page scrolls without jank", async ({ page, browserName }, info) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const report = await page.evaluate(async (): Promise<Report> => {
    const deltas: number[] = [];
    let shift: number | null = null;
    let loaf: number | null = null;

    const supports = (type: string) => PerformanceObserver.supportedEntryTypes?.includes(type);
    if (supports("layout-shift")) {
      shift = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as (PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        })[]) {
          if (!e.hadRecentInput) shift = (shift ?? 0) + e.value;
        }
      }).observe({ type: "layout-shift" });
    }
    if (supports("long-animation-frame")) {
      loaf = 0;
      new PerformanceObserver((list) => {
        loaf = (loaf ?? 0) + list.getEntries().filter((e) => e.duration > 100).length;
      }).observe({ type: "long-animation-frame" });
    }

    const end = document.documentElement.scrollHeight - innerHeight;
    const step = Math.max(8, Math.round(innerHeight / 45)); // about one screen per 0.75 s at 60 fps
    await new Promise<void>((resolve) => {
      let last = performance.now();
      const tick = (now: number) => {
        deltas.push(now - last);
        last = now;
        if (scrollY >= end - 1) return resolve();
        scrollBy(0, step);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await new Promise((r) => setTimeout(r, 300));

    const sorted = deltas.slice(2).sort((a, b) => a - b);
    const q = (p: number) =>
      sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] ?? 0;
    return {
      frames: sorted.length,
      p50: q(0.5),
      p95: q(0.95),
      p99: q(0.99),
      max: sorted.at(-1) ?? 0,
      slowRatio: sorted.filter((d) => d > 34).length / Math.max(1, sorted.length),
      layoutShift: shift,
      longAnimationFrames: loaf,
    };
  });

  await mkdir("test-results/perf", { recursive: true });
  await writeFile(`test-results/perf/${info.project.name}.json`, JSON.stringify(report, null, 2));
  info.annotations.push({ type: "perf", description: JSON.stringify(report) });
  console.log(`${info.project.name} (${browserName})`, JSON.stringify(report));

  expect(report.frames).toBeGreaterThan(50);
  expect(report.slowRatio, "share of frames slower than 34 ms").toBeLessThan(0.1);
  expect(report.p95, "95th percentile frame time (ms)").toBeLessThan(40);
  // A single slow frame in a headless browser is usually first-time rasterization noise,
  // so judge the 99th percentile and only fail the worst frame when it is extreme.
  expect(report.p99, "99th percentile frame time (ms)").toBeLessThan(120);
  expect(report.max, "worst single frame (ms)").toBeLessThan(500);
  if (report.layoutShift !== null)
    expect(report.layoutShift, "layout shift while scrolling").toBeLessThan(0.01);
  if (report.longAnimationFrames !== null)
    expect(report.longAnimationFrames, "frames over 100 ms").toBe(0);
});
