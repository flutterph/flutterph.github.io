import { defineConfig, devices } from "@playwright/test";

/**
 * Scroll performance, measured on the static production build in Chromium and
 * WebKit (Safari's engine). Run with `pnpm test:perf` after `pnpm build`.
 * Headless numbers are a regression guard, not a device benchmark: the
 * thresholds in e2e/perf.spec.ts are set to catch real jank, not noise.
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: "perf.spec.ts",
  outputDir: "./test-results/perf-artifacts",
  workers: 1,
  fullyParallel: false,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3000" },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "webkit-desktop",
      use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } },
    },
    { name: "webkit-iphone", use: { ...devices["iPhone 15"] } },
  ],
  webServer: {
    command: "pnpm start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
