// spec: kumparan_test_plan.md
// seed: fixtures/site.ts

import { test, expect, visibleHeadlineTitles } from '../fixtures/site';

test.describe('Desktop site exploration', () => {
  test('1.1 header navigation is mapped and usable @desktop', async ({ homePage: page }) => {
    // 1. On the homepage, assert the header is visible
    await expect(page.getByTestId('header-section')).toBeVisible();

    // 2. Assert every header affordance resolves to a visible element
    await expect(page.getByTestId('hd-logo').first()).toBeVisible();
    await expect(page.getByTestId('search').first()).toBeVisible();
    await expect(page.getByTestId('input-search')).toBeVisible();
    await expect(page.getByTestId('input-search')).toBeEditable();
    await expect(page.getByTestId('hd-home').first()).toBeVisible();
    await expect(page.getByTestId('hd-theme').first()).toBeVisible();
    await expect(page.getByTestId('hd-notification').first()).toBeVisible();
    await expect(page.getByTestId('hd-login').first()).toBeVisible();
    await expect(page.getByTestId('create-story').first()).toBeVisible();
    await expect(page.getByTestId('main-menu').first()).toBeVisible();

    // 3. Assert the main channel navigation is mapped
    const mainMenu = page.getByRole('navigation', { name: 'headermain menu' });
    await expect(mainMenu).toBeVisible();
    for (const channel of ['News', 'Bisnis', 'Tekno', 'Entertainment', 'Bola & Sports']) {
      await expect(mainMenu.getByRole('link', { name: channel, exact: true })).toBeVisible();
    }

    // 4. Assert the sub navigation is mapped
    const subMenu = page.getByRole('navigation', { name: 'header sub menu' });
    await expect(subMenu).toBeVisible();
    for (const item of ['Breaking News', 'Video Story', 'Audio Story', 'Trending']) {
      await expect(subMenu.getByRole('link', { name: item, exact: true })).toBeVisible();
    }
  });

  test('1.2 login entry point is reachable from the header @desktop', async ({ homePage: page }) => {
    // 1. Click the header login entry
    await page.getByTestId('hd-login').first().click();

    // 2. Assert the browser lands on the login page
    await expect(page).toHaveURL(/\/login$/);

    // 3. Assert the login fields are visible
    await expect(page.getByTestId('input-email')).toBeVisible();
    await expect(page.getByTestId('input-password')).toBeVisible();
  });

  test('1.3 article list and feed render headline cards @desktop', async ({ homePage: page }) => {
    // 1. Assert the headline/trending section renders
    await expect(page.getByTestId('headline-and-trending-section')).toBeVisible();
    await expect(page.getByTestId('headline-section')).toBeVisible();

    // 2. Assert an article card carries a title, a source and a date
    const firstCard = page.getByTestId('headline-card').first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.getByTestId('title').first()).not.toBeEmpty();
    await expect(firstCard.getByTestId('author-name').first()).not.toBeEmpty();
    await expect(firstCard.getByTestId('card-footer-date').first()).not.toBeEmpty();

    // 3. Assert the trending list is populated
    await expect(page.getByTestId('trending-section')).toBeVisible();
    await expect(page.getByTestId('trending-story-item').first()).toBeVisible();

    // 4. Assert the channel feed renders
    await expect(page.getByTestId('grid-collection-list-container').first()).toBeVisible();
    await expect(page.getByTestId('showcase-title').first()).toBeVisible();
  });

  test('1.4 headline carousel advances with the next control @desktop', async ({ homePage: page }) => {
    // 1. Assert the first carousel pane is visible
    const headlineSection = page.getByTestId('headline-section');
    await expect(headlineSection.getByTestId('carousel-pane').first()).toBeVisible();

    // 2. Capture the headline titles currently on screen
    const titlesBefore = await visibleHeadlineTitles(page);
    expect(titlesBefore.length, 'headline carousel should show at least one card').toBeGreaterThan(0);

    // 3. Assert the next control is available
    const nextControl = headlineSection.getByTestId('carousel-right-control').first();
    await expect(nextControl).toBeVisible();

    // 4. Click the next control
    await nextControl.click();

    // 5. Assert the carousel shows different stories and is still usable
    await expect
      .poll(() => visibleHeadlineTitles(page), {
        message: 'headline carousel should show different stories after paging',
      })
      .not.toEqual(titlesBefore);
    await expect(headlineSection.getByTestId('carousel-pane').first()).toBeVisible();
  });

  test('1.5 article images render with real sources @desktop', async ({ homePage: page }) => {
    // 1. Assert article imagery is displayed. The page also contains hidden thumbnails
    //    (collapsed carousel panes), so a visible thumbnail is what is asserted.
    await expect(page.getByTestId('image').filter({ visible: true }).first()).toBeVisible();

    // 2. Assert every image in a headline card has a source and alt text
    const card = page
      .getByTestId('headline-section')
      .getByTestId('headline-card')
      .filter({ has: page.getByTestId('title') })
      .first();
    await expect(card.getByRole('img').first()).toBeVisible();
    const images = await card
      .getByRole('img')
      .evaluateAll((nodes) => nodes.map((node) => ({ src: node.getAttribute('src') ?? '', alt: node.getAttribute('alt') ?? '' })));

    expect(images.length, 'headline card should render images').toBeGreaterThan(0);
    for (const image of images) {
      expect(image.src, 'image should have a source').not.toBe('');
      expect(image.alt, 'image should carry alt text').not.toBe('');
    }

    // 3. Assert the images are served by the kumparan CDN
    expect(images.some((image) => image.src.includes('blue.kumparan.com'))).toBe(true);
  });
});
