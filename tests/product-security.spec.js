const { test, expect } = require('@playwright/test');
const { ProductListingPage, ProductDetailPage } = require('./page-objects/product-pages');

test.describe('Product page security checks', () => {
  test('malicious search input does not execute scripts or break the UI', async ({ page }) => {
    let dialogSeen = false;
    const pageErrors = [];

    page.on('dialog', () => {
      dialogSeen = true;
    });
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    await page.goto('/products?search=<script>alert("x")</script>');
    await expect(page.locator('body')).toBeVisible({ timeout: 15000 });

    expect(dialogSeen).toBeFalsy();
    expect(pageErrors).toEqual([]);

    const bodyHTML = await page.locator('body').innerHTML();
    expect(bodyHTML).not.toContain('<script>alert("x")</script>');
    expect(bodyHTML).not.toMatch(/<script[^>]*>.*alert\(/i);
  });

  test('invalid product ID route is handled safely', async ({ page }) => {
    const response = await page.goto('/product_details/999999', { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect([200, 400, 404, 422]).toContain(response.status());

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toMatch(/(stack trace|exception|fatal|panic|server error|referenceerror|sql|database|credential)/i);
  });

  test('valid product details page does not expose sensitive server details', async ({ page }) => {
    const listing = new ProductListingPage(page);
    await listing.goto();
    await listing.openFirstProduct();

    const detail = new ProductDetailPage(page);
    await detail.expectLoaded();

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toMatch(/(stack trace|exception|fatal|panic|server error|referenceerror|sql|database|credential|secret|password)/i);
    await expect(detail.productHeader).toBeVisible();
  });
});
