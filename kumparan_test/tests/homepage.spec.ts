import { test, expect } from '../fixtures/layout';


test.describe('Homepage', () => {

  test('Verify homepage content @desktop', async ({ homePage }) => {
    await homePage.verifyHomePageContent();
    await homePage.verifyCarouselNews();
    await homePage.verifyAddsSection();
    await homePage.verifyPollingNews();
    await homePage.videoStorySection();
    await homePage.verifyFeedSection();
  });

  
  test('clicking a news item opens an article @desktop', async ({ page, homePage }) => {
    await homePage.clickArticle();
    await expect(page).toHaveURL(/\/kumparan(news|hits)\//);
    // Article content renders after the URL changes, so wait for the title heading
    await expect(page.getByTestId('story-title')).toBeVisible({ timeout: 15_000 });
  });

  test('search functionality @desktop', async ({ homePage }) => {
    const searchTerm = 'politik';
    await homePage.header.searchFunctionality(searchTerm);

  });



  test('clicking a channel menu item opens the channel page @desktop', async ({ page, homePage }) => {
    const channelName = 'Tekno';
    await homePage.header.clickChannelMenu(channelName);
    await expect(page).toHaveURL(new RegExp(`/channel/${channelName.toLowerCase()}`));
  });

});
