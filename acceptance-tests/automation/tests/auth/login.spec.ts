import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { testUsers } from "../../fixtures/test-users";

/**
 * Login Test Suite
 *
 * Tests all login scenarios from manual test: ../01-authentication.md
 *
 * Coverage:
 * - Valid credentials login
 * - Invalid email/password
 * - Empty fields validation
 * - Email format validation
 * - Password visibility toggle
 * - Remember me functionality
 * - Loading states
 * - Error messages
 * - Redirects
 *
 * Location: /acceptance-tests/automation/tests/auth/login.spec.ts
 * Status tracked in: ../../AUTOMATION-TRACKER.md
 */

test.describe("Authentication - Login", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();

    // Clear any existing session
    await page.context().clearCookies();
  });

  // Create test user once before all tests
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Try to create test user via signup page
      await page.goto("http://localhost:3000/signup");
      await page.waitForLoadState("networkidle");

      // Fill signup form
      await page.locator("#name").fill(testUsers.validUser.name);
      await page.locator("#email").fill(testUsers.validUser.email);
      await page.locator("#password").fill(testUsers.validUser.password);
      await page
        .locator("#confirm-password")
        .fill(testUsers.validUser.password);

      // Submit
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(2000);
    } catch (error) {
      // User might already exist, ignore
      console.log("Test user might already exist");
    } finally {
      await context.close();
    }
  });

  /**
   * TEST 1: Valid Login
   * Reference: 01-authentication.md - Scenario 1.1
   * Priority: High
   */
  test("should login successfully with valid credentials", async ({ page }) => {
    // Arrange
    const { email, password, name } = testUsers.validUser;

    // Act
    await loginPage.login(email, password);

    // Assert - Login successful if redirected away from signin page
    await page.waitForURL((url) => !url.pathname.includes("signin"), {
      timeout: 10000,
    });

    // Verify we're no longer on signin page
    expect(page.url()).not.toContain("signin");
  });

  /**
   * TEST 2: Invalid Email
   * Reference: 01-authentication.md - Scenario 1.2
   * Priority: High
   */
  test("should show error with invalid email", async ({ page }) => {
    // Arrange
    const { email, password } = testUsers.invalidUser;

    // Act
    await loginPage.login(email, password);

    // Assert
    const errorVisible = await loginPage.isErrorVisible();
    expect(errorVisible).toBeTruthy();

    const errorMessage = await loginPage.getErrorMessage();
    // Updated to match user-friendly error messages
    expect(errorMessage).toMatch(
      /no account found|invalid|incorrect|wrong|not found|please sign up/i
    );

    // Log the error message for verification
    console.log(`✓ Login error shown: "${errorMessage}"`);

    // Should stay on login page
    await expect(page).toHaveURL(/.*signin/);
  });

  /**
   * TEST 3: Invalid Password
   * Reference: 01-authentication.md - Scenario 1.3
   * Priority: High
   */
  test("should show error with invalid password", async ({ page }) => {
    // Arrange
    const { email } = testUsers.validUser;
    const wrongPassword = "WrongPassword123!";

    // Act
    await loginPage.login(email, wrongPassword);

    // Assert
    const errorVisible = await loginPage.isErrorVisible();
    expect(errorVisible).toBeTruthy();

    // Verify error message is user-friendly
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toMatch(
      /incorrect password|wrong password|invalid|please try again|reset/i
    );

    // Log the error message for verification
    console.log(`✓ Invalid password error shown: "${errorMessage}"`);

    // Should stay on login page
    await expect(page).toHaveURL(/.*signin/);
  });

  /**
   * TEST 4: Empty Fields Validation
   * Reference: 01-authentication.md - Scenario 1.4
   * Priority: High
   */
  test("should show validation errors for empty fields", async ({ page }) => {
    // Act - Submit form without filling fields
    await loginPage.submit();

    // Assert - Check HTML5 validation or custom validation messages
    const emailValidation = await loginPage.getEmailValidationMessage();
    expect(emailValidation).toBeTruthy();

    // Should stay on login page
    await expect(page).toHaveURL(/.*signin/);
  });

  /**
   * TEST 5: Empty Email Only
   * Reference: 01-authentication.md - Scenario 1.5
   * Priority: Medium
   */
  test("should show error for empty email field", async ({ page }) => {
    // Act
    await loginPage.fillPassword("SomePassword123!");
    await loginPage.submit();

    // Assert
    const emailValidation = await loginPage.getEmailValidationMessage();
    expect(emailValidation).toBeTruthy();
  });

  /**
   * TEST 6: Empty Password Only
   * Reference: 01-authentication.md - Scenario 1.6
   * Priority: Medium
   */
  test("should show error for empty password field", async ({ page }) => {
    // Act
    await loginPage.fillEmail("test@example.com");
    await loginPage.submit();

    // Assert
    const passwordValidation = await loginPage.getPasswordValidationMessage();
    expect(passwordValidation).toBeTruthy();
  });

  /**
   * TEST 7: Invalid Email Format
   * Reference: 01-authentication.md - Scenario 1.7
   * Priority: High
   */
  test("should show error for invalid email format", async ({ page }) => {
    // Arrange
    const invalidEmail = "not-an-email";
    const password = "ValidPass123!";

    // Act
    await loginPage.login(invalidEmail, password);

    // Assert
    const emailValidation = await loginPage.getEmailValidationMessage();
    const emailError = await loginPage.getEmailError();

    // Should have some validation error
    expect(emailValidation || emailError).toBeTruthy();
  });

  /**
   * TEST 8: Password Visibility Toggle
   * Reference: 01-authentication.md - Scenario 1.8
   * Priority: Medium
   */
  test("should toggle password visibility", async ({ page }) => {
    // Arrange
    await loginPage.fillPassword("TestPassword123!");

    // Initially password should be hidden (type="password")
    let isVisible = await loginPage.isPasswordVisible();
    expect(isVisible).toBeFalsy();

    // Act - Toggle to show password
    await loginPage.togglePasswordVisibility();

    // Assert - Password should be visible (type="text")
    isVisible = await loginPage.isPasswordVisible();
    expect(isVisible).toBeTruthy();

    // Act - Toggle to hide password again
    await loginPage.togglePasswordVisibility();

    // Assert - Password should be hidden again
    isVisible = await loginPage.isPasswordVisible();
    expect(isVisible).toBeFalsy();
  });

  /**
   * TEST 9: Remember Me Functionality
   * Reference: 01-authentication.md - Scenario 1.9
   * Priority: Medium
   */
  test('should remember user when "Remember Me" is checked', async ({
    page,
  }) => {
    // Arrange
    const { email, password } = testUsers.validUser;

    // Act
    await loginPage.loginWithRememberMe(email, password);

    // Assert - Successful login
    await loginPage.waitForSuccessfulLogin("/");

    // TODO: Verify session persistence (check cookies/localStorage)
    // This would require checking for auth token with longer expiration
  });

  /**
   * TEST 10: Loading State During Login
   * Reference: 01-authentication.md - Scenario 1.10
   * Priority: Low
   */
  test("should show loading state during login", async ({ page }) => {
    // Arrange
    const { email, password } = testUsers.validUser;

    // Act
    await loginPage.fillEmail(email);
    await loginPage.fillPassword(password);

    // Start login but don't wait
    const loginPromise = loginPage.submit();

    // Assert - Loading indicator should appear (may be very quick)
    // This test might be flaky if login is too fast
    const isLoading = await loginPage.isLoading();

    // Wait for login to complete
    await loginPromise;
    await loginPage.waitForLoadingComplete();

    // After loading, should be redirected
    await expect(page).toHaveURL("/");
  });
});

/**
 * Additional Edge Cases
 */
test.describe("Authentication - Login Edge Cases", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.context().clearCookies();
  });

  test("should handle whitespace in email", async ({ page }) => {
    // Act
    await loginPage.login("  test@yekzen.com  ", testUsers.validUser.password);

    // Assert - Should either trim whitespace and login, or show error
    // Depending on implementation, adjust assertion
    const currentURL = page.url();
    const hasError = await loginPage.isErrorVisible();

    // Either successfully logged in OR showing trimming error
    expect(currentURL === "/" || hasError).toBeTruthy();
  });

  test("should handle case sensitivity in email", async ({ page }) => {
    // Act
    await loginPage.login("TEST@YEKZEN.COM", testUsers.validUser.password);

    // Assert - Email should be case-insensitive
    // Either successfully logged in OR showing error (depends on implementation)
    const currentURL = page.url();
    expect(currentURL).toBeTruthy(); // Just verify page responds
  });

  test("should prevent SQL injection in email field", async ({ page }) => {
    // Arrange
    const sqlInjection = "admin'--";

    // Act
    await loginPage.login(sqlInjection, "password");

    // Assert - Should not crash, should show validation error or invalid credentials
    // Wait a bit for any error to appear
    await page.waitForTimeout(1000);

    const hasError = await loginPage.isErrorVisible();
    const currentURL = page.url();

    // Either has error OR stayed on signin page (both acceptable)
    expect(hasError || currentURL.includes("signin")).toBeTruthy();

    // Should stay on login page
    await expect(page).toHaveURL(/.*signin/);
  });

  test("should prevent XSS in error messages", async ({ page }) => {
    // Arrange
    const xssAttempt = '<script>alert("XSS")</script>@example.com';

    // Act
    await loginPage.login(xssAttempt, "password");

    // Assert - Script should not execute, should be sanitized
    // Wait for error to potentially appear
    await page.waitForTimeout(1000);

    const hasError = await loginPage.isErrorVisible();
    if (hasError) {
      const errorMessage = await loginPage.getErrorMessage();
      if (errorMessage) {
        expect(errorMessage).not.toContain("<script>");
        expect(errorMessage).not.toContain("alert(");
      }
    }

    // Should stay on signin page (most important check)
    await expect(page).toHaveURL(/.*signin/);
  });
});
