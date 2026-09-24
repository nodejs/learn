import { test, expect } from '@playwright/test';

/**
 * @param {import('@playwright/test').APIRequestContext} request
 * @returns {Promise<string[]>} Every `<loc>` in the sitemap.
 */
const getSitemapURLs = async request => {
  const response = await request.get('/learn/sitemap.xml');
  expect(response.status()).toBe(200);

  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc);
};

test.describe('Sitemap', () => {
  test('lists well-formed Learn URLs', async ({ request }) => {
    const urls = await getSitemapURLs(request);
    expect(urls.length).toBeGreaterThan(50);

    for (const url of urls) {
      const { protocol, hostname, pathname } = new URL(url);

      expect.soft(protocol, url).toMatch(/^https?:$/);
      // `https://https//nodejs.org/...` parses with a hostname of `https`
      expect.soft(hostname, url).not.toMatch(/^https?$/);
      expect.soft(pathname, url).toMatch(/^\/learn(\/|$)/);
    }
  });

  test('every listed page responds with 200', async ({ request }) => {
    const urls = await getSitemapURLs(request);

    // Request each path against the server under test, whatever origin the
    // sitemap was built with. Redirects are followed: section indexes are
    // listed as `/section/index`, which the host redirects to `/section`.
    const results = await Promise.all(
      urls.map(async url => {
        const { pathname } = new URL(url);
        const response = await request.get(pathname);
        return { pathname, status: response.status() };
      })
    );

    expect(results.filter(({ status }) => status !== 200)).toEqual([]);
  });

  test('ships the search index', async ({ request }) => {
    const response = await request.get('/learn/orama-db.json');
    expect(response.status()).toBe(200);
    expect(await response.json()).toHaveProperty('docs');
  });
});
