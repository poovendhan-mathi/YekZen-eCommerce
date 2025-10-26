/**
 * Test Suite: Cart Badge - Unique Item Count
 * Tests that cart badge shows number of unique items, not total quantity
 */

import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../../contexts/CartContext";
import { ReactNode } from "react";
import toast from "react-hot-toast";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Cart Badge - Unique Item Count Fix", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should show 1 when cart has 1 item with quantity 5", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = {
      id: "test-product-1",
      name: "Gaming Laptop",
      price: 1899.99,
      image: "/test.jpg",
      quantity: 5,
    };

    act(() => {
      result.current.addToCart(product);
    });

    // Badge should show 1 (unique items), not 5 (total quantity)
    expect(result.current.getItemCount()).toBe(1);
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0]?.quantity).toBe(5);
  });

  it("should show 3 when cart has 3 different items", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const products = [
      { id: "1", name: "Product 1", price: 100, image: "/1.jpg", quantity: 1 },
      { id: "2", name: "Product 2", price: 200, image: "/2.jpg", quantity: 1 },
      { id: "3", name: "Product 3", price: 300, image: "/3.jpg", quantity: 1 },
    ];

    act(() => {
      products.forEach((p) => result.current.addToCart(p));
    });

    // Badge should show 3 unique items
    expect(result.current.getItemCount()).toBe(3);
    expect(result.current.items.length).toBe(3);
  });

  it("should show 2 when cart has 2 items with varying quantities", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Item 1",
        price: 50,
        image: "/1.jpg",
        quantity: 10, // High quantity
      });
      result.current.addToCart({
        id: "2",
        name: "Item 2",
        price: 75,
        image: "/2.jpg",
        quantity: 3,
      });
    });

    // Badge should show 2 (unique items), not 13 (total quantity)
    expect(result.current.getItemCount()).toBe(2);

    // Verify total quantity is different
    const totalQuantity = result.current.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    expect(totalQuantity).toBe(13);
  });

  it("should show 0 when cart is empty", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.getItemCount()).toBe(0);
    expect(result.current.items.length).toBe(0);
  });

  it("should update count when item is removed", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Item 1",
        price: 50,
        image: "/1.jpg",
        quantity: 5,
      });
      result.current.addToCart({
        id: "2",
        name: "Item 2",
        price: 75,
        image: "/2.jpg",
        quantity: 3,
      });
    });

    expect(result.current.getItemCount()).toBe(2);

    act(() => {
      result.current.removeFromCart("1");
    });

    expect(result.current.getItemCount()).toBe(1);
  });

  it("should not change count when quantity is updated", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Item 1",
        price: 50,
        image: "/1.jpg",
        quantity: 1,
      });
    });

    expect(result.current.getItemCount()).toBe(1);

    // Update quantity to 10
    act(() => {
      result.current.updateQuantity("1", 10);
    });

    // Count should still be 1 (same item, just more quantity)
    expect(result.current.getItemCount()).toBe(1);
    expect(result.current.items[0]?.quantity).toBe(10);
  });
});
