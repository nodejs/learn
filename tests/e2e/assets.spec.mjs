import { test, expect } from '@playwright/test';

import { representativePages, trackPageProblems } from './helpers.mjs';

// Guards against the class of bug from nodejs/learn#133, where a malformed
// `baseURL` produced asset URLs like `https://https//nodejs.org/learn/...`
// and every page shipped without its CSS, JS and fonts.
test.describe('Page assets', () => {
  for (const path of representativePages) {
    test(`${path} loads its assets from the site`, async ({
      page,
      baseURL,
    }) => {
      const { origin } = new URL(baseURL);
      const problems = trackPageProblems(page, origin);

      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState('networkidle');

      // Every stylesheet, script and preload must point at this site's own
      // `/learn/assets/` folder. A mangled origin fails here even when the
      // browser can't tell us the request went nowhere.
      const assetURLs = await page
        .locator(
          'link[rel="stylesheet"], link[rel="modulepreload"], link[rel="preload"], script[src]'
        )
        .evaluateAll(elements =>
          elements.map(el => el.href || el.src).filter(Boolean)
        );

      expect(assetURLs.length).toBeGreaterThan(0);

      for (const url of assetURLs) {
        const { origin: assetOrigin, pathname } = new URL(url);
        expect.soft(assetOrigin, url).toBe(origin);
        expect.soft(pathname, url).toMatch(/^\/learn\/assets\//);
      }

      // If the stylesheet didn't apply, the body falls back to the browser's
      // default serif font.
      const fontFamily = await page.evaluate(
        () => getComputedStyle(document.body).fontFamily
      );
      expect(fontFamily).toContain('Open Sans');

      expect(problems).toEqual([]);
    });
  }
});
