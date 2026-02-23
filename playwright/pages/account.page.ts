import { type Locator, type Page } from '@playwright/test';

export class AccountPage {
  readonly accountHeader: Locator;
  readonly serverStatusText: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly updateInformationButton: Locator;
  readonly saveChangeButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.accountHeader = page.getByRole('heading', { name: 'Account' });
    this.serverStatusText = page.getByText('Server status:');
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.emailInput = page.getByRole('textbox', { name: 'email' });
    this.passwordInput = page.getByRole('textbox', { name: 'your password', exact: true });
    this.updateInformationButton = page.getByRole('button', { name: 'Update Information' });
    this.saveChangeButton = page.getByRole('button', { name: 'Save Change' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async clickUpdateInformationButton() {
    await this.updateInformationButton.click();
  }

  async clickSaveChangeButton() {
    await this.saveChangeButton.click();
  }

  async clickCancelButton() {
    await this.cancelButton.click();
  }
}
