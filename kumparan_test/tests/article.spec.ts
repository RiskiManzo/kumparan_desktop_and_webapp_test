import {test, expect} from '@playwright/test';
import { Homepage } from '../pages/homepage';
import {articlePage} from '../pages/detail_page';



test.describe('Direct Navigation to Article Page', () => {

  let homePage: Homepage;
  let articleDetailPage: articlePage;

  test.beforeEach(async ({ page }) => {
    homePage = new Homepage(page);
    await homePage.navigateToHomepage();
    await homePage.closeAdsModalIfVisible();
    await homePage.clickArticle();
    articleDetailPage = new articlePage(page);
  });


    test('Verify Article Page Content @desktop', async ({ page }) => {
        await articleDetailPage.verifyArticlePageContent();
        await articleDetailPage.verifyTopictag();
        await articleDetailPage.verifyAnotherArticle();
        await articleDetailPage.verifyAddcontainer();
        await articleDetailPage.verifyPollingNews();
        await articleDetailPage.verifyTrendingNews();
        await articleDetailPage.verifyVideoStory();
        await articleDetailPage.verifyKumparanPlus();
        await articleDetailPage.verifyCommentSection();
    });

});
   