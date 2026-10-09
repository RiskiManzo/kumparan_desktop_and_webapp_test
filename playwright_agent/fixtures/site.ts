// spec: kumparan_test_plan.md
// Shared fixtures. Every generated spec starts from the site homepage with ad overlays dismissed.

import { test as base, expect, type Page } from '@playwright/test';

/**
 * kumparan shows a full-screen ad/OTP modal on first load, but only sometimes.
 * It is dismissed opportunistically: this is a bounded wait for an *optional* element,
 * not a fixed sleep, and it never runs when the modal does not appear.
 */
export async function dismissOverlays(page: Page) {
  const adModal = page.getByTestId('otp-ads-modal');
  const appeared = await adModal
    .waitFor({ state: 'visible', timeout: 3000 })
    .then(() => true)
    .catch(() => false);

  if (appeared) {
    await adModal.getByTestId('close').click();
    await expect(adModal).toBeHidden();
  }
}

/**
 * Opens an article from the homepage headline cards and waits for it to render.
 * The card list is layout dependent (the desktop carousel is wrapped in "headline-section",
 * the mobile one is not), so cards are chosen by requiring a title. Headlines can occasionally
 * point at an article that has since been removed — the site then serves a 404 shell — so a few
 * candidates are tried before giving up.
 */
export async function openFirstArticle(page: Page) {
  const cards = page.getByTestId('headline-card').filter({ has: page.getByTestId('title') });

  for (let attempt = 0; attempt < 3; attempt++) {
    const card = cards.nth(attempt);
    if ((await card.count()) === 0) break;

    await expect(card.getByTestId('title')).toBeVisible();
    await card.getByTestId('title').click();
    await expect(page).toHaveURL(/kumparan\.com\/[^/]+\/.+/);

    const opened = await page
      .getByTestId('story-title')
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);

    if (opened) return;

    await page.goto('/');
    await dismissOverlays(page);
  }

  throw new Error('Could not open an article from the homepage headline cards');
}

/**
 * Titles of the headline cards currently inside the viewport. Used to prove the carousel
 * actually advanced without depending on the carousel's implementation classes.
 */
export async function visibleHeadlineTitles(page: Page) {
  return page.evaluate(() => {
    const section = document.querySelector('[data-qa-id="headline-section"]');
    if (!section) return [];
    return [...section.querySelectorAll('[data-qa-id="headline-card"]')]
      .filter((card) => {
        const rect = card.getBoundingClientRect();
        return rect.width > 0 && rect.left >= 0 && rect.right <= window.innerWidth;
      })
      .map((card) => card.querySelector('[data-qa-id="title"]')?.textContent?.trim() ?? '');
  });
}

type Fixtures = {
  /** The site homepage, already open with any ad overlay dismissed. */
  homePage: Page;
  /** The login page, already open with the email field rendered. */
  loginPage: Page;
  /** An article opened from the first headline card on the homepage. */
  articlePage: Page;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await page.goto('/');
    await dismissOverlays(page);
    await use(page);
  },

  loginPage: async ({ page }, use) => {
    await page.goto('/login');
    await dismissOverlays(page);
    await expect(page.getByTestId('input-email')).toBeVisible();
    await use(page);
  },

  articlePage: async ({ page }, use) => {
    await page.goto('/');
    await dismissOverlays(page);
    await openFirstArticle(page);
    await use(page);
  },
});

export { expect };
