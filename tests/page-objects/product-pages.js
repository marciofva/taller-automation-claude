const { expect } = require('@playwright/test');

class ProductListingPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/products');
  }

  get firstViewProductButton() {
    return this.page.getByRole('link', { name: /view product/i }).first();
  }

  async openFirstProduct() {
    await expect(this.firstViewProductButton).toBeVisible({ timeout: 15000 });
    await this.firstViewProductButton.click();
  }
}

class ProductDetailPage {
  constructor(page) {
    this.page = page;
  }

  get productHeader() {
    return this.page.locator('h2').first();
  }

  get productInformation() {
    return this.page.locator('text=Category').first().or(this.page.locator('text=Availability').first());
  }

  async expectLoaded() {
    await expect(this.productHeader).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { ProductListingPage, ProductDetailPage };
