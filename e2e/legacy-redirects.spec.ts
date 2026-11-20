import { expect, test } from "@playwright/test";
import { legacyRedirects } from "../src/lib/site";

test.describe("legacy flutter.ph URLs keep working", () => {
  test.skip(({ isMobile }) => isMobile, "viewport-independent, run once per desktop project");

  for (const [path, target] of Object.entries(legacyRedirects)) {
    for (const suffix of ["", ".html"]) {
      test(`/${path}${suffix} redirects to ${target.label}`, async ({ page }) => {
        // Do not follow the redirect off-site; just check the page is served and points at the right place.
        await page.route(
          (url) => !url.hostname.includes("localhost"),
          (r) => r.abort(),
        );
        const res = await page.request.get(`/${path}${suffix}`);
        expect(res.status()).toBe(200);
        const html = await res.text();
        expect(html).toContain(`content="0; url=${target.to}"`);
        expect(html).toContain(`href="${target.to}"`);
        expect(html).toContain('name="robots" content="noindex');
      });
    }
  }
});
