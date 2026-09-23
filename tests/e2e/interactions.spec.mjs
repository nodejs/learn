import { test, expect } from '@playwright/test';

import { waitForIsland } from './helpers.mjs';

const ARTICLE = '/learn/getting-started/introduction-to-nodejs';

/**
 * The theme is applied in an effect after the menu item is clicked, so use a
 * retrying assertion rather than reading `data-theme` once.
 *
 * @param {import('@playwright/test').Page} page
 * @param {'light' | 'dark'} theme
 */
const expectTheme = (page, theme) =>
  expect(page.locator('html')).toHaveAttribute('data-theme', theme);

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
    await expectTheme(page, 'dark');

    await selectTheme(page, 'Light');
    await expectTheme(page, 'light');
  });

  test('keeps the chosen theme across pages', async ({ page }) => {
    await page.goto(ARTICLE);
    await selectTheme(page, 'Dark');

    await page.goto('/learn/getting-started/fetch');
    await expectTheme(page, 'dark');
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

test.describe('Small screens', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the navigation dropdown leads to other articles', async ({ page }) => {
    await page.goto('/learn/getting-started/fetch');

    // The sidebar collapses into a dropdown that only works once hydrated.
    await waitForIsland(page, 'Sidebar');
    await page.getByRole('combobox', { name: 'Navigation' }).click();

    // Radix ignores a selection made in the first moments after the list
    // opens, so wait for it to settle and choose with the keyboard.
    const option = page.getByRole('option', {
      name: 'Introduction to Node.js',
    });
    await expect(option).toBeVisible();
    await option.focus();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(new RegExp(`${ARTICLE}$`));
  });

  test('the menu button reveals the site links', async ({ page }) => {
    await page.goto(ARTICLE);

    const blogLink = page.getByRole('navigation').getByRole('link', {
      name: 'Blog',
    });
    await expect(blogLink).toBeHidden();

    await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
    await expect(blogLink).toBeVisible();
  });
});
