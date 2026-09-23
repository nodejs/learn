import { test, expect } from '@playwright/test';

import { waitForIsland } from './helpers.mjs';

const ARTICLE = '/learn/getting-started/introduction-to-nodejs';

/** @param {import('@playwright/test').Page} page */
const getTheme = page =>
  page.evaluate(() => document.documentElement.dataset.theme);

/**
 * @param {import('@playwright/test').Page} page
 * @param {'System' | 'Light' | 'Dark'} label
 */
const selectTheme = async (page, label) => {
  await waitForIsland(page, 'ThemeToggle');
  await page.getByRole('button', { name: 'Select theme' }).click();
  await page.getByRole('menuitem', { name: label }).click();
};

test.describe('Navigation', () => {
  test('renders an article inside the site layout', async ({ page }) => {
    await page.goto(ARTICLE);

    await expect(page.getByRole('navigation').first()).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Edit this page' })
    ).toHaveAttribute(
      'href',
      /github\.com\/nodejs\/learn\/edit\/main\/pages\//
    );
  });

  test('sidebar links lead to other articles', async ({ page }) => {
    await page.goto(ARTICLE);

    const sidebar = page.getByRole('complementary');
    const link = sidebar.getByRole('link', {
      name: 'Fetching data with Node.js',
    });
    const href = await link.getAttribute('href');

    await link.click();

    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('unknown pages respond with 404', async ({ page }) => {
    // Only the status is checked: which 404 page renders depends on the host
    // (nodejs.org proxies /learn, previews and `serve` use their own).
    const response = await page.goto('/learn/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});

test.describe('Theme', () => {
  test('switches between dark and light', async ({ page }) => {
    await page.goto(ARTICLE);

    await selectTheme(page, 'Dark');
    expect(await getTheme(page)).toBe('dark');

    await selectTheme(page, 'Light');
    expect(await getTheme(page)).toBe('light');
  });

  test('keeps the chosen theme across pages', async ({ page }) => {
    await page.goto(ARTICLE);
    await selectTheme(page, 'Dark');

    await page.goto('/learn/getting-started/fetch');
    expect(await getTheme(page)).toBe('dark');
  });
});

test.describe('Search', () => {
  test('finds articles and opens a result', async ({ page }) => {
    await page.goto(ARTICLE);
    await waitForIsland(page, 'SearchBox');

    await page.getByRole('button', { name: /Start typing/ }).click();

    // The Orama modal nests one dialog inside another, so pick the inner one.
    const results = page.getByRole('dialog').last();
    await results.getByPlaceholder('Start typing...').fill('streams');

    const firstHit = results.getByRole('link', { name: /streams/i }).first();
    await expect(firstHit).toBeVisible();

    await firstHit.click();
    await expect(page).toHaveURL(/\/learn\/.+/);
    await expect(page).not.toHaveURL(new RegExp(`${ARTICLE}$`));
  });
});
