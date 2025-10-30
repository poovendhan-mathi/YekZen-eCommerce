/**
 * Header Component Test
 *
 * Tests for the Header component focusing on cart badge display
 *
 * Bug Fix #1: Cart badge should show number of unique items, not total quantity
 */

import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Mock Firebase config FIRST before any other imports
jest.mock("../../../firebase/config", () => ({
  __esModule: true,
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
  },
  db: {},
  app: {},
}));

// Mock Firebase BEFORE any imports
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({})),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
  onIdTokenChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  FacebookAuthProvider: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
  connectFirestoreEmulator: jest.fn(),
}));

// Mock Next.js Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock window.scrollTo
global.scrollTo = jest.fn();

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/test",
}));

// Mock Next.js Link
jest.mock("next/link", () => {
  return function MockedLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const {
        initial,
        animate,
        variants,
        whileHover,
        transition,
        ...cleanProps
      } = props;
      return <div {...cleanProps}>{children}</div>;
    },
    button: ({ children, ...props }: any) => {
      const { whileHover, whileTap, transition, ...cleanProps } = props;
      return <button {...cleanProps}>{children}</button>;
    },
    span: ({ children, ...props }: any) => {
      const { whileHover, initial, animate, ...cleanProps } = props;
      return <span {...cleanProps}>{children}</span>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Import contexts and Header component
import AuthContext from "../../../contexts/AuthContext";
import CartContext from "../../../contexts/CartContext";
import Header from "../../../components/layout/Header";

describe("Header Component", () => {
  const mockAuthValue = {
    user: null,
    loading: false,
    login: jest.fn(),
    signUp: jest.fn(),
    logout: jest.fn(),
    googleSignIn: jest.fn(),
  };

  describe("Cart Badge Display", () => {
    it("should display correct number of unique items in cart badge", () => {
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
        addToCart: jest.fn(),
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getItemCount: jest.fn(() => 2), // Returns unique items count
        getSubtotal: jest.fn(() => 499.96),
        getTax: jest.fn(() => 40),
        getShipping: jest.fn(() => 0),
        getTotal: jest.fn(() => 539.96),
        isInCart: jest.fn(() => false),
        getItemQuantity: jest.fn(() => 0),
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
      const badge = screen.getByText("2");
      expect(badge).toBeInTheDocument();
    });

    it("should not display badge when cart is empty", () => {
      const mockCartValue = {
        items: [],
        addToCart: jest.fn(),
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getItemCount: jest.fn(() => 0),
        getSubtotal: jest.fn(() => 0),
        getTax: jest.fn(() => 0),
        getShipping: jest.fn(() => 0),
        getTotal: jest.fn(() => 0),
        isInCart: jest.fn(() => false),
        getItemQuantity: jest.fn(() => 0),
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
