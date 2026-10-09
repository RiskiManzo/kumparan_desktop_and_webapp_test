import {Page, expect} from '@playwright/test';
import { Header } from '../pages/header';
import { articlePage } from '../pages/detail_page';

export class Homepage {
    readonly header: Header;
    readonly articlePage: articlePage;

    constructor(private page: Page) {
        this.header = new Header(page);
        this.articlePage = new articlePage(page);
    }
    async navigateToHomepage() {
        await this.page.goto('/');
    }

    async clickOnLoginButton() {
        await this.page.getByTestId('hd-login').click();
    }

    async verifyAdsModal() {
        await this.page.getByTestId('otp-ads-modal').isVisible();
        await this.page.getByTestId('close').isVisible();
    }

    async closeAdsModalIfVisible() {
        const modal = this.page.getByTestId('otp-ads-modal');
        // Wait up to 3 seconds for the popup to appear
        const appeared = await modal
            .waitFor({ state: 'visible', timeout: 3000 })
            .then(() => true)
            .catch(() => false);
        if (appeared) {

            await modal.getByTestId('close').dispatchEvent('click');
        }
        await expect(modal).toBeHidden();
    }

    async verifyHomePageContent() {
       await this.header.verifyHeaderContent();
        await this.page.getByTestId('news-item').first().isVisible();
        await this.page.getByTestId('trending-section').isVisible();

    }

    async verifyCarouselNews() {
        await this.page.getByTestId('carousel-pane').first().isVisible();
        await expect(this.page.getByTestId('chevron-next').first()).toBeVisible();
    }

    async carouselChevronNext() {
        await this.page.getByTestId('chevron-next').first().click();
    }

    async verifyAddsSection() {
        await this.page.getByTestId('grid-collection-list-container').first().isVisible();
    }

    async verifyPollingNews() {
        // The polling card loads only after scrolling down, so scroll step by step
        const pollingCard = this.page.getByTestId('polling-card').first();
        await pollingCard.scrollIntoViewIfNeeded();
        await expect(pollingCard).toBeVisible();
        await expect(pollingCard.getByTestId('polling-choice').first()).toBeVisible();
    }

    async videoStorySection() {
        await this.articlePage.verifyVideoStory();
    }

    async verifyFeedSection() {
        await this.page.getByTestId('channel-feed-header').isVisible();
        await this.page.getByTestId('form-select').isVisible();
    }

    // The card wrapper uses news-item on some layouts and news-card on others
    get newsCard() {
        return this.page.locator('[data-qa-id="news-card"], [data-qa-id="news-item"]').first();
    }

    async clickArticle() {
        const title = this.page
            .locator('[data-qa-id="news-card"], [data-qa-id="news-item"]')
            .locator('[data-qa-id="title"]')
            .filter({ hasNotText: 'Sedang memuat' })
            .first();
        await title.click();
    }



};
