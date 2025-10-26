/**
 * Test Suite: Cart Context - Item Count Logic
 * Tests that cart badge shows number of unique items, not total quantity
 *
 * Bug Fix #1: getItemCount should return items.length, not sum of quantities
 */

import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../../contexts/CartContext";
import { ReactNode } from "react";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Cart Context - Item Count Logic", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("getItemCount - Unique Items vs Total Quantity", () => {
    it("should return number of unique items, not total quantity", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        // Add 2 different products with quantity 2 each
        result.current.addToCart({
          id: 1,
          name: "Product 1",
          description: "Test product 1",
          price: 99.99,
          quantity: 1,
          image: "/img1.jpg",
        });
      });

      act(() => {
        result.current.addToCart({
          id: 2,
          name: "Product 2",
          description: "Test product 2",
          price: 149.99,
          quantity: 1,
          image: "/img2.jpg",
        });
      });

      // Update quantities
      act(() => {
        result.current.updateQuantity(1, 2);
        result.current.updateQuantity(2, 2);
      });

      // Should return 2 (unique items), NOT 4 (total quantity)
      const itemCount = result.current.getItemCount();
      const totalQuantity = result.current.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      expect(itemCount).toBe(2); // ✅ Unique items
      expect(totalQuantity).toBe(4); // Total quantity (should NOT be used for badge)
    });

    it("should return 0 for empty cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      const itemCount = result.current.getItemCount();

      expect(itemCount).toBe(0);
    });

    it("should return 1 for single item with high quantity", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: 1,
          name: "Bulk Product",
          description: "Bulk item",
          price: 10.0,
          quantity: 100,
          image: "/img.jpg",
        });
      });

      const itemCount = result.current.getItemCount();
      const totalQuantity = result.current.items[0]?.quantity || 0;

      expect(itemCount).toBe(1); // ✅ Unique items
      expect(totalQuantity).toBe(100); // Total quantity
    });

    it("should return correct count for multiple items", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: 1,
          name: "Product 1",
          description: "Test 1",
          price: 99.99,
          quantity: 1,
          image: "/img1.jpg",
        });
        result.current.addToCart({
          id: 2,
          name: "Product 2",
          description: "Test 2",
          price: 149.99,
          quantity: 5,
          image: "/img2.jpg",
        });
        result.current.addToCart({
          id: 3,
          name: "Product 3",
          description: "Test 3",
          price: 199.99,
          quantity: 2,
          image: "/img3.jpg",
        });
      });

      const itemCount = result.current.getItemCount();
      const totalQuantity = result.current.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      expect(itemCount).toBe(3); // 3 unique items
      expect(totalQuantity).toBe(8); // 1 + 5 + 2 = 8 total
    });
  });

  describe("Real-world Cart Badge Scenarios", () => {
    it("scenario: user adds 2 products with 2 quantity each - badge should show 2", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: 1,
          name: "Headphones",
          description: "Wireless headphones",
          price: 99.99,
          quantity: 2,
          image: "/headphones.jpg",
        });
        result.current.addToCart({
          id: 2,
          name: "Speaker",
          description: "Bluetooth speaker",
          price: 149.99,
          quantity: 2,
          image: "/speaker.jpg",
        });
      });

      const badgeCount = result.current.getItemCount();

      expect(badgeCount).toBe(2); // Badge shows 2, not 4
    });

    it("scenario: user removes item - badge count should decrease", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: 1,
          name: "Product 1",
          description: "Test",
          price: 99.99,
          quantity: 1,
          image: "/img1.jpg",
        });
        result.current.addToCart({
          id: 2,
          name: "Product 2",
          description: "Test",
          price: 149.99,
          quantity: 1,
          image: "/img2.jpg",
        });
      });

      expect(result.current.getItemCount()).toBe(2);

      act(() => {
        result.current.removeFromCart(1);
      });

      expect(result.current.getItemCount()).toBe(1);
    });

    it("scenario: user clears cart - badge count should be 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: 1,
          name: "Product 1",
          description: "Test",
          price: 99.99,
          quantity: 1,
          image: "/img1.jpg",
        });
      });

      expect(result.current.getItemCount()).toBe(1);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.getItemCount()).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle cart with items of quantity 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart({
          id: 1,
          name: "Product 1",
          description: "Test",
          price: 99.99,
          quantity: 1,
          image: "/img1.jpg",
        });
      });

      act(() => {
        result.current.updateQuantity(1, 0);
      });

      // Item with quantity 0 might be removed or kept depending on implementation
      const itemCount = result.current.getItemCount();
      expect(typeof itemCount).toBe("number");
      expect(itemCount).toBeGreaterThanOrEqual(0);
    });

    it("should handle rapid add/remove operations", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        for (let i = 1; i <= 5; i++) {
          result.current.addToCart({
            id: i,
            name: `Product ${i}`,
            description: `Test ${i}`,
            price: 99.99,
            quantity: 1,
            image: `/img${i}.jpg`,
          });
        }
      });

      expect(result.current.getItemCount()).toBe(5);

      act(() => {
        result.current.removeFromCart(1);
        result.current.removeFromCart(3);
        result.current.removeFromCart(5);
      });

      expect(result.current.getItemCount()).toBe(2);
    });
  });
});
