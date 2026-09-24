/**
 * A handful of pages that cover the shapes Learn renders: the landing page,
 * a regular article, an article with authors, and a deeply linked section.
 */
export const representativePages = [
  '/learn',
  '/learn/getting-started/introduction-to-nodejs',
  '/learn/getting-started/fetch',
  '/learn/asynchronous-work/event-loop-timers-and-nexttick',
];

/**
 * Starts recording anything that goes wrong while a page loads.
 *
 * Only failures for URLs under `/learn/` on the page's own origin count.
 * The site links to (and prefetches) other nodejs.org routes like `/about`,
 * which don't exist on a Learn-only preview, and third-party requests
 * (avatars, analytics) are out of our hands.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} origin
 */
export const trackPageProblems = (page, origin) => {
  /** @type {string[]} */
  const problems = [];

  const isOurs = url => {
    const { origin: o, pathname } = new URL(url);
    return o === origin && pathname.startsWith('/learn/');
  };

  page.on('pageerror', error => problems.push(`Uncaught: ${error.message}`));

  page.on('requestfailed', request => {
    if (isOurs(request.url())) {
      problems.push(
        `Failed: ${request.url()} (${request.failure()?.errorText})`
      );
    }
  });

  page.on('response', response => {
    if (response.status() >= 400 && isOurs(response.url())) {
      problems.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });

  return problems;
};

/**
 * Waits for a doc-kit island to finish hydrating. Islands load on idle, so
 * clicking one straight after navigation can hit the static server markup.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name The island's `data-island-name`, e.g. `ThemeToggle`.
 */
export const waitForIsland = (page, name) =>
  page
    .locator(`is-land[data-island-name="${name}"][ready]`)
    .first()
    .waitFor({ state: 'attached' });
