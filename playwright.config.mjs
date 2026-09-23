import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// When PLAYWRIGHT_BASE_URL is set (CI sets it to the Vercel preview), the
// tests run against that deployment. Otherwise they build nothing themselves
// and serve the existing `out/` directory: run `npm run build` first.
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const localBaseURL = 'http://localhost:3000';

// https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['html'], ['github']] : [['html']],
  use: {
    baseURL: externalBaseURL || localBaseURL,
    trace: 'on-first-retry',
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'npm run serve',
        url: `${localBaseURL}/learn`,
        reuseExistingServer: !isCI,
      },
  // Start with one engine; add Firefox/WebKit once the suite is stable.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
