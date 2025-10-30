# 🚀 Playwright Implementation Starter

**YekZen eCommerce - Week 1 Kickstart Guide**  
**Start Date**: [Your Start Date]  
**Goal**: Get 10-15 automated tests running by end of Week 1

---

## Day 1: Setup & Installation (2-3 hours)

### Step 1: Verify/Install Playwright

```bash
# Navigate to project
cd /Volumes/POOVENDHAN/Billing/YekZen-eCommerce

# Check if Playwright is installed
npm list @playwright/test

# If not installed, install it
npm install -D @playwright/test@latest

# Install browsers
npx playwright install

# Install system dependencies (if needed)
npx playwright install-deps
```

### Step 2: Update `playwright.config.ts`

Create or update the file:

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",

  // Timeout settings
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 5000, // 5 seconds for assertions
  },

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ["html"],
    ["list"],
    ["json", { outputFile: "test-results/results.json" }],
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: "http://localhost:3000",

    // Collect trace when retrying the failed test
    trace: "on-first-retry",

    // Screenshot on failure
    screenshot: "only-on-failure",

    // Video on failure
    video: "retain-on-failure",

    // Viewport size
    viewport: { width: 1280, height: 720 },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // Uncomment to test on Firefox
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // Uncomment to test on Safari
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Uncomment for mobile testing
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
  },
});
```

### Step 3: Update `package.json` Scripts

Add these to your `scripts` section:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:report": "playwright show-report",
    "test:e2e:codegen": "playwright codegen http://localhost:3000"
  }
}
```

### Step 4: Verify Setup

```bash
# Run Playwright test runner (no tests yet)
npx playwright test --list

# Open UI mode
npx playwright test --ui
```

---

## Day 2: Create Base Infrastructure (4 hours)

### Step 1: Create Directory Structure

```bash
mkdir -p tests/{e2e,pages,fixtures,utils}
```

### Step 2: Create Base Page Class

**File**: `tests/pages/BasePage.ts`

```typescript
import { Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
```

### Step 3: Create Login Page Object

**File**: `tests/pages/LoginPage.ts`

```typescript
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);

    // Locators - use getByRole, getByLabel for accessibility
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.signInButton = page.getByRole("button", { name: /sign in/i });
    this.errorMessage = page.getByRole("alert");
    this.forgotPasswordLink = page.getByRole("link", {
      name: /forgot password/i,
    });
  }

  async goto() {
    await this.page.goto("/signin");
    await expect(this.page).toHaveURL(/.*signin/);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: "visible" });
    return await this.errorMessage.textContent();
  }

  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }
}
```

### Step 4: Create Test Fixtures

**File**: `tests/fixtures/test-users.ts`

```typescript
export const testUsers = {
  validUser: {
    email: "test@yekzen.com",
    password: "Test123!@#",
    name: "Test User",
  },

  adminUser: {
    email: "admin@yekzen.com",
    password: "Admin123!@#",
    name: "Admin User",
  },

  invalidUser: {
    email: "invalid@example.com",
    password: "WrongPassword123",
  },
};
```

### Step 5: Create Auth Fixture

**File**: `tests/fixtures/auth-fixture.ts`

```typescript
import { test as base, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { testUsers } from "./test-users";

type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
};

export const test = base.extend<AuthFixtures>({
  // Fixture for regular authenticated user
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      testUsers.validUser.email,
      testUsers.validUser.password
    );

    // Wait for redirect to home
    await page.waitForURL("/");

    await use(page);
  },

  // Fixture for admin user
  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      testUsers.adminUser.email,
      testUsers.adminUser.password
    );

    // Wait for redirect to admin dashboard
    await page.waitForURL("/admin");

    await use(page);
  },
});

export { expect } from "@playwright/test";
```

---

## Day 3: Write First Tests (4 hours)

### Test 1: Login - Valid Credentials

**File**: `tests/e2e/auth/login.spec.ts`

```typescript
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { testUsers } from "../../fixtures/test-users";

test.describe("Authentication - Login", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();
  });

  test("should login with valid credentials", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Act
    await loginPage.login(
      testUsers.validUser.email,
      testUsers.validUser.password
    );

    // Assert
    await expect(page).toHaveURL("/");
    await expect(page.getByText(testUsers.validUser.name)).toBeVisible();
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
  });

  test("should show error with invalid email", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Act
    await loginPage.login(
      testUsers.invalidUser.email,
      testUsers.invalidUser.password
    );

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain(/invalid|incorrect|wrong/i);
    await expect(page).toHaveURL(/.*signin/);
  });

  test("should show error with invalid password", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Act
    await loginPage.login(testUsers.validUser.email, "WrongPassword123");

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/.*signin/);
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Act
    await loginPage.signInButton.click();

    // Assert
    // Check for HTML5 validation or custom validation messages
    const emailValidation = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(emailValidation).toBeTruthy();
  });

  test("should navigate to forgot password page", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Act
    await loginPage.forgotPasswordLink.click();

    // Assert
    await expect(page).toHaveURL(/.*forgot-password|reset-password/);
  });
});
```

### Test 2: Homepage

**File**: `tests/e2e/homepage.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load successfully", async ({ page }) => {
    // Act
    await page.goto("/");

    // Assert
    await expect(page).toHaveTitle(/YekZen/i);
    await expect(
      page.getByRole("heading", { name: /yekzen|welcome/i })
    ).toBeVisible();
  });

  test("should display navigation menu", async ({ page }) => {
    // Act
    await page.goto("/");

    // Assert
    await expect(page.getByRole("link", { name: /products/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /cart/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign in|login/i })
    ).toBeVisible();
  });

  test("should display featured products", async ({ page }) => {
    // Act
    await page.goto("/");

    // Assert
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();

    // Check that we have at least one product
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
```

### Test 3: Product Listing

**File**: `tests/e2e/products/product-listing.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Product Listing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
  });

  test("should display product list", async ({ page }) => {
    // Assert
    await expect(
      page.getByRole("heading", { name: /products/i })
    ).toBeVisible();

    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();

    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should display product details on cards", async ({ page }) => {
    // Get first product card
    const firstProduct = page.locator('[data-testid="product-card"]').first();

    // Assert product card has required elements
    await expect(firstProduct.getByRole("img")).toBeVisible();
    await expect(
      firstProduct.locator('[data-testid="product-name"]')
    ).toBeVisible();
    await expect(
      firstProduct.locator('[data-testid="product-price"]')
    ).toBeVisible();
    await expect(
      firstProduct.getByRole("button", { name: /add to cart/i })
    ).toBeVisible();
  });

  test("should navigate to product details on click", async ({ page }) => {
    // Act
    await page.locator('[data-testid="product-card"]').first().click();

    // Assert
    await expect(page).toHaveURL(/\/products\/.+/);
  });
});
```

---

## Day 4: Add More Tests (4 hours)

### Test 4: Shopping Cart

**File**: `tests/e2e/cart/add-to-cart.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Shopping Cart - Add to Cart", () => {
  test("should add product to cart", async ({ page }) => {
    // Arrange
    await page.goto("/products");

    // Act
    await page
      .locator('[data-testid="product-card"]')
      .first()
      .getByRole("button", { name: /add to cart/i })
      .click();

    // Assert - check cart badge
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText("1");

    // Assert - check toast notification
    await expect(page.getByText(/added to cart/i)).toBeVisible();
  });

  test("should update cart badge when adding multiple products", async ({
    page,
  }) => {
    // Arrange
    await page.goto("/products");
    const productCards = page.locator('[data-testid="product-card"]');

    // Act - add 3 products
    for (let i = 0; i < 3; i++) {
      await productCards
        .nth(i)
        .getByRole("button", { name: /add to cart/i })
        .click();
      await page.waitForTimeout(500); // Small delay between adds
    }

    // Assert
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText("3");
  });

  test("should navigate to cart page", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page.getByRole("link", { name: /cart/i }).click();

    // Assert
    await expect(page).toHaveURL("/cart");
    await expect(
      page.getByRole("heading", { name: /shopping cart/i })
    ).toBeVisible();
  });
});
```

### Test 5: Logout

**File**: `tests/e2e/auth/logout.spec.ts`

```typescript
import { test, expect } from "@playwright/test";
import { test as authTest } from "../../fixtures/auth-fixture";

authTest("should logout successfully", async ({ authenticatedPage }) => {
  // Arrange - user is already logged in via fixture
  const page = authenticatedPage;

  // Act
  await page.getByRole("button", { name: /logout/i }).click();

  // Assert
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /logout/i })).not.toBeVisible();
});
```

---

## Day 5: Run & Debug Tests (2 hours)

### Step 1: Run All Tests

```bash
# Run all tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test tests/e2e/auth/login.spec.ts

# Run tests matching pattern
npx playwright test login
```

### Step 2: Use UI Mode (RECOMMENDED)

```bash
# Visual test runner
npm run test:e2e:ui
```

This opens a UI where you can:

- ✅ See all tests
- ✅ Run/debug individual tests
- ✅ See step-by-step execution
- ✅ Inspect DOM
- ✅ Time-travel through test

### Step 3: Debug Failed Tests

```bash
# Debug mode (opens browser inspector)
npm run test:e2e:debug

# Or debug specific test
npx playwright test tests/e2e/auth/login.spec.ts --debug
```

### Step 4: View Test Report

```bash
# Generate and open HTML report
npm run test:e2e:report
```

---

## 📊 Week 1 Goals Checklist

By end of Week 1, you should have:

- [ ] ✅ Playwright installed and configured
- [ ] ✅ `playwright.config.ts` set up
- [ ] ✅ Base page infrastructure created
- [ ] ✅ Test fixtures created
- [ ] ✅ 10-15 tests written and passing:
  - [ ] Login (valid, invalid, empty fields)
  - [ ] Logout
  - [ ] Homepage load
  - [ ] Product listing
  - [ ] Add to cart
  - [ ] Navigation tests
- [ ] ✅ Tests running in CI/CD (optional for Week 1)
- [ ] ✅ Team reviewed and approved

---

## 🎯 Success Metrics (Week 1)

- **Tests Created**: 10-15 ✅
- **Pass Rate**: >90% ✅
- **Execution Time**: <2 minutes ✅
- **Flaky Tests**: 0 ✅

---

## 🔥 Quick Commands Reference

```bash
# Run tests
npm run test:e2e                    # Run all tests (headless)
npm run test:e2e:ui                 # UI mode (recommended)
npm run test:e2e:headed             # See browser
npm run test:e2e:debug              # Debug mode

# Run specific tests
npx playwright test login           # Tests matching "login"
npx playwright test auth/           # All tests in auth folder

# Generate tests (record actions)
npm run test:e2e:codegen

# View reports
npm run test:e2e:report

# Update snapshots (if using visual regression)
npx playwright test --update-snapshots
```

---

## 🆘 Troubleshooting

### Issue: "Browser not found"

```bash
# Solution: Install browsers
npx playwright install
```

### Issue: "Port 3000 already in use"

```bash
# Solution: Update playwright.config.ts
# Set reuseExistingServer: true
```

### Issue: "Test times out"

```bash
# Solution: Increase timeout in playwright.config.ts
timeout: 60 * 1000, // 60 seconds
```

### Issue: "Selector not found"

```bash
# Solution: Use UI mode to inspect selectors
npm run test:e2e:ui
# Click on test, inspect DOM
```

---

## 📚 Resources

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)

---

## ✅ Next Steps (Week 2)

After Week 1 is complete:

1. Add more authentication tests (signup, password reset)
2. Expand cart tests (update quantity, remove items)
3. Start checkout tests
4. Set up CI/CD integration
5. Review with team and iterate

---

**Ready to start?** Run:

```bash
npx playwright test --ui
```

**Good luck! 🚀**
