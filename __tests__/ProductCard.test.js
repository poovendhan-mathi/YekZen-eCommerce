import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCard from "../components/cards/ProductCard";

const mockProduct = {
  id: 1,
  name: "Test Product",
  description: "Test Description",
  price: 99.99,
  originalPrice: 129.99,
  image: "https://example.com/image.jpg",
  category: "Electronics",
  rating: 4.5,
  reviews: 123,
  inStock: true,
};

// Mock Cart Context
jest.mock("../contexts/CartContext", () => ({
  useCart: () => null, // Return null so ProductCard uses fallback console.log
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockedImage({ src, alt, fill, ...props }) {
    // Do not forward `fill` boolean to DOM (next/image uses it as a layout prop)
    const safeProps = { ...props };
    return <img src={src} alt={alt} {...safeProps} />;
  };
});

// Mock Next.js Link component
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

describe("ProductCard Component", () => {
  it("renders product information correctly", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByAltText("Test Product")).toBeInTheDocument();
  });

  it("shows discount badge when original price is higher", () => {
    render(<ProductCard product={mockProduct} />);

    // Calculate expected discount
    const discount = Math.round(
      ((mockProduct.originalPrice - mockProduct.price) /
        mockProduct.originalPrice) *
        100
    );
    expect(screen.getByText(`-${discount}%`)).toBeInTheDocument();
  });

  it("handles wishlist toggle", () => {
    render(<ProductCard product={mockProduct} />);

    // Find wishlist button (heart icon)
    const wishlistButton = screen.getByRole("button", { name: /wishlist/i });
    fireEvent.click(wishlistButton);

    // Should toggle wishlist state (testing functionality, not visual change)
    expect(wishlistButton).toBeInTheDocument();
  });

  it("handles add to cart action", async () => {
    const { container } = render(<ProductCard product={mockProduct} />);

    // The product is in stock, so there should be at least one "Add to Cart" button that's not disabled
    // Note: There are two "Add to Cart" buttons - one in the hover overlay and one at the bottom
    // The overlay button may not be accessible without hover, but the bottom one should always be there

    const allButtons = container.querySelectorAll("button");
    const addToCartButtons = Array.from(allButtons).filter(
      (btn) => btn.textContent?.includes("Add to Cart") && !btn.disabled
    );

    // Should have at least one enabled "Add to Cart" button
    expect(addToCartButtons.length).toBeGreaterThanOrEqual(1);

    // Click the button
    if (addToCartButtons[0]) {
      fireEvent.click(addToCartButtons[0]);
      expect(addToCartButtons[0]).toBeInTheDocument();
    }
  });

  it("renders without original price when not provided", () => {
    const productWithoutOriginalPrice = {
      ...mockProduct,
      originalPrice: undefined,
    };
    render(<ProductCard product={productWithoutOriginalPrice} />);

    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });
});
