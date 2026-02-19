import { type Locator, type Page } from '@playwright/test';

export class RegistrationPage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly passwordConfirmationInput: Locator;
    readonly registerButton: Locator;
    readonly errorAlert: Locator;

    constructor(page: Page) {
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.emailInput = page.getByRole('textbox', { name: 'email' });
        this.passwordInput = page.getByRole('textbox', { name: 'your password', exact: true });
        this.passwordConfirmationInput = page.getByRole('textbox', { name: 'your password again', exact: true });
        this.registerButton = page.getByRole('button', { name: 'Sign Up' });
        this.errorAlert = page.locator('.alert.alert-warning');
    }

    async register(firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string) {
        await this.firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.passwordConfirmationInput.fill(passwordConfirmation);
        await this.registerButton.click();
    }
}