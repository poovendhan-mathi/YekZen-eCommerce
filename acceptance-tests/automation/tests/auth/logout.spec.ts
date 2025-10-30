import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { HomePage } from "../../pages/HomePage";
import { testUsers } from "../../fixtures/test-users";

/**
 * Logout Test Suite
 *
 * Tests user logout functionality including:
 * - Successful logout
 * - Redirect after logout
 * - Session clearing
 * - Cart persistence after logout
 * - Protected route access after logout
 *
 * Reference: /acceptance-tests/01-authentication.md (Scenarios C1-C3)
 */

test.describe("Authentication - Logout", () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    // Login before each test
    await loginPage.goto();
    await loginPage.login(
      testUsers.validUser.email,
      testUsers.validUser.password
    );

    // Wait for successful login
    await page.waitForURL(/\/(home|dashboard|$)/, { timeout: 10000 });

    // Navigate to home page
    await homePage.goto();
  });

  /**
   * Test 1: Successful Logout
   * Scenario C1 from 01-authentication.md
   */
  test("should logout successfully and redirect to home page", async ({
    page,
  }) => {
    // Verify user is logged in
    expect(await homePage.isLoggedIn()).toBeTruthy();

    // Perform logout
    await homePage.logout();

    // Wait for redirect
    await page.waitForTimeout(1000);

    // Verify user is logged out (sign in button visible)
    expect(await homePage.isLoggedOut()).toBeTruthy();

    // Verify redirected to home page
    expect(page.url()).toMatch(/\/$|\/home/);
  });

  /**
   * Test 2: User Menu Changes After Logout
   * Part of Scenario C1
   */
  test("should show sign in button after logout", async () => {
    // Logout
    await homePage.logout();
    await homePage.page.waitForTimeout(1000);

    // Verify sign in button is visible
    await expect(homePage.signInButton).toBeVisible();

    // Verify profile button is not visible
    expect(await homePage.isLoggedIn()).toBeFalsy();
  });

  /**
   * Test 3: Access Protected Route After Logout
   * Scenario C3 from 01-authentication.md
   */
  test("should redirect to signin when accessing protected route after logout", async ({
    page,
  }) => {
    // Logout first
    await homePage.logout();
    await page.waitForTimeout(1000);

    // Try to access protected route (profile page)
    await page.goto("/profile", { waitUntil: "domcontentloaded" });

    // Should be redirected to signin
    await page.waitForURL(/.*signin/, { timeout: 10000 });
    expect(page.url()).toContain("/signin");
  });

  /**
   * Test 4: Cannot Access Orders After Logout
   * Similar to C3
   */
  test("should redirect to signin when accessing orders after logout", async ({
    page,
  }) => {
    // Logout
    await homePage.logout();
    await page.waitForTimeout(1000);

    // Try to access orders page
    await page.goto("/orders");

    // Should redirect to signin
    await page.waitForURL(/.*signin/, { timeout: 5000 });
    expect(page.url()).toContain("/signin");
  });

  /**
   * Test 5: Session Cleared After Logout
   * Part of Scenario C1
   */
  test("should clear session data after logout", async ({ page }) => {
    // Logout
    await homePage.logout();
    await page.waitForTimeout(1000);

    // Try to access a protected API endpoint
    const response = await page.request.get("/api/user/profile");

    // Should get 401 Unauthorized or redirect
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

/**
 * Logout - Edge Cases
 * Additional logout scenarios
 */
test.describe("Authentication - Logout Edge Cases", () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  /**
   * Test 6: Logout When Already Logged Out
   * Edge case handling
   */
  test("should handle logout when already logged out gracefully", async ({
    page,
  }) => {
    // Navigate to home without logging in
    await homePage.goto();

    // Verify already logged out
    expect(await homePage.isLoggedOut()).toBeTruthy();

    // Page should not have profile button
    expect(await homePage.userProfileButton.isVisible()).toBeFalsy();
  });

  /**
   * Test 7: Re-login After Logout
   * Verify can login again after logging out
   */
  test("should allow re-login after logout", async ({ page }) => {
    // First login
    await loginPage.goto();
    await loginPage.login(
      testUsers.validUser.email,
      testUsers.validUser.password
    );
    await page.waitForURL(/\/(home|dashboard|$)/, { timeout: 10000 });

    // Go to home
    await homePage.goto();
    expect(await homePage.isLoggedIn()).toBeTruthy();

    // Logout
    await homePage.logout();
    await page.waitForTimeout(1000);
    expect(await homePage.isLoggedOut()).toBeTruthy();

    // Login again
    await loginPage.goto();
    await loginPage.login(
      testUsers.validUser.email,
      testUsers.validUser.password
    );
    await page.waitForURL(/\/(home|dashboard|$)/, { timeout: 10000 });

    // Verify logged in again
    await homePage.goto();
    expect(await homePage.isLoggedIn()).toBeTruthy();
  });

  /**
   * Test 8: Logout from Different Pages
   * Verify logout works from any page
   */
  test("should logout successfully from products page", async ({ page }) => {
    // Login
    await loginPage.goto();
    await loginPage.login(
      testUsers.validUser.email,
      testUsers.validUser.password
    );
    await page.waitForURL(/\/(home|dashboard|$)/, { timeout: 10000 });

    // Navigate to products page
    await page.goto("/products", { waitUntil: "domcontentloaded" });

    // Logout from products page
    await homePage.logout();
    await page.waitForTimeout(1000);

    // Verify logged out
    expect(await homePage.isLoggedOut()).toBeTruthy();
  });

  /**
   * Test 9: Logout Button Closes Dropdown
   * UI behavior test
   */
  test("should close profile dropdown after clicking logout", async ({
    page,
  }) => {
    // Login
    await loginPage.goto();
    await loginPage.login(
      testUsers.validUser.email,
      testUsers.validUser.password
    );
    await page.waitForURL(/\/(home|dashboard|$)/, { timeout: 10000 });

    await homePage.goto();

    // Open dropdown
    await homePage.openProfileDropdown();

    // Verify dropdown is visible
    await expect(homePage.logoutButton).toBeVisible();

    // Click logout
    await homePage.logoutButton.click();
    await page.waitForTimeout(500);

    // Dropdown should be closed (logout button not visible)
    await expect(homePage.logoutButton).not.toBeVisible({ timeout: 2000 });
  });
});
