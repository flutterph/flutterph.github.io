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
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: viewports.map((v) => ({
    name: v.name,
    use: {
      ...devices["Desktop Chrome"],
      viewport: { width: v.width, height: v.height },
      isMobile: v.isMobile,
      hasTouch: v.isMobile,
      deviceScaleFactor: v.isMobile ? 2 : 1,
    },
  })),
  webServer: {
    command: "pnpm start",
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
