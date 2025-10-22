import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../contexts/CartContext";
import toast from "react-hot-toast";

jest.mock("react-hot-toast");

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
      expect(toast.success).toHaveBeenCalledWith("Added to cart!");
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
        result.current.removeFromCart("1");
      });

      expect(result.current.items).toHaveLength(0);
      expect(toast.success).toHaveBeenCalledWith("Removed from cart");
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

      expect(result.current.getTotal()).toBe(250); // (100 * 2) + (50 * 1)
    });
  });

  describe("LocalStorage Persistence", () => {
    it("should save cart to localStorage", () => {
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

      const savedCart = JSON.parse(localStorage.getItem("yekzen-cart"));
      expect(savedCart.items).toHaveLength(1);
      expect(savedCart.items[0].id).toBe("1");
    });

    it("should load cart from localStorage on mount", () => {
      const existingCart = {
        items: [
          {
            id: "1",
            name: "Existing Product",
            price: 99.99,
            quantity: 2,
          },
        ],
        total: 199.98,
      };

      localStorage.setItem("yekzen-cart", JSON.stringify(existingCart));

      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe("1");
      expect(result.current.items[0].quantity).toBe(2);
    });
  });
});
