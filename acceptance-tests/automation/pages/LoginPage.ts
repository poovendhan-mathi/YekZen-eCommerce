import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Login Page Object Model
 *
 * Represents the login page (/signin)
 * Implements Page Object Model pattern
 *
 * Reference: ../01-authentication.md (Login scenarios)
 * Location: /acceptance-tests/automation/pages/LoginPage.ts
 * Updated in: AUTOMATION-TRACKER.md
 */

export class LoginPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly showPasswordButton: Locator;
  readonly loadingSpinner: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators using IDs (most reliable approach)
    // Updated to match actual YekZen signin page structure
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.signInButton = page.locator("#signin-submit-button");
    this.errorMessage = page.locator("#signin-error");
    this.forgotPasswordLink = page.locator('a[href="/forgot-password"]');
    this.signUpLink = page.locator('a[href="/signup"]');
    this.rememberMeCheckbox = page.locator("#remember-me");
    this.showPasswordButton = page.locator("#toggle-password-visibility");
    this.loadingSpinner = page.locator("text=Signing in..."); // Button text changes to "Signing in..."

    // Field-specific error messages (using HTML5 validation)
    this.emailError = page.locator("#email:invalid");
    this.passwordError = page.locator("#password:invalid");
  }

  /**
   * Navigate to login page
   */
  override async goto() {
    await super.goto("/signin");
    await this.waitForPageLoad();
    await expect(this.page).toHaveURL(/.*signin/);
  }

  /**
   * Perform login action
   * @param email - User email
   * @param password - User password
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /**
   * Login with remember me option
   */
  async loginWithRememberMe(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.rememberMeCheckbox.check();
    await this.signInButton.click();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    await this.errorMessage.waitFor({ state: "visible", timeout: 5000 });
    return await this.errorMessage.textContent();
  }

  /**
   * Check if error message is visible
   */
  async isErrorVisible(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: "visible", timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get email field error
   */
  async getEmailError(): Promise<string | null> {
    try {
      await this.emailError.waitFor({ state: "visible", timeout: 2000 });
      return await this.emailError.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Get password field error
   */
  async getPasswordError(): Promise<string | null> {
    try {
      await this.passwordError.waitFor({ state: "visible", timeout: 2000 });
      return await this.passwordError.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Check if loading spinner is visible
   */
  async isLoading(): Promise<boolean> {
    try {
      return await this.loadingSpinner.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete() {
    try {
      await this.loadingSpinner.waitFor({ state: "hidden", timeout: 10000 });
    } catch {
      // Loading spinner might not be present
    }
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility() {
    await this.showPasswordButton.click();
  }

  /**
   * Check if password is visible (not masked)
   */
  async isPasswordVisible(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute("type");
    return type === "text";
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  /**
   * Click sign up link
   */
  async clickSignUp() {
    await this.signUpLink.click();
  }

  /**
   * Check if remember me is checked
   */
  async isRememberMeChecked(): Promise<boolean> {
    return await this.rememberMeCheckbox.isChecked();
  }

  /**
   * Clear login form
   */
  async clearForm() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Fill email only
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill password only
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Submit form (click sign in button)
   */
  async submit() {
    await this.signInButton.click();
  }

  /**
   * Check if sign in button is disabled
   */
  async isSignInButtonDisabled(): Promise<boolean> {
    return await this.signInButton.isDisabled();
  }

  /**
   * Get email input value
   */
  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  /**
   * Get password input value
   */
  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  /**
   * Check for HTML5 validation message on email field
   */
  async getEmailValidationMessage(): Promise<string> {
    return await this.emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
  }

  /**
   * Check for HTML5 validation message on password field
   */
  async getPasswordValidationMessage(): Promise<string> {
    return await this.passwordInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
  }

  /**
   * Wait for redirect after successful login
   * @param expectedURL - Expected URL pattern after login (default: /)
   */
  async waitForSuccessfulLogin(expectedURL: string | RegExp = "/") {
    await this.page.waitForURL(expectedURL, { timeout: 10000 });
  }

  /**
   * Verify user is on login page
   */
  async verifyOnLoginPage() {
    await expect(this.page).toHaveURL(/.*signin/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }
}
