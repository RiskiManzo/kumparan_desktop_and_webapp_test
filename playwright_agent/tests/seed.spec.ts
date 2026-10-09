// spec: specs/test_generation.md
// seed: fixtures/site.ts

import { test, expect } from '../fixtures/site';

test.describe('Test group', () => {
  test('seed @desktop', async ({ homePage }) => {
    // Intentionally minimal seed: opens the homepage and clears any ad overlay.
    await expect(homePage).toHaveURL(/kumparan\.com/);
  });
});
