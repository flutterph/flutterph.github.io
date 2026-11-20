import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { keyRoutes } from "./routes";

for (const route of keyRoutes) {
  for (const theme of ["light", "dark"] as const) {
    test(`${route.name} (${theme}) has no axe violations and one h1`, async ({ page }, info) => {
      await page.addInitScript((t) => localStorage.setItem("fph-theme", t), theme);
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));

      await page.goto(route.path);
      if (theme === "dark")
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      else await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).toHaveCount(1);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);

      await page.screenshot({
        path: `test-results/screenshots/${route.name}-${theme}-${info.project.name}.png`,
        fullPage: true,
        // CSS-pixel scale keeps tall pages under WebKit's 32,767 px screenshot limit
        // on high-density phone profiles.
        scale: "css",
      });
      expect(errors).toEqual([]);
    });
  }
}
