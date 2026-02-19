import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorAlert: Locator;

    constructor(page: Page) {
        this.emailInput = page.getByRole('textbox', { name: 'email' });
        this.passwordInput = page.getByRole('textbox', { name: 'password' });
        this.loginButton = page.getByRole('button', { name: 'Sign In' });
        this.errorAlert = page.locator('.alert.alert-warning');
    }

    async login(email: string, password: string) {
        await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}