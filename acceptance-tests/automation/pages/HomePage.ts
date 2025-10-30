import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * HomePage - Page Object Model for home page
 *
 * Represents the home page (/)
 * Used for navigation and checking logged-in state
 */
export class HomePage extends BasePage {
  // Header elements
  readonly userProfileButton: Locator;
  readonly logoutButton: Locator;
  readonly signInButton: Locator;
  readonly signUpButton: Locator;
  readonly profileLink: Locator;
  readonly ordersLink: Locator;
  readonly cartButton: Locator;

  // Navigation links
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly categoriesLink: Locator;
  readonly aboutLink: Locator;
  readonly contactLink: Locator;

  constructor(page: Page) {
    super(page);

    // Header user menu
    this.userProfileButton = page.locator("#user-profile-button");
    this.logoutButton = page.locator("#logout-button");
    this.signInButton = page.locator('button:has-text("Sign In")');
    this.signUpButton = page.locator('button:has-text("Sign Up")');

    // Dropdown links (visible after clicking profile button)
    this.profileLink = page.locator('a[href="/profile"]');
    this.ordersLink = page.locator('a[href="/orders"]');

    // Cart button
    this.cartButton = page.locator('a[href="/cart"]');

    // Navigation
    this.homeLink = page.locator('a[href="/"]').first();
    this.productsLink = page.locator('a[href="/products"]').first();
    this.categoriesLink = page.locator('a[href="/categories"]').first();
    this.aboutLink = page.locator('a[href="/about"]');
    this.contactLink = page.locator('a[href="/contact"]');
  }

  /**
   * Navigate to home page
   */
  override async goto(): Promise<void> {
    await super.goto("/");
    // Don't wait for networkidle on home page - it may have ongoing requests
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Check if user is logged in (profile button visible)
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.userProfileButton.waitFor({ state: "visible", timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if user is logged out (sign in button visible)
   */
  async isLoggedOut(): Promise<boolean> {
    try {
      await this.signInButton.waitFor({ state: "visible", timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Open user profile dropdown
   */
  async openProfileDropdown(): Promise<void> {
    await this.userProfileButton.click();
    await this.logoutButton.waitFor({ state: "visible" });
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.openProfileDropdown();
    await this.logoutButton.click();
  }

  /**
   * Navigate to profile page
   */
  async goToProfile(): Promise<void> {
    await this.openProfileDropdown();
    await this.profileLink.click();
  }

  /**
   * Navigate to orders page
   */
  async goToOrders(): Promise<void> {
    await this.openProfileDropdown();
    await this.ordersLink.click();
  }

  /**
   * Navigate to cart page
   */
  async goToCart(): Promise<void> {
    await this.cartButton.click();
  }

  /**
   * Get user display name from profile button
   */
  async getUserDisplayName(): Promise<string | null> {
    if (await this.isLoggedIn()) {
      return await this.userProfileButton.textContent();
    }
    return null;
  }

  /**
   * Check if cart has items (badge visible)
   */
  async hasCartItems(): Promise<boolean> {
    const badge = this.page.locator('[data-testid="cart-badge"]');
    try {
      await badge.waitFor({ state: "visible", timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    const badge = this.page.locator('[data-testid="cart-badge"]');
    try {
      const text = await badge.textContent();
      return parseInt(text || "0", 10);
    } catch {
      return 0;
    }
  }

  /**
   * Navigate to products page
   */
  async goToProducts(): Promise<void> {
    await this.productsLink.click();
  }

  /**
   * Navigate to categories page
   */
  async goToCategories(): Promise<void> {
    await this.categoriesLink.click();
  }
}
