import { defineConfig, devices } from '@playwright/test';

/**
 * kumparan.com (desktop) and m.kumparan.com (mobile) are separate origins, so each
 * gets its own project with its own baseURL. Tests are selected by the @desktop /
 * @mobile tag in the test title.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  /* The suite runs against the live production site, so it is slower and flakier than a
     local app: allow a retry and keep concurrency low to avoid rate-limiting/blocking. */
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 4,
  /* Production page loads regularly exceed the 30s default when many sessions run at once. */
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    testIdAttribute: 'data-qa-id',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop-chromium',
      grep: /@desktop/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        baseURL: 'https://kumparan.com',
      },
    },
    {
      name: 'mobile-chrome',
      grep: /@mobile/,
      use: {
        ...devices['Pixel 7'],
        baseURL: 'https://m.kumparan.com',
      },
    },
  ],
});
