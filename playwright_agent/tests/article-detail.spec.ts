// spec: kumparan_test_plan.md
// seed: fixtures/site.ts

import { test, expect } from '../fixtures/site';

test.describe('Article detail', () => {
  test('4.1 article title, author and body are visible @desktop', async ({ articlePage: page }) => {
    // 1. Assert the title renders and is not empty
    const title = page.getByTestId('story-title');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    // 2. Assert the author and publish metadata render
    await expect(page.getByTestId('story-author').first()).toBeVisible();
    await expect(page.getByTestId('author-name').first()).not.toBeEmpty();
    await expect(page.getByTestId('publish-date')).toBeVisible();
    await expect(page.getByTestId('reading-time')).toBeVisible();

    // 3. Assert the body paragraphs render and are not truncated
    const paragraphs = page.getByTestId('story-paragraph');
    await expect(paragraphs.first()).toBeVisible();
    expect(await paragraphs.count(), 'article should have several paragraphs').toBeGreaterThanOrEqual(3);
    const firstParagraph = (await paragraphs.first().textContent())?.trim() ?? '';
    expect(firstParagraph.length, 'article body looks truncated').toBeGreaterThan(40);

    // 4. Assert article imagery renders
    await expect(page.getByTestId('image-figure').first()).toBeVisible();
  });

  test('4.2 liking an article as an anonymous visitor requires sign-in @desktop', async ({ articlePage: page }) => {
    // 1. Assert the like control and its icon are rendered
    const likeButton = page.getByTestId('btn-like');
    await expect(likeButton).toBeVisible();
    await expect(likeButton.getByTestId('like')).toBeVisible();

    // 2. Click like. The control is hydrated client-side, so the click is retried until the
    //    auth redirect happens rather than assuming the first click lands post-hydration.
    await expect(async () => {
      if (!/\/login$/.test(page.url())) {
        await likeButton.click({ timeout: 5_000 });
      }
      expect(page.url()).toMatch(/\/login$/);
    }).toPass({ timeout: 30_000 });

    // Expected per brief: the like state would change on the article.
    // Actual (verified): kumparan requires an account to like, so an anonymous visitor is sent to
    // /login and the article's like state is never changed. The assertion pins the real behaviour
    // rather than weakening it, and the deviation is recorded in testcase/test_case_generated.md.
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('input-email')).toBeVisible();
  });

  test('4.3 share options are exposed and can be dismissed without sharing @desktop', async ({ articlePage: page }) => {
    // 1. Assert the share control is rendered
    const share = page.getByTestId('share-wrapper');
    await expect(share).toBeVisible();

    // 2. Assert the share options are exposed: WhatsApp and copy-link
    await expect(share.getByTestId('sosmed-whatsapp-white')).toBeVisible();
    const copyLink = share.getByTestId('copy-circle');
    await expect(copyLink).toBeVisible();

    // kumparan's desktop share is inline rather than a modal dialog; assert that explicitly.
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // 3. Use the copy-link option and assert the confirmation alert appears
    await copyLink.click();
    const alert = page.getByTestId('success-alert');
    await expect(alert).toBeVisible();
    await expect(page.getByTestId('alert-msg')).toHaveText(/disalin/i);

    // 4. Dismiss the alert without sharing to any third party
    await page.getByTestId('alert-close').click();
    await expect(alert).toBeHidden();
  });
});
