import { Page } from "@playwright/test";

/**
 * Base Page Object Model
 *
 * All page objects should extend this class
 * Provides common functionality for all pages
 *
 * Location: /acceptance-tests/automation/pages/BasePage.ts
 * Updated in: AUTOMATION-TRACKER.md
 */

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path
   */
  async goto(path: string) {
    await this.page.goto(path);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Wait for page to be loaded (DOM ready)
   */
  async waitForDOMLoad() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /**
   * Wait for a specific time (use sparingly)
   */
  async wait(milliseconds: number) {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Reload current page
   */
  async reload() {
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack() {
    await this.page.goBack();
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Check if element exists in DOM
   */
  async exists(selector: string): Promise<boolean> {
    return (await this.page.locator(selector).count()) > 0;
  }

  /**
   * Get text content of element
   */
  async getTextContent(selector: string): Promise<string | null> {
    return await this.page.locator(selector).textContent();
  }

  /**
   * Click element with retry
   */
  async clickWithRetry(selector: string, maxRetries: number = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.page.locator(selector).click();
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.wait(1000);
      }
    }
  }

  /**
   * Fill input field
   */
  async fillInput(selector: string, value: string) {
    await this.page.locator(selector).fill(value);
  }

  /**
   * Clear input field
   */
  async clearInput(selector: string) {
    await this.page.locator(selector).clear();
  }

  /**
   * Get attribute value
   */
  async getAttribute(
    selector: string,
    attribute: string
  ): Promise<string | null> {
    return await this.page.locator(selector).getAttribute(attribute);
  }

  /**
   * Check if checkbox/radio is checked
   */
  async isChecked(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isChecked();
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation() {
    await this.page.waitForNavigation();
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForURL(urlPattern: string | RegExp) {
    await this.page.waitForURL(urlPattern);
  }

  /**
   * Get all text contents from elements matching selector
   */
  async getAllTextContents(selector: string): Promise<string[]> {
    return await this.page.locator(selector).allTextContents();
  }

  /**
   * Count elements matching selector
   */
  async countElements(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  /**
   * Check if page has error (console errors)
   */
  async hasConsoleErrors(): Promise<boolean> {
    const errors: string[] = [];
    this.page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    return errors.length > 0;
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Hover over element
   */
  async hover(selector: string) {
    await this.page.locator(selector).hover();
  }

  /**
   * Double click element
   */
  async doubleClick(selector: string) {
    await this.page.locator(selector).dblclick();
  }

  /**
   * Right click element
   */
  async rightClick(selector: string) {
    await this.page.locator(selector).click({ button: "right" });
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, value: string) {
    await this.page.locator(selector).selectOption(value);
  }

  /**
   * Upload file
   */
  async uploadFile(selector: string, filePath: string) {
    await this.page.locator(selector).setInputFiles(filePath);
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  /**
   * Type text with delay between keystrokes
   */
  async typeWithDelay(selector: string, text: string, delay: number = 100) {
    await this.page.locator(selector).pressSequentially(text, { delay });
  }
}
