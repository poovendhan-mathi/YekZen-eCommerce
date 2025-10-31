/**
 * Unit Tests for ImageGallery Component
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageGallery from "../../components/product/ImageGallery";
import { ProductImage } from "../../types/product.types";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("ImageGallery Component", () => {
  const mockImages: ProductImage[] = [
    {
      url: "https://example.com/image1.jpg",
      alt: "Image 1",
      order: 0,
      type: "url",
    },
    {
      url: "https://example.com/image2.jpg",
      alt: "Image 2",
      order: 1,
      type: "uploaded",
      storageRef: "products/image2.jpg",
    },
    {
      url: "https://example.com/image3.jpg",
      alt: "Image 3",
      order: 2,
      type: "url",
    },
  ];

  describe("Rendering", () => {
    it("should render with single image", () => {
      const singleImage = [mockImages[0]];
      const { container } = render(<ImageGallery images={singleImage} />);

      const images = container.querySelectorAll("img");
      expect(images).toHaveLength(1);
    });

    it("should render with multiple images", () => {
      render(<ImageGallery images={mockImages} />);

      // Main image + thumbnails
      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("should display first image by default", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const mainImage = container.querySelector("img[src*='image1.jpg']");
      expect(mainImage).toBeInTheDocument();
    });

    it("should show image counter", () => {
      render(<ImageGallery images={mockImages} />);
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("should handle empty images array", () => {
      const { container } = render(<ImageGallery images={[]} />);
      expect(container.querySelector("img")).not.toBeInTheDocument();
    });
  });

  describe("Navigation - Arrow Buttons", () => {
    it("should show next and previous buttons with multiple images", () => {
      render(<ImageGallery images={mockImages} />);

      const prevButton = screen.getByRole("button", { name: /previous/i });
      const nextButton = screen.getByRole("button", { name: /next/i });

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it("should not show navigation buttons with single image", () => {
      const singleImage = [mockImages[0]];
      render(<ImageGallery images={singleImage} />);

      const prevButton = screen.queryByRole("button", { name: /previous/i });
      const nextButton = screen.queryByRole("button", { name: /next/i });

      expect(prevButton).not.toBeInTheDocument();
      expect(nextButton).not.toBeInTheDocument();
    });

    it("should navigate to next image on next button click", () => {
      render(<ImageGallery images={mockImages} />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);

      // Counter should update
      expect(screen.getByText("2 / 3")).toBeInTheDocument();
    });

    it("should navigate to previous image on prev button click", () => {
      render(<ImageGallery images={mockImages} />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      const prevButton = screen.getByRole("button", { name: /previous/i });

      // Go to next image
      fireEvent.click(nextButton);
      expect(screen.getByText("2 / 3")).toBeInTheDocument();

      // Go back to previous
      fireEvent.click(prevButton);
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("should wrap to first image when clicking next on last image", () => {
      render(<ImageGallery images={mockImages} />);

      const nextButton = screen.getByRole("button", { name: /next/i });

      // Click next 3 times (should wrap to first)
      fireEvent.click(nextButton); // 2/3
      fireEvent.click(nextButton); // 3/3
      fireEvent.click(nextButton); // 1/3 (wrapped)

      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("should wrap to last image when clicking prev on first image", () => {
      render(<ImageGallery images={mockImages} />);

      const prevButton = screen.getByRole("button", { name: /previous/i });

      // Click prev on first image
      fireEvent.click(prevButton);

      // Should show last image (3/3)
      expect(screen.getByText("3 / 3")).toBeInTheDocument();
    });
  });

  describe("Thumbnail Navigation", () => {
    it("should render thumbnails for all images", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      // Find thumbnail container
      const thumbnails = container.querySelectorAll("button img");
      expect(thumbnails).toHaveLength(3);
    });

    it("should highlight active thumbnail", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      // First thumbnail should be active by default
      const firstThumbnail = container.querySelector("button");
      expect(firstThumbnail).toHaveClass("ring-2", "ring-pink-500");
    });

    it("should navigate to image on thumbnail click", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const thumbnails = container.querySelectorAll("button");
      const secondThumbnail = thumbnails[1];

      fireEvent.click(secondThumbnail);

      expect(screen.getByText("2 / 3")).toBeInTheDocument();
    });

    it("should update active thumbnail on navigation", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);

      // Second thumbnail should now be active
      const thumbnails = container.querySelectorAll(
        "button[class*='relative']"
      );
      const secondThumbnail = thumbnails[1];

      expect(secondThumbnail).toHaveClass("ring-2", "ring-pink-500");
    });

    it("should show thumbnails on desktop only", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      // Thumbnail container should have hidden class for mobile
      const thumbnailContainer = container.querySelector(
        "div[class*='hidden md:grid']"
      );
      expect(thumbnailContainer).toBeInTheDocument();
    });
  });

  describe("Mobile Dots Indicator", () => {
    it("should show dots indicator on mobile", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      // Dots container should be visible on mobile
      const dotsContainer = container.querySelector("div[class*='md:hidden']");
      expect(dotsContainer).toBeInTheDocument();
    });

    it("should render dots for all images", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const dots = container.querySelectorAll("button[class*='h-2 w-2']");
      expect(dots).toHaveLength(3);
    });

    it("should navigate to image on dot click", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const dots = container.querySelectorAll("button[class*='h-2 w-2']");
      const thirdDot = dots[2];

      fireEvent.click(thirdDot);

      expect(screen.getByText("3 / 3")).toBeInTheDocument();
    });

    it("should highlight active dot", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const dots = container.querySelectorAll("button[class*='h-2 w-2']");
      const firstDot = dots[0];

      // First dot should be active (pink background)
      expect(firstDot).toHaveClass("bg-pink-500");
    });
  });

  describe("Keyboard Navigation", () => {
    it("should navigate with arrow keys", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const galleryContainer = container.firstChild;

      // Press right arrow
      fireEvent.keyDown(galleryContainer!, { key: "ArrowRight" });
      expect(screen.getByText("2 / 3")).toBeInTheDocument();

      // Press left arrow
      fireEvent.keyDown(galleryContainer!, { key: "ArrowLeft" });
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("should wrap with keyboard navigation", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const galleryContainer = container.firstChild;

      // Press left arrow on first image
      fireEvent.keyDown(galleryContainer!, { key: "ArrowLeft" });
      expect(screen.getByText("3 / 3")).toBeInTheDocument();

      // Press right arrow on last image
      fireEvent.keyDown(galleryContainer!, { key: "ArrowRight" });
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });
  });

  describe("Image Loading", () => {
    it("should use Next.js Image component", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const images = container.querySelectorAll("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("should have correct alt text", () => {
      render(<ImageGallery images={mockImages} />);

      const mainImage = screen.getByAltText("Image 1");
      expect(mainImage).toBeInTheDocument();
    });

    it("should prioritize first image loading", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const firstImage = container.querySelector("img");
      expect(firstImage).toHaveAttribute("loading", "eager");
    });
  });

  describe("Responsive Behavior", () => {
    it("should hide thumbnails on mobile", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const thumbnailContainer = container.querySelector(
        "div[class*='hidden md:grid']"
      );
      expect(thumbnailContainer).toBeInTheDocument();
    });

    it("should show dots on mobile", () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const dotsContainer = container.querySelector("div[class*='md:hidden']");
      expect(dotsContainer).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle images without alt text", () => {
      const imagesNoAlt = [
        {
          url: "https://example.com/image1.jpg",
          order: 0,
          type: "url" as const,
        },
      ];

      const { container } = render(<ImageGallery images={imagesNoAlt} />);
      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
    });

    it("should handle very long image URLs", () => {
      const longUrlImage = [
        {
          url:
            "https://example.com/" + "very-long-path/".repeat(50) + "image.jpg",
          alt: "Long URL Image",
          order: 0,
          type: "url" as const,
        },
      ];

      const { container } = render(<ImageGallery images={longUrlImage} />);
      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
    });

    it("should handle rapid navigation clicks", () => {
      render(<ImageGallery images={mockImages} />);

      const nextButton = screen.getByRole("button", { name: /next/i });

      // Click rapidly
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      // Should handle gracefully
      expect(screen.getByText(/\d \/ 3/)).toBeInTheDocument();
    });

    it("should maintain state after re-render", () => {
      const { rerender } = render(<ImageGallery images={mockImages} />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);

      expect(screen.getByText("2 / 3")).toBeInTheDocument();

      // Re-render with same props
      rerender(<ImageGallery images={mockImages} />);

      // State should be maintained
      expect(screen.getByText("2 / 3")).toBeInTheDocument();
    });
  });
});
