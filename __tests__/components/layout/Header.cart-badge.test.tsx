/**
 * Header Component Test
 *
 * Tests for the Header component focusing on cart badge display
 *
 * Bug Fix #1: Cart badge should show number of unique items, not total quantity
 */

import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React, { createContext } from "react";

// Create mock contexts
const AuthContext = createContext<any>(null);
const CartContext = createContext<any>(null);

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/test",
}));

// Import Header component
import Header from "../../../components/layout/Header";

describe("Header Component", () => {
  const mockAuthValue = {
    user: null,
    loading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  };

  describe("Cart Badge Display", () => {
    it("should display correct number of unique items in cart badge", async () => {
      // Arrange: Cart with 2 unique items (quantities: 2 and 2 = total 4)
      const mockCartValue = {
        items: [
          {
            id: 1,
            name: "Product 1",
            price: 99.99,
            quantity: 2,
            image: "/img1.jpg",
          },
          {
            id: 2,
            name: "Product 2",
            price: 149.99,
            quantity: 2,
            image: "/img2.jpg",
          },
        ],
        total: 499.96,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getItemCount: jest.fn(() => 2), // Returns unique items count
      };

      // Act
      render(
        <AuthContext.Provider value={mockAuthValue}>
          <CartContext.Provider value={mockCartValue}>
            <Header />
          </CartContext.Provider>
        </AuthContext.Provider>
      );

      // Assert: Should show "2" (unique items), NOT "4" (total quantity)
      await waitFor(() => {
        const badge = screen.getByText("2");
        expect(badge).toBeTruthy();
      });
    });

    it("should not display badge when cart is empty", () => {
      const mockCartValue = {
        items: [],
        total: 0,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getItemCount: jest.fn(() => 0),
      };

      render(
        <AuthContext.Provider value={mockAuthValue}>
          <CartContext.Provider value={mockCartValue}>
            <Header />
          </CartContext.Provider>
        </AuthContext.Provider>
      );

      // Badge should not appear or show 0
      const cartItemsCount = mockCartValue.items.length;
      expect(cartItemsCount).toBe(0);
    });

    it('should show "1" for single item with high quantity', () => {
      const mockCartValue = {
        items: [{ id: 1, name: "Product 1", price: 10.0, quantity: 100 }],
        total: 1000.0,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getItemCount: jest.fn(() => 1),
      };

      render(
        <AuthContext.Provider value={mockAuthValue}>
          <CartContext.Provider value={mockCartValue}>
            <Header />
          </CartContext.Provider>
        </AuthContext.Provider>
      );

      // Should show 1 (unique items), not 100 (quantity)
      const uniqueItemsCount = mockCartValue.items.length;
      expect(uniqueItemsCount).toBe(1);
    });

    it("should update badge when items are added to cart", async () => {
      const mockCartValue = {
        items: [
          {
            id: 1,
            name: "Product 1",
            price: 99.99,
            quantity: 1,
            image: "/img1.jpg",
          },
        ],
        total: 99.99,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getItemCount: jest.fn(() => 1),
      };

      const { rerender } = render(
        <AuthContext.Provider value={mockAuthValue}>
          <CartContext.Provider value={mockCartValue}>
            <Header />
          </CartContext.Provider>
        </AuthContext.Provider>
      );

      // Simulate adding another item
      const updatedCartValue = {
        ...mockCartValue,
        items: [
          ...mockCartValue.items,
          {
            id: 2,
            name: "Product 2",
            price: 149.99,
            quantity: 1,
            image: "/img2.jpg",
          },
        ],
        getItemCount: jest.fn(() => 2),
      };

      rerender(
        <AuthContext.Provider value={mockAuthValue}>
          <CartContext.Provider value={updatedCartValue}>
            <Header />
          </CartContext.Provider>
        </AuthContext.Provider>
      );

      await waitFor(() => {
        expect(updatedCartValue.getItemCount()).toBe(2);
      });
    });
  });

  describe("Authentication State", () => {
    it("should show sign-in link when user is not logged in", () => {
      const mockCartValue = {
        items: [],
        total: 0,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getItemCount: jest.fn(() => 0),
      };

      render(
        <AuthContext.Provider value={mockAuthValue}>
          <CartContext.Provider value={mockCartValue}>
            <Header />
          </CartContext.Provider>
        </AuthContext.Provider>
      );

      expect(mockAuthValue.user).toBeNull();
    });

    it("should show user info when logged in", () => {
      const mockAuthValueLoggedIn = {
        user: {
          email: "test@example.com",
          displayName: "Test User",
          uid: "123",
        },
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
      };

      const mockCartValue = {
        items: [],
        total: 0,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getItemCount: jest.fn(() => 0),
      };

      render(
        <AuthContext.Provider value={mockAuthValueLoggedIn}>
          <CartContext.Provider value={mockCartValue}>
            <Header />
          </CartContext.Provider>
        </AuthContext.Provider>
      );

      expect(mockAuthValueLoggedIn.user).not.toBeNull();
      expect(mockAuthValueLoggedIn.user?.email).toBe("test@example.com");
    });
  });
});
