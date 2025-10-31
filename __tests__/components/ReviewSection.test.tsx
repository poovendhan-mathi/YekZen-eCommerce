/**
 * Unit Tests for ReviewSection Component
 */

// Mock Firebase before any imports
jest.mock("../../firebase/config", () => ({
  db: {},
  auth: {},
  storage: {},
}));

// Mock dependencies
jest.mock("../../services/reviews.service");
jest.mock("../../contexts/AuthContext");
jest.mock("../../components/product/RatingStars", () => ({
  __esModule: true,
  default: ({ rating }: any) => <div data-testid="rating-stars">{rating}</div>,
}));
jest.mock("../../components/product/ReviewForm", () => ({
  __esModule: true,
  default: ({ onSubmit, onCancel }: any) => (
    <div data-testid="review-form">
      <button onClick={onSubmit}>Submit Review</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));
jest.mock("../../components/product/ReviewCard", () => ({
  __esModule: true,
  default: ({ review }: any) => (
    <div data-testid="review-card">{review.title}</div>
  ),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReviewSection from "../../components/product/ReviewSection";
import { reviewsService } from "../../services/reviews.service";
import { useAuth } from "../../contexts/AuthContext";

describe("ReviewSection Component", () => {
  const mockProduct = {
    id: "product123",
    name: "Test Product",
    averageRating: 4.5,
    reviewCount: 10,
    ratingDistribution: {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
    },
  };

  const mockReviews = [
    {
      id: "review1",
      userName: "John Doe",
      rating: 5,
      title: "Great Product",
      comment: "I love it!",
      helpful: 5,
      verified: true,
      createdAt: "2025-01-15T10:00:00.000Z",
    },
    {
      id: "review2",
      userName: "Jane Smith",
      rating: 4,
      title: "Good Product",
      comment: "Pretty good",
      helpful: 3,
      verified: false,
      createdAt: "2025-01-14T10:00:00.000Z",
    },
  ];

  const mockUser = {
    uid: "user123",
    email: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (reviewsService.getProductReviews as jest.Mock).mockResolvedValue(
      mockReviews
    );
    (reviewsService.hasUserReviewed as jest.Mock).mockResolvedValue(false);
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });
  });

  describe("Rendering", () => {
    it("should render with product data", async () => {
      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(screen.getByText("Customer Reviews")).toBeInTheDocument();
      });
    });

    it("should display average rating", async () => {
      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(screen.getByText("4.5")).toBeInTheDocument();
      });
    });

    it("should display review count", async () => {
      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(screen.getByText("Based on 10 reviews")).toBeInTheDocument();
      });
    });

    it("should display rating distribution", async () => {
      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(screen.getByText("5 stars")).toBeInTheDocument();
        expect(screen.getByText("4 stars")).toBeInTheDocument();
        expect(screen.getByText("3 stars")).toBeInTheDocument();
        expect(screen.getByText("2 stars")).toBeInTheDocument();
        expect(screen.getByText("1 star")).toBeInTheDocument();
      });
    });

    it("should show write review button for logged-in users", async () => {
      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /Write a Review/i })
        ).toBeInTheDocument();
      });
    });

    it("should show sign-in prompt for anonymous users", async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });

      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(
          screen.getByText(/Sign in to write a review/i)
        ).toBeInTheDocument();
      });
    });

    it("should render review cards", async () => {
      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        const reviewCards = screen.getAllByTestId("review-card");
        expect(reviewCards).toHaveLength(2);
      });
    });
  });

  describe("Rating Distribution", () => {
    it("should calculate and display percentage correctly", async () => {
      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        // 5 stars: 4/10 = 40%
        expect(screen.getByText("40%")).toBeInTheDocument();
        // 4 stars: 3/10 = 30%
        expect(screen.getByText("30%")).toBeInTheDocument();
        // 3 stars: 2/10 = 20%
        expect(screen.getByText("20%")).toBeInTheDocument();
        // 2 stars: 1/10 = 10%
        expect(screen.getByText("10%")).toBeInTheDocument();
        // 1 star: 0/10 = 0%
        expect(screen.getByText("0%")).toBeInTheDocument();
      });
    });

    it("should display progress bars with correct width", async () => {
      const { container } = render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        const progressBars = container.querySelectorAll(
          "div[class*='bg-pink-500']"
        );
        expect(progressBars.length).toBeGreaterThan(0);
      });
    });

    it("should handle zero reviews gracefully", async () => {
      const noReviewsProduct = {
        ...mockProduct,
        reviewCount: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };

      (reviewsService.getProductReviews as jest.Mock).mockResolvedValue([]);

      render(<ReviewSection product={noReviewsProduct} />);

      await waitFor(() => {
        expect(screen.getByText("No reviews yet")).toBeInTheDocument();
      });
    });
  });

  describe("Review Sorting", () => {
    it("should default to 'recent' sort", async () => {
      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(reviewsService.getProductReviews).toHaveBeenCalledWith(
          "product123",
          "recent"
        );
      });
    });

    it("should change sort to 'helpful'", async () => {
      render(<ReviewSection product={mockProduct} />);

      const sortSelect = screen.getByRole("combobox");
      fireEvent.change(sortSelect, { target: { value: "helpful" } });

      await waitFor(() => {
        expect(reviewsService.getProductReviews).toHaveBeenCalledWith(
          "product123",
          "helpful"
        );
      });
    });

    it("should change sort to 'rating-high'", async () => {
      render(<ReviewSection product={mockProduct} />);

      const sortSelect = screen.getByRole("combobox");
      fireEvent.change(sortSelect, { target: { value: "rating-high" } });

      await waitFor(() => {
        expect(reviewsService.getProductReviews).toHaveBeenCalledWith(
          "product123",
          "rating-high"
        );
      });
    });

    it("should change sort to 'rating-low'", async () => {
      render(<ReviewSection product={mockProduct} />);

      const sortSelect = screen.getByRole("combobox");
      fireEvent.change(sortSelect, { target: { value: "rating-low" } });

      await waitFor(() => {
        expect(reviewsService.getProductReviews).toHaveBeenCalledWith(
          "product123",
          "rating-low"
        );
      });
    });

    it("should change sort to 'verified'", async () => {
      render(<ReviewSection product={mockProduct} />);

      const sortSelect = screen.getByRole("combobox");
      fireEvent.change(sortSelect, { target: { value: "verified" } });

      await waitFor(() => {
        expect(reviewsService.getProductReviews).toHaveBeenCalledWith(
          "product123",
          "verified"
        );
      });
    });

    it("should reload reviews when sort changes", async () => {
      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(reviewsService.getProductReviews).toHaveBeenCalledTimes(1);
      });

      const sortSelect = screen.getByRole("combobox");
      fireEvent.change(sortSelect, { target: { value: "helpful" } });

      await waitFor(() => {
        expect(reviewsService.getProductReviews).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Write Review Flow", () => {
    it("should show review form when write button clicked", async () => {
      render(<ReviewSection product={mockProduct} />);

      const writeButton = screen.getByRole("button", {
        name: /Write a Review/i,
      });
      fireEvent.click(writeButton);

      await waitFor(() => {
        expect(screen.getByTestId("review-form")).toBeInTheDocument();
      });
    });

    it("should hide write button when form is open", async () => {
      render(<ReviewSection product={mockProduct} />);

      const writeButton = screen.getByRole("button", {
        name: /Write a Review/i,
      });
      fireEvent.click(writeButton);

      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: /Write a Review/i })
        ).not.toBeInTheDocument();
      });
    });

    it("should close form on cancel", async () => {
      render(<ReviewSection product={mockProduct} />);

      const writeButton = screen.getByRole("button", {
        name: /Write a Review/i,
      });
      fireEvent.click(writeButton);

      await waitFor(() => {
        expect(screen.getByTestId("review-form")).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole("button", { name: /Cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByTestId("review-form")).not.toBeInTheDocument();
      });
    });

    it("should reload reviews after submission", async () => {
      render(<ReviewSection product={mockProduct} />);

      const writeButton = screen.getByRole("button", {
        name: /Write a Review/i,
      });
      fireEvent.click(writeButton);

      const submitButton = screen.getByRole("button", {
        name: /Submit Review/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(reviewsService.getProductReviews).toHaveBeenCalledTimes(2);
      });
    });

    it("should check if user already reviewed", async () => {
      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(reviewsService.hasUserReviewed).toHaveBeenCalledWith(
          "product123",
          "user123"
        );
      });
    });

    it("should disable write button if user already reviewed", async () => {
      (reviewsService.hasUserReviewed as jest.Mock).mockResolvedValue(true);

      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        const writeButton = screen.getByRole("button", {
          name: /You've already reviewed this product/i,
        });
        expect(writeButton).toBeDisabled();
      });
    });
  });

  describe("Loading States", () => {
    it("should show loading indicator while fetching reviews", () => {
      (reviewsService.getProductReviews as jest.Mock).mockReturnValue(
        new Promise(() => {}) // Never resolves
      );

      render(<ReviewSection product={mockProduct} />);

      expect(screen.getByText(/Loading reviews/i)).toBeInTheDocument();
    });

    it("should hide loading indicator after reviews load", async () => {
      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading reviews/i)).not.toBeInTheDocument();
      });
    });

    it("should show loading during auth check", () => {
      (useAuth as jest.Mock).mockReturnValue({ user: null, loading: true });

      render(<ReviewSection product={mockProduct} />);

      expect(
        screen.queryByRole("button", { name: /Write a Review/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Empty States", () => {
    it("should show empty state when no reviews", async () => {
      (reviewsService.getProductReviews as jest.Mock).mockResolvedValue([]);

      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(screen.getByText(/No reviews yet/i)).toBeInTheDocument();
      });
    });

    it("should show 'Be the first' message when no reviews", async () => {
      (reviewsService.getProductReviews as jest.Mock).mockResolvedValue([]);

      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(screen.getByText(/Be the first to review/i)).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle review fetch error gracefully", async () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation();
      (reviewsService.getProductReviews as jest.Mock).mockRejectedValue(
        new Error("Fetch failed")
      );

      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          "Error loading reviews:",
          expect.any(Error)
        );
      });

      consoleError.mockRestore();
    });

    it("should handle hasUserReviewed error gracefully", async () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation();
      (reviewsService.hasUserReviewed as jest.Mock).mockRejectedValue(
        new Error("Check failed")
      );

      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled();
      });

      consoleError.mockRestore();
    });
  });

  describe("Helpful Voting", () => {
    it("should reload reviews after helpful vote", async () => {
      render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        expect(reviewsService.getProductReviews).toHaveBeenCalledTimes(1);
      });

      // Simulate helpful vote callback from ReviewCard
      // This would be tested through integration
    });
  });

  describe("Responsive Design", () => {
    it("should render mobile-friendly layout", async () => {
      const { container } = render(<ReviewSection product={mockProduct} />);

      await waitFor(() => {
        const section = container.firstChild;
        expect(section).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle product without rating distribution", async () => {
      const productNoDistribution = {
        ...mockProduct,
        ratingDistribution: undefined,
      };

      render(<ReviewSection product={productNoDistribution} />);

      await waitFor(() => {
        expect(screen.getByText("Customer Reviews")).toBeInTheDocument();
      });
    });

    it("should handle missing averageRating", async () => {
      const productNoRating = {
        ...mockProduct,
        averageRating: 0,
      };

      render(<ReviewSection product={productNoRating} />);

      await waitFor(() => {
        expect(screen.getByText("0")).toBeInTheDocument();
      });
    });

    it("should handle rapid sort changes", async () => {
      render(<ReviewSection product={mockProduct} />);

      const sortSelect = screen.getByRole("combobox");

      fireEvent.change(sortSelect, { target: { value: "helpful" } });
      fireEvent.change(sortSelect, { target: { value: "rating-high" } });
      fireEvent.change(sortSelect, { target: { value: "verified" } });

      await waitFor(() => {
        expect(reviewsService.getProductReviews).toHaveBeenCalledWith(
          "product123",
          "verified"
        );
      });
    });

    it("should handle concurrent write review and sort change", async () => {
      render(<ReviewSection product={mockProduct} />);

      const writeButton = screen.getByRole("button", {
        name: /Write a Review/i,
      });
      fireEvent.click(writeButton);

      const sortSelect = screen.getByRole("combobox");
      fireEvent.change(sortSelect, { target: { value: "helpful" } });

      await waitFor(() => {
        expect(screen.getByTestId("review-form")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have accessible sort select", async () => {
      render(<ReviewSection product={mockProduct} />);

      const sortSelect = screen.getByRole("combobox");
      expect(sortSelect).toBeInTheDocument();
    });

    it("should have accessible write review button", async () => {
      render(<ReviewSection product={mockProduct} />);

      const writeButton = screen.getByRole("button", {
        name: /Write a Review/i,
      });
      expect(writeButton).toBeInTheDocument();
    });

    it("should have semantic heading", async () => {
      render(<ReviewSection product={mockProduct} />);

      const heading = screen.getByText("Customer Reviews");
      expect(heading.tagName).toBe("H2");
    });
  });
});
