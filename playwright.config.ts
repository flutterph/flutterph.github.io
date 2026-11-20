import { defineConfig, devices } from "@playwright/test";

/**
 * E2E + accessibility tests run against the static production build served
 * from out/ (the same files GitHub Pages will serve). Run `pnpm build:preview`
 * first, or let `pnpm check` do it.
 */
const PORT = 3000;

export const viewports = [
  { name: "mobile-360", width: 360, height: 780, isMobile: true },
  { name: "mobile-390", width: 390, height: 844, isMobile: true },
  { name: "tablet-768", width: 768, height: 1024, isMobile: false },
  { name: "desktop-1280", width: 1280, height: 800, isMobile: false },
  { name: "desktop-1440", width: 1440, height: 900, isMobile: false },
] as const;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results/artifacts",
  fullyParallel: true,
  // Seven browser projects share one machine; cap workers so axe scans do not time out.
  workers: process.env.CI ? 2 : 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  testIgnore: ["**/perf.spec.ts"],
  projects: [
    ...viewports.map((v) => ({
      name: v.name,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: v.width, height: v.height },
        isMobile: v.isMobile,
        hasTouch: v.isMobile,
        deviceScaleFactor: v.isMobile ? 2 : 1,
      },
    })),
    // Safari's engine, on a phone and on a desktop.
    { name: "webkit-iphone-390", use: { ...devices["iPhone 15"] } },
    {
      name: "webkit-desktop-1440",
      use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: "pnpm start",
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
