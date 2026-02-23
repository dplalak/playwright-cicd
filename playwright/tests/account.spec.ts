import { test, expect } from '../fixtures/fixtures';
import { AccountPage } from '../pages/account.page';
import { LoginPage } from '../pages/login.page';
import { faker } from '@faker-js/faker';

test.describe('Account tests', () => {
  test.beforeAll(async ({ createUserViaAPI }) => {
    await createUserViaAPI();
  })

  test('Unauthenticated user is redirected to sign in', async ({ page, baseURL }) => {
    await page.goto('/#/account', { waitUntil: 'commit' });
    await expect(page).toHaveURL(`${baseURL}` + '/#/signin');
  });

  test('Authenticated user can see account profile details', async ({ page, baseURL }) => {
    await page.goto('/#/signin', { waitUntil: 'commit' });
    const loginPage = new LoginPage(page);
    await loginPage.login(`${process.env.EMAIL}`, `${process.env.PASSWORD}`);
    const accountPage = new AccountPage(page);
    await expect(page).toHaveURL(`${baseURL}` + '/#/account', { timeout: 10000 });
    await expect(accountPage.accountHeader).toBeVisible();
    await expect(accountPage.serverStatusText).toBeVisible();
    await expect(accountPage.firstNameInput).toBeDisabled();
    await expect(accountPage.lastNameInput).toBeDisabled();
    await expect(accountPage.emailInput).toBeDisabled();
    await expect(accountPage.updateInformationButton).toBeVisible();
  });

  test('User can open edit mode and cancel changes', async ({ page, baseURL }) => {
    await page.goto('/#/signin', { waitUntil: 'commit' });
    const loginPage = new LoginPage(page);
    await loginPage.login(`${process.env.EMAIL}`, `${process.env.PASSWORD}`);
    const accountPage = new AccountPage(page);
    await expect(page).toHaveURL(`${baseURL}` + '/#/account', { timeout: 10000 });
    await expect(accountPage.emailInput).toHaveValue(`${process.env.EMAIL}`);

    const originalFirstName = await accountPage.firstNameInput.inputValue();
    const originalLastName = await accountPage.lastNameInput.inputValue();

    await accountPage.clickUpdateInformationButton();
    await expect(accountPage.saveChangeButton).toBeDisabled();
    await accountPage.firstNameInput.fill(`${originalFirstName}-edited`);
    await accountPage.lastNameInput.fill(`${originalLastName}-edited`);
    await expect(accountPage.passwordInput).toBeVisible();
    await expect(accountPage.saveChangeButton).toBeEnabled();

    await accountPage.clickCancelButton();
    await expect(accountPage.updateInformationButton).toBeVisible();
    await expect(accountPage.firstNameInput).toHaveValue(originalFirstName);
    await expect(accountPage.lastNameInput).toHaveValue(originalLastName);
  });  
});
