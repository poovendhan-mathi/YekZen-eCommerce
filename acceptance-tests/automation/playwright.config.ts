import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration for YekZen eCommerce
 *
 * IMPORTANT: This config is for acceptance test automation
 * Location: /acceptance-tests/automation/
 *
 * See AUTOMATION-TRACKER.md for implementation status
 */

export default defineConfig({
  // Test directory
  testDir: "./tests",

  // Timeout settings
  timeout: 60 * 1000, // 60 seconds per test (increased for slow pages)
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    // Collect trace when retrying the failed test
    trace: "on-first-retry",

    // Screenshot on every step for comprehensive reporting
    screenshot: "on",

    // Video on failure for debugging
    video: "retain-on-failure",

    // Viewport size
    viewport: { width: 1280, height: 720 },

    // Emulate device settings
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,

    // Default navigation timeout
    navigationTimeout: 30000,

    // Default action timeout
    actionTimeout: 10000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Chrome-specific settings
        launchOptions: {
          args: ["--disable-dev-shm-usage"],
        },
      },
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

    // Mobile viewports - uncomment when needed
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    // Tablet viewports
    // {
    //   name: 'iPad',
    //   use: { ...devices['iPad Pro'] },
    // },
  ],

  // Run your local dev server before starting the tests
  // Comment out if server is already running
  webServer: {
    command: "cd ../.. && npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes to start server
    stdout: "ignore",
    stderr: "pipe",
  },

  // Output directory for test artifacts
  outputDir: "test-results/",

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  snapshotDir: "snapshots/",
});
