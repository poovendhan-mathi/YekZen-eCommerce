import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * SignupPage - Page Object Model for signup/registration functionality
 *
 * This class encapsulates all elements and actions related to user registration.
 * Uses ID-based selectors for maximum reliability.
 *
 * @extends BasePage
 */
export class SignupPage extends BasePage {
  // Form input fields
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly termsCheckbox: Locator;

  // Action buttons
  readonly submitButton: Locator;
  readonly showPasswordButton: Locator;
  readonly showConfirmPasswordButton: Locator;

  // Messages and feedback
  readonly errorMessage: Locator;

  // Navigation links
  readonly signInLink: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;

  // Social login buttons
  readonly googleButton: Locator;
  readonly facebookButton: Locator;

  constructor(page: Page) {
    super(page);

    // Form inputs - using ID selectors for reliability
    this.nameInput = page.locator("#name");
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.confirmPasswordInput = page.locator("#confirm-password");
    this.termsCheckbox = page.locator("#agree-terms");

    // Buttons
    this.submitButton = page.locator("#signup-submit-button");
    this.showPasswordButton = page.locator("#toggle-password-visibility");
    this.showConfirmPasswordButton = page.locator(
      "#toggle-confirm-password-visibility"
    );

    // Error message
    this.errorMessage = page.locator("#signup-error");

    // Links
    this.signInLink = page.locator('a[href="/signin"]');
    this.termsLink = page.locator('a[href="/terms"]');
    this.privacyLink = page.locator('a[href="/privacy"]');

    // Social buttons - using text content
    this.googleButton = page.locator('button:has-text("Google")');
    this.facebookButton = page.locator('button:has-text("Facebook")');
  }

  /**
   * Navigate to the signup page
   */
  override async goto(): Promise<void> {
    await super.goto("/signup");
    await this.waitForPageLoad();
    await expect(this.page).toHaveURL(/.*signup/);
  }

  /**
   * Fill the signup form with user data
   * @param name - User's full name
   * @param email - User's email address
   * @param password - User's password
   * @param confirmPassword - Password confirmation
   * @param acceptTerms - Whether to accept terms and conditions
   */
  async fillSignupForm(
    name: string,
    email: string,
    password: string,
    confirmPassword: string = password,
    acceptTerms: boolean = true
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);

    if (acceptTerms) {
      await this.termsCheckbox.check();
    }
  }

  /**
   * Submit the signup form
   */
  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Complete signup - fill form and submit
   * @param name - User's full name
   * @param email - User's email address
   * @param password - User's password
   * @param confirmPassword - Password confirmation
   * @param acceptTerms - Whether to accept terms
   */
  async signup(
    name: string,
    email: string,
    password: string,
    confirmPassword: string = password,
    acceptTerms: boolean = true
  ): Promise<void> {
    await this.fillSignupForm(
      name,
      email,
      password,
      confirmPassword,
      acceptTerms
    );
    await this.submitForm();
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.showPasswordButton.click();
  }

  /**
   * Toggle confirm password visibility
   */
  async toggleConfirmPasswordVisibility(): Promise<void> {
    await this.showConfirmPasswordButton.click();
  }

  /**
   * Check if password is visible (type="text")
   */
  async isPasswordVisible(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute("type");
    return type === "text";
  }

  /**
   * Check if confirm password is visible (type="text")
   */
  async isConfirmPasswordVisible(): Promise<boolean> {
    const type = await this.confirmPasswordInput.getAttribute("type");
    return type === "text";
  }

  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string | null> {
    await this.errorMessage.waitFor({ state: "visible", timeout: 5000 });
    return await this.errorMessage.textContent();
  }

  /**
   * Check if error message is displayed
   */
  async hasError(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: "visible", timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if submit button is disabled
   */
  async isSubmitDisabled(): Promise<boolean> {
    return await this.submitButton.isDisabled();
  }

  /**
   * Get the submit button text
   */
  async getSubmitButtonText(): Promise<string | null> {
    return await this.submitButton.textContent();
  }

  /**
   * Check if submit button shows loading state
   */
  async isLoading(): Promise<boolean> {
    const text = await this.getSubmitButtonText();
    return text?.includes("Creating account...") ?? false;
  }

  /**
   * Navigate to sign in page
   */
  async goToSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  /**
   * Click Google signup button
   */
  async signupWithGoogle(): Promise<void> {
    await this.googleButton.click();
  }

  /**
   * Click Facebook signup button
   */
  async signupWithFacebook(): Promise<void> {
    await this.facebookButton.click();
  }

  /**
   * Verify signup page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.nameInput.waitFor({ state: "visible" });
    await this.emailInput.waitFor({ state: "visible" });
    await this.passwordInput.waitFor({ state: "visible" });
    await this.confirmPasswordInput.waitFor({ state: "visible" });
    await this.submitButton.waitFor({ state: "visible" });
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.nameInput.clear();
    await this.emailInput.clear();
    await this.passwordInput.clear();
    await this.confirmPasswordInput.clear();

    // Uncheck terms if checked
    if (await this.termsCheckbox.isChecked()) {
      await this.termsCheckbox.uncheck();
    }
  }

  /**
   * Get validation state of name input
   */
  async getNameValidationState(): Promise<string | null> {
    return await this.nameInput.getAttribute("aria-invalid");
  }

  /**
   * Get validation state of email input
   */
  async getEmailValidationState(): Promise<string | null> {
    return await this.emailInput.getAttribute("aria-invalid");
  }
}
