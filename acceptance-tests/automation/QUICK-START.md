# ⚡ Quick Reference - Playwright Testing

**Location**: `/acceptance-tests/automation/`  
**Last Updated**: January 30, 2025

---

## 🚀 Quick Start

```bash
# 1. Start your dev server
npm run dev

# 2. Run all tests
cd acceptance-tests/automation
npx playwright test

# 3. Run specific test file
npx playwright test tests/auth/login.spec.ts

# 4. Run with UI (see browser)
npx playwright test --headed

# 5. View HTML report
npx playwright show-report
```

---

## 📊 Current Status

| Metric         | Value              |
| -------------- | ------------------ |
| Tests Created  | 14                 |
| Tests Passing  | 7 (50%)            |
| Tests Failing  | 6 (need test user) |
| Execution Time | 20.3s              |

---

## 🔑 Test User Credentials

```typescript
// From: fixtures/test-users.ts
validUser: {
  email: 'test@yekzen.com',
  password: 'Test@123456',
  name: 'Test User'
}

adminUser: {
  email: 'admin@yekzen.com',
  password: 'Admin@123456',
  name: 'Admin User'
}
```

**⚠️ Note**: These users need to be created in Firebase Auth first!

---

## 🛠️ Setup Test Users (Choose One)

### Option A: Firebase Emulator (Recommended)

```bash
# Terminal 1
npm run emulator

# Terminal 2
cd acceptance-tests/automation
npx playwright test
```

### Option B: Manual Creation

1. Firebase Console → Authentication
2. Add user: `test@yekzen.com` / `Test@123456`
3. Run tests

### Option C: Use Your Account

Edit `fixtures/test-users.ts` with your real credentials

---

## 📁 File Structure

```
acceptance-tests/automation/
├── AUTOMATION-TRACKER.md        # Master progress tracker
├── SESSION-SUMMARY.md           # Today's accomplishments
├── TEST-EXECUTION-SUMMARY.md    # Detailed test results
├── playwright.config.ts         # Configuration
├── pages/                       # Page Object Models
│   ├── BasePage.ts
│   └── LoginPage.ts
├── fixtures/                    # Test data
│   └── test-users.ts
├── tests/auth/                  # Test files
│   └── login.spec.ts           # 14 login tests
└── playwright-report/          # HTML reports
```

---

## 🎯 ID-Based Selectors (Best Practice)

```typescript
// ✅ GOOD - Use IDs (fastest, most reliable)
page.locator("#email");
page.locator("#signin-submit-button");
page.locator("#signin-error");

// ⚠️ OK - Use when ID not available
page.locator('input[type="email"]');
page.getByRole("button", { name: "Submit" });

// ❌ AVOID - Fragile
page.locator(".btn-primary");
page.locator("div > button");
```

---

## 📝 Test Commands Cheat Sheet

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/auth/login.spec.ts

# Run specific test
npx playwright test tests/auth/login.spec.ts:41

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run with specific browser
npx playwright test --project=chromium

# Generate HTML report
npx playwright test --reporter=html

# Show last report
npx playwright show-report

# Update snapshots
npx playwright test --update-snapshots
```

---

## 🐛 Common Issues & Fixes

### Issue: "Executable doesn't exist"

```bash
# Fix: Install browsers
npx playwright install chromium
```

### Issue: "Test user not found"

```bash
# Fix: Create test user in Firebase OR use emulator
npm run emulator
```

### Issue: "Multiple elements found"

```tsx
// Fix: Add unique ID to HTML element
<button id="signin-submit-button" type="submit">
```

### Issue: "Timeout waiting for element"

```typescript
// Fix: Increase timeout or check selector
await page.locator("#email", { timeout: 10000 }).fill("test@example.com");
```

---

## 📊 Test Results Locations

```bash
# HTML Report (interactive)
acceptance-tests/automation/playwright-report/index.html

# Test artifacts
acceptance-tests/automation/test-results/

# Screenshots (on failure)
test-results/**/test-failed-1.png

# Videos (if enabled)
test-results/**/video.webm

# Error context
test-results/**/error-context.md
```

---

## 🎓 Page Object Model Example

```typescript
// pages/LoginPage.ts
export class LoginPage extends BasePage {
  // 1. Define locators using IDs
  readonly emailInput = this.page.locator("#email");
  readonly submitButton = this.page.locator("#signin-submit-button");

  // 2. Create action methods
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  // 3. Create assertion helpers
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
```

---

## 🔄 Test Pattern

```typescript
test("should do something", async ({ page }) => {
  // 1. ARRANGE - Set up test data
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // 2. ACT - Perform action
  await loginPage.login("test@example.com", "password");

  // 3. ASSERT - Verify result
  await expect(page).toHaveURL("/dashboard");
});
```

---

## 🎯 Next Actions

1. ☐ Set up test user in Firebase
2. ☐ Run tests again → should get 100% pass
3. ☐ Create SignupPage.ts
4. ☐ Write signup tests (10 tests)
5. ☐ Continue with logout, password reset, session tests

---

## 📚 Documentation

- **Master Tracker**: `AUTOMATION-TRACKER.md`
- **Today's Summary**: `SESSION-SUMMARY.md`
- **Test Results**: `TEST-EXECUTION-SUMMARY.md`
- **Playwright Docs**: https://playwright.dev/docs/intro
- **Manual Tests**: `../01-authentication.md` to `../12-edge-cases.md`

---

## 💡 Tips

- Always use `npx playwright test` (not `npm test`)
- Use `--headed` to see what's happening
- Check HTML report for detailed failure info
- IDs are the most reliable selectors
- Keep test data in fixtures
- Update AUTOMATION-TRACKER.md after changes

---

**Need Help?**  
Check `SESSION-SUMMARY.md` for detailed explanations!
