import { test, expect } from '../fixtures/fixtures';
import { faker } from '@faker-js/faker';
import { RegistrationPage } from '../pages/registration.page';

test.describe('Registration tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`/#/signup`, { waitUntil: 'load' });
  })

  test('Registration with valid credentials', { tag: ['@Smoke'] }, async ({ page, baseURL }) => {
    const registrationPage = new RegistrationPage(page);
    const password = faker.internet.password();
    await registrationPage.register(
      faker.person.firstName(),
      faker.person.lastName(), 
      faker.internet.email(), 
      password,
      password
    );
    await expect(page).toHaveURL(`${baseURL}` + '/#/account', { timeout: 10000 });
    await expect(registrationPage.registerButton).toBeHidden();
  })

  test('Registration with non-matching passwords', async ({ page, baseURL }) => {
    const registrationPage = new RegistrationPage(page);
    const password = faker.internet.password();
    await registrationPage.register(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.internet.email(),
      password,
      password + '123'
    );
    await expect(page).toHaveURL(`${baseURL}` + '/#/signup');
    await expect(registrationPage.errorAlert).toHaveText('Oops! Password does not matched');
    await expect(registrationPage.registerButton).toBeVisible();
  })

  test('Registration with existing email', async ({ page, baseURL, createUserViaAPI }) => {
    await createUserViaAPI();
    const registrationPage = new RegistrationPage(page);
    await registrationPage.register(
      faker.person.firstName(),
      faker.person.lastName(),
      `${process.env.EMAIL}`,
      `${process.env.PASSWORD}`,
      `${process.env.PASSWORD}`
    );
    await expect(page).toHaveURL(`${baseURL}` + '/#/signup');
    await expect(registrationPage.errorAlert).toHaveText('Oops! Email is in use');
    await expect(registrationPage.registerButton).toBeVisible();
  })
})

