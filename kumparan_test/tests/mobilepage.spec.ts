import { test, expect } from '../fixtures/layout';

test.describe('Mobile site', () => {

  test('mobile homepage shows the logo and a headline card @mobile', async ({ page, homePage }) => {
    await expect(page.getByTestId('hd-logo').first()).toBeVisible();
    await expect(page.getByTestId('headline-card').first()).toBeVisible();
  });

  test('mobile page has no horizontal overflow @mobile', async ({ page, homePage }) => {
    const overflowPx = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflowPx, 'page scrolls horizontally on mobile').toBeLessThanOrEqual(0);
  });

  test('able to click a headline card and navigate to the article page @mobile', async ({ page, homePage }) => {
    const headlineTitle = page
      .getByTestId('headline-card')
      .first()
      .locator('[data-qa-id="title"]')
      .first();
    await headlineTitle.click();
    await expect(page).toHaveURL(/\/kumparan[a-z]+\//);
    await expect(page.getByTestId('story-title')).toBeVisible({ timeout: 15_000 });
  });

});
