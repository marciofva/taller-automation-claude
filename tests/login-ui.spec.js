const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./page-objects/login-page');

test.describe('SauceDemo login UI', () => {
  test('logs in successfully with a valid user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(loginPage.inventoryList).toBeVisible();
    await expect(loginPage.page.locator('.title')).toHaveText('Products');
  });

  test('blocks a locked out user with a clear error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toContainText(/locked out/i);
    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('shows validation when the username is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', 'secret_sauce');

    await expect(loginPage.errorMessage).toContainText(/username is required/i);
    await expect(page).toHaveURL(/\/$/);
  });

  test('shows validation when the password is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', '');

    await expect(loginPage.errorMessage).toContainText(/password is required/i);
    await expect(page).toHaveURL(/\/$/);
  });

  test('shows a generic error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'wrongpass');

    await expect(loginPage.errorMessage).toContainText(/do not match any user/i);
    await expect(page).toHaveURL(/\/$/);
  });
});
