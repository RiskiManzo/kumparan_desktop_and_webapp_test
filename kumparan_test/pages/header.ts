import {Page, expect} from '@playwright/test';

export class Header {
    constructor(private page: Page) {}

    async navigateToHeader() {
        await this.page.goto('/');
    }

    async verifyHeaderContent() {
        await expect(this.page.getByTestId('search')).toBeVisible();
        await expect(this.page.getByTestId('hd-notification')).toBeVisible();
        await expect(this.page.getByTestId('hd-login')).toBeVisible();
        await expect(this.page.getByTestId('create-story')).toBeVisible();
        await expect(this.page.getByTestId('main-menu')).toBeVisible();
    }


    async searchFunctionality(searchTerm: string) {
        await this.page.getByTestId('input-search').click();
        await this.page.getByTestId('input-search').fill(searchTerm);
        await this.page.getByTestId('input-search').press('Enter');
        await expect(this.page).toHaveURL(new RegExp(`/search/${searchTerm}`));
    }


    async clickChannelMenu(channelName: string) {
        // Channel links are already visible in the "headermain menu" nav on desktop
        await this.page.getByRole('navigation', { name: 'headermain menu' })
            .getByRole('link', { name: channelName, exact: true }).click();
        await expect(this.page).toHaveURL(new RegExp(`/channel/${channelName.toLowerCase()}`));
    }
}