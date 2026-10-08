import {Page} from '@playwright/test';
import { Header } from '../pages/header';

export class LoginPage {
    readonly header: Header;

    constructor(private page: Page) {
        this.header = new Header(page);
    }

    async navigateToLoginPage() {
        await this.page.goto('/login');
    };

    async verifyLoginPageContent() {
        await this.header.verifyHeaderContent();
        await this.page.locator('text=Masuk').isVisible();
        await this.page.getByTestId('input-email').isVisible();
        await this.page.getByTestId('input-password').isVisible();
        await this.page.getByTestId('btn-save').isVisible();
        await this.page.getByTestId('btn-forgot-password').isVisible();
        await this.page.getByTestId('eye').isVisible();
        await this.page.getByTestId('btn-login-fb').isVisible();
        await this.page.getByTestId('btn-login-google').isVisible();
        await this.page.getByTestId('btn-login-phone').isVisible();
        await this.page.getByTestId('btn-register').isEnabled();

    }

    async validLogin(email: string, password: string) {
        await this.page.getByTestId('input-email').fill(email);
        await this.page.getByTestId('input-password').fill(password);
        await this.page.getByTestId('btn-save').click();
    }

    async invalidLogin(email: string, password: string) {
        await this.page.getByTestId('input-email').fill(email);
        await this.page.getByTestId('input-password').fill(password);
        await this.page.getByTestId('btn-save').click();
    }

    async emptyFields() {
        await this.page.getByTestId('input-email-errorMessage').isVisible();
        await this.page.getByTestId('input-password-errorMessage').isVisible();
    }

};