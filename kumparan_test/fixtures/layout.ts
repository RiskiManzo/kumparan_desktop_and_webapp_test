import { test as base, expect } from '@playwright/test';
import { Homepage } from '../pages/homepage';

// 'mobile' when the test runs in a mobile project (see playwright.config.ts), otherwise 'desktop'
export type Layout = 'desktop' | 'mobile';

type LayoutFixtures = {
  layout: Layout;
  homePage: Homepage;
};

export const test = base.extend<LayoutFixtures>({
  layout: async ({ isMobile }, use) => {
    await use(isMobile ? 'mobile' : 'desktop');
  },

  // Opens the homepage and closes the ads popup before each test that asks for it
  homePage: async ({ page }, use) => {
    const homePage = new Homepage(page);
    await homePage.navigateToHomepage();
    await homePage.closeAdsModalIfVisible();
    await use(homePage);
  },
});

export { expect };
