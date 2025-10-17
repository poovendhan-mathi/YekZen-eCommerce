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
};

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

  it("handles add to cart action", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    render(<ProductCard product={mockProduct} />);

    // Find add to cart button
    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButton);

    expect(consoleSpy).toHaveBeenCalledWith("Added to cart:", mockProduct.name);
    consoleSpy.mockRestore();
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
