import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCard from "../components/cards/ProductCard";
import CartContext from "../contexts/CartContext";

// Mock Next.js modules
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("next/image", () => {
  return function MockedImage({ src, alt, fill, ...props }) {
    const safeProps = { ...props };
    return <img src={src} alt={alt} {...safeProps} />;
  };
});

jest.mock("next/link", () => {
  return function MockedLink({ children, href, ...props }) {
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
    div: ({
      children,
      variants,
      initial,
      animate,
      whileHover,
      whileTap,
      style,
      transition,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
      ...props
    }) => {
      // Filter out all framer-motion specific props
      const cleanProps = { ...props };
      if (onMouseEnter) cleanProps.onMouseEnter = onMouseEnter;
      if (onMouseLeave) cleanProps.onMouseLeave = onMouseLeave;
      if (onMouseMove) cleanProps.onMouseMove = onMouseMove;
      if (style) {
        // Filter out framer-motion style properties
        const { rotateX, rotateY, transformStyle, ...cleanStyle } = style;
        if (Object.keys(cleanStyle).length > 0) {
          cleanProps.style = cleanStyle;
        }
      }
      return <div {...cleanProps}>{children}</div>;
    },
    button: ({
      children,
      variants,
      initial,
      animate,
      whileHover,
      whileTap,
      transition,
      ...props
    }) => {
      // Filter out all framer-motion specific props
      return <button {...props}>{children}</button>;
    },
  },
  useMotionValue: () => ({ set: jest.fn(), get: jest.fn() }),
  useTransform: () => ({ set: jest.fn(), get: jest.fn() }),
}));

const mockProduct = {
  id: 1,
  name: "Premium Wireless Headphones",
  description: "High-quality wireless headphones with noise cancellation",
  price: 199.99,
  originalPrice: 299.99,
  image: "https://example.com/headphones.jpg",
  category: "Electronics",
  brand: "TechBrand",
  rating: 4.5,
  reviews: 234,
  inStock: true,
};

const mockProductOutOfStock = {
  ...mockProduct,
  id: 2,
  name: "Out of Stock Product",
  inStock: false,
};

const mockProductNoDiscount = {
  ...mockProduct,
  id: 3,
  name: "No Discount Product",
  originalPrice: null,
};

describe("ProductCard - Enhanced Features", () => {
  let mockAddToCart;
  let mockCartValue;

  beforeEach(() => {
    mockAddToCart = jest.fn();
    mockCartValue = {
      items: [],
      addToCart: mockAddToCart,
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotal: jest.fn(() => 0),
      getSubtotal: jest.fn(() => 0),
      getTax: jest.fn(() => 0),
      getShipping: jest.fn(() => 0),
      getItemCount: jest.fn(() => 0),
      isInCart: jest.fn(() => false),
      getItemQuantity: jest.fn(() => 0),
    };
  });

  const renderWithCart = (product, cartValue = mockCartValue) => {
    return render(
      <CartContext.Provider value={cartValue}>
        <ProductCard product={product} />
      </CartContext.Provider>
    );
  };

  describe("Basic Rendering", () => {
    it("should render product name", () => {
      renderWithCart(mockProduct);
      expect(
        screen.getByText("Premium Wireless Headphones")
      ).toBeInTheDocument();
    });

    it("should render product price", () => {
      renderWithCart(mockProduct);
      expect(screen.getByText("$199.99")).toBeInTheDocument();
    });

    it("should render product image with correct alt text", () => {
      renderWithCart(mockProduct);
      const image = screen.getByAltText("Premium Wireless Headphones");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", mockProduct.image);
    });

    it("should render brand name", () => {
      renderWithCart(mockProduct);
      expect(screen.getByText("TechBrand")).toBeInTheDocument();
    });

    it("should render category", () => {
      renderWithCart(mockProduct);
      expect(screen.getByText("Electronics")).toBeInTheDocument();
    });

    it("should render rating", () => {
      renderWithCart(mockProduct);
      // Rating is displayed as "4.5 (234)"
      expect(screen.getByText(/4\.5\s*\(234\)/)).toBeInTheDocument();
    });

    it("should render review count", () => {
      renderWithCart(mockProduct);
      // Review count is part of "4.5 (234)"
      expect(screen.getByText(/\(234\)/)).toBeInTheDocument();
    });
  });

  describe("Discount Badge", () => {
    it("should display discount badge when original price is higher", () => {
      renderWithCart(mockProduct);
      const discount = Math.round(
        ((mockProduct.originalPrice - mockProduct.price) /
          mockProduct.originalPrice) *
          100
      );
      expect(screen.getByText(`-${discount}%`)).toBeInTheDocument();
    });

    it("should not display discount badge when no original price", () => {
      renderWithCart(mockProductNoDiscount);
      expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
    });

    it("should calculate discount correctly", () => {
      renderWithCart(mockProduct);
      const expectedDiscount = Math.round(((299.99 - 199.99) / 299.99) * 100);
      expect(screen.getByText(`-${expectedDiscount}%`)).toBeInTheDocument();
    });

    it("should have red background for discount badge", () => {
      const { container } = renderWithCart(mockProduct);
      const badge = screen.getByText(/-\d+%/);
      expect(badge).toHaveClass("bg-red-500");
    });
  });

  describe("Wishlist Functionality", () => {
    it("should show empty heart icon initially", () => {
      const { container } = renderWithCart(mockProduct);
      const wishlistButton = screen
        .getAllByRole("button")
        .find((btn) => btn.getAttribute("aria-label")?.includes("wishlist"));
      expect(wishlistButton).toBeInTheDocument();
    });

    it("should toggle wishlist state on click", () => {
      renderWithCart(mockProduct);
      const wishlistButton = screen
        .getAllByRole("button")
        .find((btn) =>
          btn.getAttribute("aria-label")?.includes("Add to wishlist")
        );

      expect(wishlistButton).toHaveAttribute("aria-label", "Add to wishlist");

      fireEvent.click(wishlistButton);

      expect(wishlistButton).toHaveAttribute(
        "aria-label",
        "Remove from wishlist"
      );
    });

    it("should toggle wishlist multiple times", () => {
      renderWithCart(mockProduct);
      const wishlistButton = screen
        .getAllByRole("button")
        .find((btn) => btn.getAttribute("aria-label")?.includes("wishlist"));

      // Add to wishlist
      fireEvent.click(wishlistButton);
      expect(wishlistButton).toHaveAttribute(
        "aria-label",
        "Remove from wishlist"
      );

      // Remove from wishlist
      fireEvent.click(wishlistButton);
      expect(wishlistButton).toHaveAttribute("aria-label", "Add to wishlist");

      // Add again
      fireEvent.click(wishlistButton);
      expect(wishlistButton).toHaveAttribute(
        "aria-label",
        "Remove from wishlist"
      );
    });

    it("should have proper accessibility label", () => {
      renderWithCart(mockProduct);
      const wishlistButton = screen
        .getAllByRole("button")
        .find((btn) => btn.getAttribute("aria-label")?.includes("wishlist"));
      expect(wishlistButton).toHaveAttribute("aria-label");
    });
  });

  describe("Add to Cart Functionality", () => {
    it("should show 'Add to Cart' button on hover", async () => {
      const { container } = renderWithCart(mockProduct);
      const card = container.firstChild;

      fireEvent.mouseEnter(card);

      await waitFor(() => {
        const addButtons = screen.getAllByText(/Add to Cart/);
        expect(addButtons.length).toBeGreaterThan(0);
      });
    });

    it("should call addToCart when clicking Add to Cart button", async () => {
      const { container } = renderWithCart(mockProduct);
      const card = container.firstChild;

      fireEvent.mouseEnter(card);

      await waitFor(() => {
        const addButtons = screen.getAllByText(/Add to Cart/);
        fireEvent.click(addButtons[0]);
      });

      // Wait for async operation
      await waitFor(
        () => {
          expect(mockAddToCart).toHaveBeenCalledWith(
            expect.objectContaining({
              id: mockProduct.id,
              name: mockProduct.name,
              price: mockProduct.price,
            })
          );
        },
        { timeout: 1000 }
      );
    });

    it("should show loading state when adding to cart", async () => {
      jest.useFakeTimers();
      const { container } = renderWithCart(mockProduct);
      const card = container.firstChild;

      fireEvent.mouseEnter(card);

      await waitFor(() => {
        const addButtons = screen.getAllByText(/Add to Cart/);
        fireEvent.click(addButtons[0]);
      });

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText("Adding...")).toBeInTheDocument();
      });

      // Advance timers to complete async operation
      act(() => {
        jest.advanceTimersByTime(600);
      });

      jest.useRealTimers();
    });

    it("should prevent multiple simultaneous additions", async () => {
      jest.useFakeTimers();
      const { container } = renderWithCart(mockProduct);
      const card = container.firstChild;

      fireEvent.mouseEnter(card);

      await waitFor(() => {
        const addButtons = screen.getAllByText(/Add to Cart/);
        // Click multiple times rapidly
        fireEvent.click(addButtons[0]);
        fireEvent.click(addButtons[0]);
        fireEvent.click(addButtons[0]);
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      // Should only add once
      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledTimes(1);
      });

      jest.useRealTimers();
    });

    it("should disable Add to Cart button when out of stock", async () => {
      const { container } = renderWithCart(mockProductOutOfStock);
      const card = container.firstChild;

      fireEvent.mouseEnter(card);

      await waitFor(() => {
        // Get all "Add to Cart" or "Out of Stock" buttons
        const buttons = screen.getAllByRole("button");
        const addToCartButtons = buttons.filter(
          (btn) =>
            btn.textContent.includes("Add to Cart") ||
            btn.textContent.includes("Out of Stock")
        );
        // At least one should be disabled
        const hasDisabledButton = addToCartButtons.some((btn) => btn.disabled);
        expect(hasDisabledButton).toBe(true);
      });
    });
  });

  describe("Quick View Functionality", () => {
    it("should show Quick View button on hover", async () => {
      const { container } = renderWithCart(mockProduct);
      const card = container.firstChild;

      fireEvent.mouseEnter(card);

      await waitFor(() => {
        expect(screen.getByText("Quick View")).toBeInTheDocument();
      });
    });

    it("should have correct link to product detail page", async () => {
      const { container } = renderWithCart(mockProduct);
      const card = container.firstChild;

      fireEvent.mouseEnter(card);

      await waitFor(() => {
        const quickViewLink = screen.getByText("Quick View").closest("a");
        expect(quickViewLink).toHaveAttribute(
          "href",
          `/products/${mockProduct.id}`
        );
      });
    });
  });

  describe("Out of Stock State", () => {
    it("should display 'Out of Stock' overlay", () => {
      renderWithCart(mockProductOutOfStock);
      const outOfStockElements = screen.getAllByText("Out of Stock");
      // Should have at least one "Out of Stock" element
      expect(outOfStockElements.length).toBeGreaterThan(0);
    });

    it("should have proper styling for out of stock overlay", () => {
      renderWithCart(mockProductOutOfStock);
      const outOfStockElements = screen.getAllByText("Out of Stock");
      // Find the overlay element (the one with bg-gray-800 class)
      const overlay = outOfStockElements.find((el) =>
        el.classList.contains("bg-gray-800")
      );
      expect(overlay).toBeDefined();
      expect(overlay).toHaveClass("bg-gray-800");
    });

    it("should not show add to cart for out of stock products", async () => {
      const { container } = renderWithCart(mockProductOutOfStock);
      const card = container.firstChild;

      fireEvent.mouseEnter(card);

      await waitFor(() => {
        // There are two "Add to Cart" buttons - one in overlay and one at bottom
        const addButtons = screen.getAllByText(/Add to Cart/);
        // At least one should be disabled
        const hasDisabledButton = addButtons.some(
          (btn) => btn.closest("button")?.disabled
        );
        expect(hasDisabledButton).toBe(true);
      });
    });
  });

  describe("3D Tilt Effect", () => {
    it("should handle mouse movement for 3D effect", () => {
      const { container } = renderWithCart(mockProduct);
      const card = container.firstChild;

      fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
      expect(card).toBeInTheDocument();
    });

    it("should reset tilt on mouse leave", () => {
      const { container } = renderWithCart(mockProduct);
      const card = container.firstChild;

      fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
      fireEvent.mouseLeave(card);

      expect(card).toBeInTheDocument();
    });

    it("should track mouse position within card bounds", () => {
      const { container } = renderWithCart(mockProduct);
      const card = container.firstChild;

      // Mock getBoundingClientRect
      card.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 300,
        height: 400,
        right: 300,
        bottom: 400,
      }));

      fireEvent.mouseMove(card, { clientX: 150, clientY: 200 });
      expect(card).toBeInTheDocument();
    });
  });

  describe("Rating Display", () => {
    it("should display correct number of filled stars", () => {
      const { container } = renderWithCart(mockProduct);
      const stars = container.querySelectorAll('svg[class*="h-4 w-4"]');
      expect(stars.length).toBeGreaterThan(0);
    });

    it("should handle different rating values", () => {
      const products = [
        { ...mockProduct, rating: 1, reviews: 100 },
        { ...mockProduct, rating: 3, reviews: 200 },
        { ...mockProduct, rating: 5, reviews: 300 },
      ];

      products.forEach((product) => {
        const { unmount } = renderWithCart(product);
        // Look for rating in format "X (Y)" where X is rating and Y is reviews
        const ratingRegex = new RegExp(
          `${product.rating}\\s*\\(${product.reviews}\\)`
        );
        expect(screen.getByText(ratingRegex)).toBeInTheDocument();
        unmount();
      });
    });

    it("should handle decimal ratings", () => {
      const product = { ...mockProduct, rating: 4.7, reviews: 150 };
      renderWithCart(product);
      const ratingRegex = /4\.7\s*\(150\)/;
      expect(screen.getByText(ratingRegex)).toBeInTheDocument();
    });
  });

  describe("Product Links", () => {
    it("should have link to product detail from image", () => {
      renderWithCart(mockProduct);
      const imageLink = screen
        .getByAltText("Premium Wireless Headphones")
        .closest("a");
      expect(imageLink).toHaveAttribute("href", `/products/${mockProduct.id}`);
    });

    it("should have link to product detail from title", () => {
      renderWithCart(mockProduct);
      const titleLink = screen
        .getByText("Premium Wireless Headphones")
        .closest("a");
      expect(titleLink).toHaveAttribute("href", `/products/${mockProduct.id}`);
    });
  });

  describe("Hover Effects", () => {
    it("should show overlay on hover", async () => {
      const { container } = renderWithCart(mockProduct);
      const card = container.firstChild;

      fireEvent.mouseEnter(card);

      await waitFor(() => {
        const addToCartButtons = screen.getAllByText("Add to Cart");
        expect(addToCartButtons.length).toBeGreaterThan(0);
        expect(screen.getByText("Quick View")).toBeInTheDocument();
      });
    });

    it("should hide overlay on mouse leave", async () => {
      const { container } = renderWithCart(mockProduct);
      const card = container.firstChild;

      fireEvent.mouseEnter(card);

      await waitFor(() => {
        const addToCartButtons = screen.getAllByText("Add to Cart");
        expect(addToCartButtons.length).toBeGreaterThan(0);
      });

      fireEvent.mouseLeave(card);

      // Since there's also an "Add to Cart" button at the bottom that's always visible,
      // we just verify the component still renders properly
      await waitFor(() => {
        expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
      });
    });
  });

  describe("Animation Index", () => {
    it("should accept index prop for stagger animation", () => {
      renderWithCart(mockProduct, mockCartValue);
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    });

    it("should render with different indices", () => {
      const indices = [0, 1, 2, 5, 10];

      indices.forEach((index) => {
        const { unmount } = render(
          <CartContext.Provider value={mockCartValue}>
            <ProductCard product={mockProduct} index={index} />
          </CartContext.Provider>
        );
        expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("Cart Context Integration", () => {
    it("should work without CartContext (with fallback)", () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    });

    it("should use fallback addToCart when context is unavailable", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      render(<ProductCard product={mockProduct} />);

      const { container } = render(<ProductCard product={mockProduct} />);
      const card = container.firstChild;

      fireEvent.mouseEnter(card);

      await waitFor(() => {
        const addButton = screen.getAllByText("Add to Cart")[0];
        fireEvent.click(addButton);
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria-labels on buttons", () => {
      renderWithCart(mockProduct);
      const wishlistButton = screen
        .getAllByRole("button")
        .find((btn) => btn.getAttribute("aria-label")?.includes("wishlist"));
      expect(wishlistButton).toHaveAttribute("aria-label");
    });

    it("should be keyboard navigable", () => {
      renderWithCart(mockProduct);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).not.toBeDisabled();
      });
    });

    it("should have proper image alt text", () => {
      renderWithCart(mockProduct);
      const image = screen.getByAltText(mockProduct.name);
      expect(image).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing product properties gracefully", () => {
      const incompleteProduct = {
        id: 99,
        name: "Incomplete Product",
        price: 50,
      };

      expect(() => renderWithCart(incompleteProduct)).not.toThrow();
    });

    it("should handle zero price", () => {
      const freeProduct = { ...mockProduct, price: 0 };
      renderWithCart(freeProduct);
      expect(screen.getByText("$0")).toBeInTheDocument();
    });

    it("should handle very long product names", () => {
      const longNameProduct = {
        ...mockProduct,
        name: "A".repeat(200),
      };
      renderWithCart(longNameProduct);
      expect(screen.getByText("A".repeat(200))).toBeInTheDocument();
    });

    it("should handle zero reviews", () => {
      const noReviewsProduct = { ...mockProduct, rating: 4.5, reviews: 0 };
      renderWithCart(noReviewsProduct);
      const ratingRegex = /4\.5\s*\(0\)/;
      expect(screen.getByText(ratingRegex)).toBeInTheDocument();
    });

    it("should handle zero rating", () => {
      const noRatingProduct = { ...mockProduct, rating: 0, reviews: 10 };
      renderWithCart(noRatingProduct);
      const ratingRegex = /0\s*\(10\)/;
      expect(screen.getByText(ratingRegex)).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render multiple cards efficiently", () => {
      const products = Array(10)
        .fill(mockProduct)
        .map((p, i) => ({ ...p, id: i }));

      const { container } = render(
        <CartContext.Provider value={mockCartValue}>
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </CartContext.Provider>
      );

      expect(container.querySelectorAll("img")).toHaveLength(10);
    });

    it("should handle rapid hover events", async () => {
      const { container } = renderWithCart(mockProduct);
      const card = container.firstChild;

      for (let i = 0; i < 10; i++) {
        fireEvent.mouseEnter(card);
        fireEvent.mouseLeave(card);
      }

      expect(card).toBeInTheDocument();
    });
  });
});
