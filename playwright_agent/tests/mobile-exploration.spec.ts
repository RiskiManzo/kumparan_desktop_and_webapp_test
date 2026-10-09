// spec: kumparan_test_plan.md
// seed: fixtures/site.ts

import { test, expect, openFirstArticle } from '../fixtures/site';

test.describe('Mobile site exploration', () => {
  test('2.1 mobile header swaps desktop controls for a burger menu @mobile', async ({ homePage: page }) => {
    // 1. Assert the mobile header exposes its own affordances
    await expect(page.getByTestId('header-top')).toBeVisible();
    await expect(page.getByTestId('burger-menu').first()).toBeVisible();
    await expect(page.getByTestId('hd-logo').first()).toBeVisible();
    await expect(page.getByTestId('hd-search').first()).toBeVisible();
    await expect(page.getByTestId('hd-notification').first()).toBeVisible();

    // 2. Assert the desktop-only header entries are not part of the mobile header
    await expect(page.getByTestId('hd-login')).toHaveCount(0);
    await expect(page.getByTestId('create-story')).toHaveCount(0);
    await expect(page.getByTestId('main-menu')).toHaveCount(0);
    await expect(page.getByTestId('input-search')).toHaveCount(0);

    // 3. Assert the mobile navigation bar replaces the desktop channel menu
    for (const id of ['nb-top-news', 'nb-video-story', 'nb-audio-story', 'nb-trending']) {
      await expect(page.getByTestId(id).first()).toBeVisible();
    }
  });

  test('2.2 login flow is reached through the burger menu @mobile', async ({ homePage: page }) => {
    const loginEntry = page.getByTestId('anchor-login-wrapper').first();

    // 1. Assert the login entry is off-canvas until the menu is opened
    await expect(loginEntry).not.toBeInViewport();

    // 2. Open the sidebar
    await page.getByTestId('burger-menu').first().click();
    await expect(page.getByTestId('close-sidebar').first()).toBeVisible();

    // 3. Assert the login entry slides into view
    await expect(loginEntry).toBeInViewport();
    await expect(page.getByTestId('label-text-masuk').first()).toHaveText('Masuk');

    // 4. Follow the login flow
    await loginEntry.click();

    // 5. Assert the mobile login form is reached
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('input-email')).toBeVisible();
    await expect(page.getByTestId('input-password')).toBeVisible();
  });

  test('2.3 the mobile page does not overflow horizontally @mobile', async ({ homePage: page }) => {
    const horizontalOverflow = () =>
      page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

    // 1. Assert the homepage does not scroll horizontally
    expect(await horizontalOverflow(), 'homepage overflows horizontally').toBeLessThanOrEqual(0);

    // 2. Assert an article page does not scroll horizontally either
    await openFirstArticle(page);
    expect(await horizontalOverflow(), 'article page overflows horizontally').toBeLessThanOrEqual(0);
  });

  test('2.4 mobile content scrolls and keeps a sticky header @mobile', async ({ homePage: page }) => {
    // 1. Assert the page starts at the top
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    // 2. Scroll the page down
    await page.mouse.wheel(0, 1200);

    // 3. Assert the document actually scrolled
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    // 4. Assert the site header stays pinned and visible while scrolling.
    //    On mobile the sticky element is the page <header>, not the desktop "header-section".
    const header = page.getByRole('banner').first();
    await expect(header).toBeInViewport();
    await expect(header).toHaveCSS('position', 'sticky');
  });

  test('2.5 mobile article content is displayed in full @mobile', async ({ homePage: page }) => {
    // 1. Open an article from a headline card
    await openFirstArticle(page);

    // 2. Assert the article renders title, author and body
    await expect(page).toHaveURL(/m\.kumparan\.com\/[^/]+\/.+/);
    await expect(page.getByTestId('story-title')).not.toBeEmpty();
    await expect(page.getByTestId('author-name').first()).not.toBeEmpty();

    const paragraphs = page.getByTestId('story-paragraph');
    await expect(paragraphs.first()).toBeVisible();

    // 3. Assert the body is not truncated
    const firstParagraph = (await paragraphs.first().textContent())?.trim() ?? '';
    expect(firstParagraph.length, 'article body looks truncated').toBeGreaterThan(40);
  });
});
