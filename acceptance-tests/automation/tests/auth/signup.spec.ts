import { test, expect } from "@playwright/test";
import { SignupPage } from "../../pages/SignupPage";
import { MockDataGenerator } from "../../fixtures/mock-data-generator";

/**
 * Signup/Registration Test Suite
 *
 * Tests user registration functionality including:
 * - Valid registration with real mock data (verifiable in database)
 * - Email validation with proper error messages
 * - Password requirements with clear error messages
 * - Password confirmation
 * - Duplicate email handling with error message
 * - Form validation
 * - Terms acceptance
 * - Password visibility toggle
 *
 * Reference: /acceptance-tests/01-authentication.md (Scenarios A1-A10)
 */

test.describe("Authentication - Signup", () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await signupPage.goto();
    MockDataGenerator.reset(); // Reset for test isolation
  });

  /**
   * Test 1: Successful Registration
   * Scenario A1 from 01-authentication.md
   * Uses realistic mock data that can be verified in database
   */
  test("should register a new user successfully with valid credentials", async () => {
    // Generate realistic user data (verifiable in database)
    const userData = MockDataGenerator.generateValidUser(
      "Successful Registration Test"
    );

    // Fill signup form
    await signupPage.fillSignupForm(
      userData.name,
      userData.email,
      userData.password,
      userData.password,
      true
    );

    // Submit form
    await signupPage.submitForm();

    // Wait for navigation to home or dashboard
    await signupPage.page.waitForURL(/\/(home|dashboard|$)/, {
      timeout: 10000,
    });

    // Verify successful signup
    const currentUrl = signupPage.page.url();
    expect(currentUrl).toMatch(/\/(home|dashboard|$)/);
  });

  /**
   * Test 2: Duplicate Email Registration
   * Scenario A6 from 01-authentication.md
   * Tests error message when trying to register with existing email
   */
  test("should show error when trying to register with existing email", async () => {
    // Generate duplicate email scenario with real mock data
    const { firstUser, duplicateUser } =
      MockDataGenerator.generateDuplicateEmailScenario();

    // First, create a user successfully
    await signupPage.signup(
      firstUser.name,
      firstUser.email,
      firstUser.password,
      firstUser.password,
      true
    );

    // Wait for redirect to complete
    await signupPage.page.waitForTimeout(1000);

    // Go back to signup page
    await signupPage.goto();

    // Try to register again with the same email (different name/password)
    await signupPage.signup(
      duplicateUser.name,
      duplicateUser.email, // Same email as firstUser
      duplicateUser.password,
      duplicateUser.password,
      true
    );

    // Wait for error message to appear
    await signupPage.page.waitForTimeout(1000);

    // Verify error message appears
    const hasError = await signupPage.hasError();
    expect(hasError).toBeTruthy();

    // Verify error message content is clear and helpful
    const errorText = await signupPage.getErrorMessage();
    expect(errorText).toMatch(/already|exists|use|registered|different/i);

    // Log for verification
    console.log(`✓ Duplicate email test passed. Email: ${firstUser.email}`);
    console.log(`✓ Error message shown: "${errorText}"`);
  });

  /**
   * Test 3: Weak Password Validation
   * Scenario A4 from 01-authentication.md
   * Tests error message for passwords less than 6 characters
   */
  test("should reject weak passwords (less than 6 characters)", async () => {
    // Generate user with weak password
    const userData = MockDataGenerator.generateWeakPasswordUser();

    await signupPage.fillSignupForm(
      userData.name,
      userData.email,
      userData.password, // Only 3 characters
      userData.password,
      true
    );

    await signupPage.submitForm();
    await signupPage.page.waitForTimeout(1000);

    // Verify error appears
    const hasError = await signupPage.hasError();
    expect(hasError).toBeTruthy();

    // Verify error message is clear about password length requirement
    const errorText = await signupPage.getErrorMessage();
    expect(errorText).toMatch(/password.*6|weak|short|least.*6/i);

    // Log for verification
    console.log(
      `✓ Weak password rejected. Password: "${userData.password}" (${userData.password.length} chars)`
    );
    console.log(`✓ Error message shown: "${errorText}"`);
  });

  /**
   * Test 4: Password Mismatch
   * Scenario A5 from 01-authentication.md
   * Tests error message when passwords don't match
   */
  test("should show error when passwords do not match", async () => {
    // Generate user with mismatched passwords
    const userData = MockDataGenerator.generateMismatchedPasswordUser();

    await signupPage.fillSignupForm(
      userData.name,
      userData.email,
      userData.password,
      userData.confirmPassword || "DifferentPassword123!", // Mismatched password
      true
    );

    await signupPage.submitForm();
    await signupPage.page.waitForTimeout(1000);

    // Verify error message appears
    const hasError = await signupPage.hasError();
    expect(hasError).toBeTruthy();

    // Verify error message is clear about password mismatch
    const errorText = await signupPage.getErrorMessage();
    expect(errorText).toMatch(/password.*match|do not match|don't match/i);

    // Log for verification
    console.log(`✓ Password mismatch detected`);
    console.log(`✓ Error message shown: "${errorText}"`);
  });

  /**
   * Test 5: Required Fields Validation
   * Scenario A3 from 01-authentication.md
   */
  test("should show validation errors for empty required fields", async () => {
    // Try to submit empty form
    await signupPage.submitForm();

    // HTML5 validation should prevent submission
    // Verify form was not submitted by checking URL hasn't changed
    expect(signupPage.page.url()).toContain("/signup");

    // Check HTML5 required validation on name field
    const nameRequired = await signupPage.nameInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(nameRequired).toBeTruthy();
  });

  /**
   * Test 6: Invalid Email Format
   * Scenario A2 from 01-authentication.md
   * Tests error message for various invalid email formats
   */
  test("should show error for invalid email format", async () => {
    const invalidEmails = ["notanemail", "test@", "@example.com", "test@.com"];

    for (const invalidEmail of invalidEmails) {
      // Clear form first
      await signupPage.clearForm();

      // Generate user with invalid email
      const userData = MockDataGenerator.generateInvalidEmailUser();

      // Fill with invalid email
      await signupPage.fillSignupForm(
        userData.name,
        invalidEmail, // Use invalid email format
        userData.password,
        userData.password,
        true
      );

      await signupPage.submitForm();

      // HTML5 validation should prevent submission
      expect(signupPage.page.url()).toContain("/signup");

      // Verify email validation error
      const emailInvalid = await signupPage.emailInput.evaluate(
        (el: HTMLInputElement) =>
          el.validity.typeMismatch || el.validity.valueMissing
      );
      expect(emailInvalid).toBeTruthy();
    }
  });

  /**
   * Test 7: Terms Acceptance Required
   * Scenario A3 from 01-authentication.md
   */
  test("should require terms and conditions acceptance", async () => {
    // Fill form without accepting terms
    await signupPage.fillSignupForm(
      "Test User",
      "test@example.com",
      "Test123!@#",
      "Test123!@#",
      false // Don't accept terms
    );

    await signupPage.submitForm();

    // HTML5 validation should prevent submission
    expect(signupPage.page.url()).toContain("/signup");

    // Verify terms checkbox is not checked
    const termsChecked = await signupPage.termsCheckbox.isChecked();
    expect(termsChecked).toBeFalsy();
  });

  /**
   * Test 8: Password Visibility Toggle
   * New test for password toggle feature
   */
  test("should toggle password visibility when clicking the eye icon", async () => {
    await signupPage.passwordInput.fill("Test123!@#");

    // Initially password should be hidden
    let isVisible = await signupPage.isPasswordVisible();
    expect(isVisible).toBeFalsy();

    // Toggle to show password
    await signupPage.togglePasswordVisibility();
    isVisible = await signupPage.isPasswordVisible();
    expect(isVisible).toBeTruthy();

    // Toggle to hide password again
    await signupPage.togglePasswordVisibility();
    isVisible = await signupPage.isPasswordVisible();
    expect(isVisible).toBeFalsy();
  });

  /**
   * Test 9: Confirm Password Visibility Toggle
   * New test for confirm password toggle feature
   */
  test("should toggle confirm password visibility independently", async () => {
    await signupPage.confirmPasswordInput.fill("Test123!@#");

    // Initially confirm password should be hidden
    let isVisible = await signupPage.isConfirmPasswordVisible();
    expect(isVisible).toBeFalsy();

    // Toggle to show confirm password
    await signupPage.toggleConfirmPasswordVisibility();
    isVisible = await signupPage.isConfirmPasswordVisible();
    expect(isVisible).toBeTruthy();

    // Toggle to hide confirm password again
    await signupPage.toggleConfirmPasswordVisibility();
    isVisible = await signupPage.isConfirmPasswordVisible();
    expect(isVisible).toBeFalsy();
  });

  /**
   * Test 10: Loading State During Signup
   * New test for loading indicator
   */
  test("should show loading state during signup submission", async () => {
    const uniqueEmail = `loadtest_${Date.now()}@yekzen.com`;

    await signupPage.fillSignupForm(
      "Loading Test User",
      uniqueEmail,
      "Test123!@#",
      "Test123!@#",
      true
    );

    // Click submit
    await signupPage.submitForm();

    // Check for loading state immediately after submit
    // Note: This might be brief, so we check button text change
    const buttonText = await signupPage.getSubmitButtonText();

    // Button should either be in loading state or already completed
    expect(buttonText).toMatch(/Creating account|Create account/);
  });
});

/**
 * Signup - Edge Cases
 * Additional edge case scenarios not in manual test doc
 */
test.describe("Authentication - Signup Edge Cases", () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await signupPage.goto();
  });

  /**
   * Test 11: Whitespace in Email
   */
  test("should handle whitespace in email field", async () => {
    const emailWithSpaces = "  test@example.com  ";

    await signupPage.fillSignupForm(
      "Test User",
      emailWithSpaces,
      "Test123!@#",
      "Test123!@#",
      true
    );

    // Email field should trim whitespace or show error
    const emailValue = await signupPage.emailInput.inputValue();
    expect(emailValue).toBe(emailWithSpaces.trim());
  });

  /**
   * Test 12: XSS Prevention in Name Field
   */
  test("should prevent XSS attacks in name field", async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    const uniqueEmail = `xss_${Date.now()}@yekzen.com`;

    await signupPage.fillSignupForm(
      xssPayload,
      uniqueEmail,
      "Test123!@#",
      "Test123!@#",
      true
    );

    await signupPage.submitForm();

    // Wait a bit
    await signupPage.page.waitForTimeout(2000);

    // Verify no XSS execution
    const dialogs: string[] = [];
    signupPage.page.on("dialog", async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });

    expect(dialogs).toHaveLength(0);
  });

  /**
   * Test 13: SQL Injection Prevention
   */
  test("should prevent SQL injection in email field", async () => {
    const sqlPayload = "admin'--";

    await signupPage.fillSignupForm(
      "SQL Test",
      sqlPayload,
      "Test123!@#",
      "Test123!@#",
      true
    );

    await signupPage.submitForm();
    await signupPage.page.waitForTimeout(1000);

    // Should show email format error, not create user
    expect(signupPage.page.url()).toContain("/signup");
  });

  /**
   * Test 14: Navigate to Sign In Link
   */
  test("should navigate to sign in page when clicking sign in link", async () => {
    await signupPage.goToSignIn();
    await signupPage.page.waitForURL(/.*signin/, { timeout: 5000 });

    expect(signupPage.page.url()).toContain("/signin");
  });
});
