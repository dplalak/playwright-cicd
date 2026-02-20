import { test, expect } from '../fixtures/fixtures';
import { LoginPage } from '../pages/login.page';
import testUsers from '../test-data/testUsers.json';

test.describe('Login tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`/#/signin`, { waitUntil: 'load' });
  })

  test('Login with valid credentials', { tag: ['@Smoke'] }, async ({ page, baseURL, createUserViaAPI }) => {
    await createUserViaAPI();
    const loginPage = new LoginPage(page);
    await loginPage.login(`${process.env.EMAIL}`, `${process.env.PASSWORD}`);
    await expect(page).toHaveURL(`${baseURL}` + '/#account', { timeout: 10000 });
    await expect(loginPage.loginButton).toBeHidden();
  })

  test('Login with invalid email', async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(testUsers.invalidUser.email, `${process.env.PASSWORD}`);
    await expect(page).toHaveURL(`${baseURL}` + '#/signin');
    await expect(loginPage.errorAlert).toHaveText('Oops! Invalid email or password');
    await expect(loginPage.loginButton).toBeVisible();
  })

  test('Login with invalid password', async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(`${process.env.EMAIL}`, testUsers.invalidUser.password);
    await expect(page).toHaveURL(`${baseURL}` + '#/signin');
    await expect(loginPage.errorAlert).toHaveText('Oops! Invalid email or password');
    await expect(loginPage.loginButton).toBeVisible();
  })
})

