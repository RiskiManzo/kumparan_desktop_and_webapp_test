import {Page, expect} from '@playwright/test';
import { Header } from '../pages/header';

export class articlePage {
    readonly header: Header;

    constructor(private page: Page) {
        this.header = new Header(page);
    }

    async verifyArticlePageContent() {
        await this.header.verifyHeaderContent();
        await expect(this.page.getByTestId('story-title')).toBeVisible();
        await expect(this.page.getByTestId('below-image-ads')).toBeVisible();
        // 8 paragraphs on the page, so check the first one only
        await expect(this.page.getByTestId('story-paragraph').first()).toBeVisible();
        await expect(this.page.getByTestId('author-name')).toBeVisible();
        await expect(this.page.getByTestId('publish-date')).toBeVisible();
        await expect(this.page.getByTestId('btn-like')).toBeVisible();
        await expect(this.page.getByTestId('comment')).toBeVisible();
        await expect(this.page.getByTestId('image-figure')).toBeVisible();
    }

    async clickOnLikeButton() {
        await this.page.getByTestId('btn-like').click();
    }

    async clickOnCommentButton() {
        await this.page.getByTestId('comment').click();
    }

    async verifyTopictag() {
        // 3 topic tags on the page, so check the first one only
        await expect(this.page.getByTestId('label-tag-topic').first()).toBeVisible();
    }

    // Scrolls down a little at a time until the element is in the page (lazy-loaded sections)
    async scrollDownUntilAttached(testId: string) {
        const element = this.page.getByTestId(testId).first();
        for (let i = 0; i < 15 && (await element.count()) === 0; i++) {
            await this.page.mouse.wheel(0, 600);
            await this.page.waitForTimeout(500);
        }
        await expect(element).toBeAttached();
    }

    // "Baca Lainnya" only renders after scrolling down the article
    async verifyAnotherArticle() {
        await this.scrollDownUntilAttached('bacalainnya-compartment');
        await expect(this.page.getByTestId('bacalainnya-compartment').first()).toBeVisible();
    }

    async verifyAddcontainer() {
        await expect(this.page.getByTestId('grid-collection-list-container')).toBeVisible();
        await expect(this.page.getByTestId('showcase-title')).toBeVisible();
    }

    async verifyPollingNews() {
        await expect(this.page.getByTestId('polling-section')).toBeVisible();
        await expect(this.page.getByTestId('polling-card').first()).toBeVisible();
        await expect(this.page.getByTestId('polling-question')).toBeVisible();
    }

    async verifyTrendingNews() {
        await expect(this.page.getByTestId('trending-section')).toBeVisible();
        await expect(this.page.getByTestId('title').first()).toBeVisible();
    }

    async verifyVideoStory() {
        await expect(this.page.getByTestId('video-story-section')).toBeVisible();
        await expect(this.page.getByTestId('title').first()).toBeVisible();
        // 10 video covers on the page, so check the first one only
        await expect(this.page.getByTestId('video-story-cover').first()).toBeVisible();
    }

    async verifyKumparanPlus() {
        await expect(this.page.getByTestId('collection-container')).toBeVisible();
        await expect(this.page.getByTestId('title').first()).toBeVisible();
    }

    async verifyCommentSection() {
        await expect(this.page.getByTestId('comment-section')).toBeVisible();
        await expect(this.page.getByTestId('title').first()).toBeVisible();
        await expect(this.page.getByTestId('comment-section-input')).toBeEnabled();
        await expect(this.page.getByTestId('submit')).toBeEnabled();
    }

    async verifyCommentItem() {
        await expect(this.page.getByTestId('comment-item').first()).toBeVisible();
    }
}
