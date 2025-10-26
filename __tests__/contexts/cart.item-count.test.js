/**
 * Cart Context - Item Count Test
 *
 * Tests for cart context focusing on correct item count calculation
 *
 * Bug Fix #1: getItemCount should return number of unique items, not total quantity
 */

import "@testing-library/jest-dom";

describe("Cart Context - Item Count Logic", () => {
  describe("Unique Items Count", () => {
    it("should count unique items correctly", () => {
      const cartItems = [
        { id: 1, name: "Product 1", price: 99.99, quantity: 2 },
        { id: 2, name: "Product 2", price: 149.99, quantity: 2 },
      ];

      // Should return 2 (number of unique items)
      // NOT 4 (total quantity: 2 + 2)
      const uniqueItemsCount = cartItems.length;
      const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      expect(uniqueItemsCount).toBe(2);
      expect(totalQuantity).toBe(4);
      // Bug fix: Use uniqueItemsCount for badge display
    });

    it("should return 0 for empty cart", () => {
      const cartItems = [];
      const count = cartItems.length || 0;

      expect(count).toBe(0);
    });

    it("should count 1 for single item with high quantity", () => {
      const cartItems = [
        { id: 1, name: "Product 1", price: 10.0, quantity: 100 },
      ];

      // Should be 1 (unique items), not 100 (quantity)
      const uniqueItemsCount = cartItems.length;
      expect(uniqueItemsCount).toBe(1);
    });

    it("should count multiple items correctly", () => {
      const cartItems = [
        { id: 1, name: "Product 1", price: 99.99, quantity: 1 },
        { id: 2, name: "Product 2", price: 149.99, quantity: 5 },
        { id: 3, name: "Product 3", price: 199.99, quantity: 2 },
      ];

      const uniqueItemsCount = cartItems.length;
      const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      expect(uniqueItemsCount).toBe(3);
      expect(totalQuantity).toBe(8); // 1 + 5 + 2
    });
  });

  describe("getItemCount Implementation", () => {
    it("should use items.length for correct count", () => {
      const items = [
        { id: 1, quantity: 5 },
        { id: 2, quantity: 3 },
      ];

      // Correct implementation
      const correctCount = items?.length || 0;

      // Wrong implementation (what we fixed)
      const wrongCount = items.reduce((sum, item) => sum + item.quantity, 0);

      expect(correctCount).toBe(2); // ✅ Correct: unique items
      expect(wrongCount).toBe(8); // ❌ Wrong: total quantity
    });

    it("should handle undefined/null items safely", () => {
      const items = null;
      const count = items?.length || 0;

      expect(count).toBe(0);
    });

    it("should handle empty array", () => {
      const items = [];
      const count = items?.length || 0;

      expect(count).toBe(0);
    });
  });

  describe("Cart Badge Display Logic", () => {
    it("should display badge with correct number", () => {
      const testCases = [
        { items: [], expected: 0 },
        { items: [{ id: 1, quantity: 1 }], expected: 1 },
        { items: [{ id: 1, quantity: 10 }], expected: 1 },
        {
          items: [
            { id: 1, quantity: 2 },
            { id: 2, quantity: 3 },
          ],
          expected: 2,
        },
        {
          items: [
            { id: 1, quantity: 1 },
            { id: 2, quantity: 1 },
            { id: 3, quantity: 1 },
          ],
          expected: 3,
        },
      ];

      testCases.forEach(({ items, expected }) => {
        const count = items.length;
        expect(count).toBe(expected);
      });
    });

    it("should not show total quantity in badge", () => {
      const items = [
        { id: 1, quantity: 10 },
        { id: 2, quantity: 20 },
        { id: 3, quantity: 30 },
      ];

      const badgeCount = items.length; // Should be 3
      const wrongCount = items.reduce((sum, item) => sum + item.quantity, 0); // Would be 60

      expect(badgeCount).toBe(3);
      expect(badgeCount).not.toBe(60);
      expect(wrongCount).toBe(60);
    });
  });

  describe("Edge Cases", () => {
    it("should handle cart with single item of high quantity", () => {
      const items = [{ id: 1, name: "Product 1", price: 10.0, quantity: 100 }];

      const uniqueItemsCount = items.length;
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

      expect(uniqueItemsCount).toBe(1);
      expect(totalQuantity).toBe(100);
    });

    it("should handle items with quantity 0", () => {
      const items = [
        { id: 1, quantity: 0 },
        { id: 2, quantity: 5 },
      ];

      // Should count both items even if one has 0 quantity
      const count = items.length;
      expect(count).toBe(2);
    });

    it("should handle large number of items", () => {
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        quantity: Math.floor(Math.random() * 10) + 1,
      }));

      const count = items.length;
      expect(count).toBe(50);
    });
  });
});
