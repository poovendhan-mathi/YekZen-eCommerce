import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../contexts/CartContext";
import toast from "react-hot-toast";

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}));

describe("CartContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("useCart Hook", () => {
    it("should provide cart context", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current).toHaveProperty("items");
      expect(result.current).toHaveProperty("addToCart");
      expect(result.current).toHaveProperty("removeFromCart");
      expect(result.current).toHaveProperty("updateQuantity");
      expect(result.current).toHaveProperty("clearCart");
    });

    it("should throw error when used outside provider", () => {
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCart());
      }).toThrow("useCart must be used within a CartProvider");

      consoleError.mockRestore();
    });
  });

  describe("Add to Cart", () => {
    it("should add new item to cart", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product = {
        id: "1",
        name: "Test Product",
        price: 99.99,
        image: "test.jpg",
      };

      act(() => {
        result.current.addToCart(product);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe("1");
      expect(result.current.items[0].quantity).toBe(1);
      // Toast is not shown by addToCart anymore - it's handled by the calling component
    });

    it("should increase quantity if item already in cart", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product = {
        id: "1",
        name: "Test Product",
        price: 99.99,
        image: "test.jpg",
      };

      act(() => {
        result.current.addToCart(product);
        result.current.addToCart(product);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });
  });

  describe("Remove from Cart", () => {
    it("should remove item from cart", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product = {
        id: "1",
        name: "Test Product",
        price: 99.99,
        image: "test.jpg",
      };

      act(() => {
        result.current.addToCart(product);
      });

      // Clear previous calls
      jest.clearAllMocks();

      act(() => {
        result.current.removeFromCart("1");
      });

      expect(result.current.items).toHaveLength(0);
      // The toast should have been called
      expect(toast.success).toHaveBeenCalled();
      // Check if it was called with a message containing the product name
      if (toast.success.mock.calls.length > 0) {
        const callArg = toast.success.mock.calls[0][0];
        expect(callArg).toContain("Test Product");
      }
    });
  });

  describe("Update Quantity", () => {
    it("should update item quantity", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product = {
        id: "1",
        name: "Test Product",
        price: 99.99,
        image: "test.jpg",
      };

      act(() => {
        result.current.addToCart(product);
        result.current.updateQuantity("1", 5);
      });

      expect(result.current.items[0].quantity).toBe(5);
    });

    it("should remove item when quantity is 0", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product = {
        id: "1",
        name: "Test Product",
        price: 99.99,
        image: "test.jpg",
      };

      act(() => {
        result.current.addToCart(product);
        result.current.updateQuantity("1", 0);
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe("Clear Cart", () => {
    it("should clear all items from cart", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product1 = {
        id: "1",
        name: "Product 1",
        price: 99.99,
        image: "test1.jpg",
      };

      const product2 = {
        id: "2",
        name: "Product 2",
        price: 149.99,
        image: "test2.jpg",
      };

      act(() => {
        result.current.addToCart(product1);
        result.current.addToCart(product2);
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe("Cart Totals", () => {
    it("should calculate total correctly", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product1 = {
        id: "1",
        name: "Product 1",
        price: 100,
        image: "test1.jpg",
      };

      const product2 = {
        id: "2",
        name: "Product 2",
        price: 50,
        image: "test2.jpg",
      };

      act(() => {
        result.current.addToCart(product1);
        result.current.addToCart(product2);
        result.current.updateQuantity("1", 2);
      });

      // Total includes subtotal + tax (8%) + shipping (free over $50)
      // Subtotal: (100 * 2) + (50 * 1) = 250
      // Tax: 250 * 0.08 = 20
      // Shipping: 0 (free since subtotal > 50)
      // Total: 250 + 20 + 0 = 270
      expect(result.current.getTotal()).toBe(270);
    });
  });

  describe("LocalStorage Persistence", () => {
    it("should save cart to localStorage", async () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product = {
        id: "1",
        name: "Test Product",
        price: 99.99,
        image: "test.jpg",
      };

      act(() => {
        result.current.addToCart(product);
      });

      // Wait for debounced localStorage save (300ms)
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 350));
      });

      const savedCart = JSON.parse(localStorage.getItem("yekzen-cart") || "[]");
      expect(savedCart).toHaveLength(1);
      expect(savedCart[0]?.id).toBe("1");
    });

    it("should load cart from localStorage on mount", () => {
      const existingCart = [
        {
          id: "1",
          name: "Existing Product",
          price: 99.99,
          quantity: 2,
          image: "test.jpg",
        },
      ];

      localStorage.setItem("yekzen-cart", JSON.stringify(existingCart));

      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe("1");
      expect(result.current.items[0].quantity).toBe(2);
    });
  });
});
