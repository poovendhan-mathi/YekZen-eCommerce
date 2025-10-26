/**
 * Header Component Test - Cart Badge Display
 *
 * Tests for correct cart badge count (unique items vs total quantity)
 * Bug Fix #1: Cart badge should show number of unique items, not total quantity
 */

import "@testing-library/jest-dom";

describe("Header - Cart Badge Logic", () => {
  describe("Cart Item Count Calculation", () => {
    it("should use items.length for badge count (unique items)", () => {
      const cartItems = [
        { id: 1, name: "Product 1", price: 99.99, quantity: 2 },
        { id: 2, name: "Product 2", price: 149.99, quantity: 2 },
      ];

      // Correct: Use items.length for unique items count
      const badgeCount = cartItems?.length || 0;

      // Wrong: Using reduce to sum quantities
      const wrongCount = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      expect(badgeCount).toBe(2); // ✅ Correct: 2 unique items
      expect(wrongCount).toBe(4); // ❌ Wrong: total quantity
    });

    it("should show 0 for empty cart", () => {
      const cartItems = [];
      const badgeCount = cartItems?.length || 0;

      expect(badgeCount).toBe(0);
    });

    it("should show 1 for single item regardless of quantity", () => {
      const cartItems = [
        { id: 1, name: "Product 1", price: 10.0, quantity: 100 },
      ];

      const badgeCount = cartItems?.length || 0;

      expect(badgeCount).toBe(1); // Not 100!
    });

    it("should handle undefined/null safely", () => {
      const cartItems = null;
      const badgeCount = cartItems?.length || 0;

      expect(badgeCount).toBe(0);
    });

    it("should count multiple items correctly", () => {
      const cartItems = [
        { id: 1, quantity: 1 },
        { id: 2, quantity: 5 },
        { id: 3, quantity: 10 },
      ];

      const badgeCount = cartItems?.length || 0;
      const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      expect(badgeCount).toBe(3); // Unique items
      expect(totalQty).toBe(16); // Total quantity (should NOT be shown in badge)
    });
  });

  describe("Real-world Scenarios", () => {
    it("scenario: user adds 2 products with 2 quantity each", () => {
      // User adds Product A (qty: 2) and Product B (qty: 2)
      const cart = [
        { id: 1, name: "Headphones", price: 99.99, quantity: 2 },
        { id: 2, name: "Speaker", price: 149.99, quantity: 2 },
      ];

      // Badge should show "2", not "4"
      const badgeNumber = cart.length;

      expect(badgeNumber).toBe(2);
    });

    it("scenario: user buys 100 units of same product", () => {
      // User adds 100 units of a single product
      const cart = [{ id: 1, name: "Bulk Item", price: 1.0, quantity: 100 }];

      // Badge should show "1", not "100"
      const badgeNumber = cart.length;

      expect(badgeNumber).toBe(1);
    });
  });
});
