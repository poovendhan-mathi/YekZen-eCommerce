/**
 * Unit Tests for ReviewCard Component
 */

// Mock Firebase before any imports
jest.mock("../../firebase/config", () => ({
  db: {},
  auth: {},
  storage: {},
}));

// Mock dependencies
jest.mock("../../services/reviews.service");
jest.mock("react-hot-toast");

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReviewCard from "../../components/product/ReviewCard";
import { reviewsService } from "../../services/reviews.service";
import toast from "react-hot-toast";

describe("ReviewCard Component", () => {
  const mockReview = {
    id: "review123",
    userName: "John Doe",
    userEmail: "john@example.com",
    rating: 5,
    title: "Excellent Product",
    comment: "This is a great product. I highly recommend it!",
    helpful: 10,
    verified: true,
    createdAt: "2025-10-15T10:00:00.000Z",
  };

  const mockOnHelpfulClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render review with all information", () => {
      render(
        <ReviewCard review={mockReview} onHelpfulClick={mockOnHelpfulClick} />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Excellent Product")).toBeInTheDocument();
      expect(
        screen.getByText("This is a great product. I highly recommend it!")
      ).toBeInTheDocument();
      expect(screen.getByText(/Helpful \(10\)/i)).toBeInTheDocument();
    });

    it("should show verified purchase badge when verified", () => {
      render(
        <ReviewCard review={mockReview} onHelpfulClick={mockOnHelpfulClick} />
      );
      expect(screen.getByText("Verified Purchase")).toBeInTheDocument();
    });

    it("should not show verified badge when not verified", () => {
      const unverifiedReview = { ...mockReview, verified: false };
      render(
        <ReviewCard
          review={unverifiedReview}
          onHelpfulClick={mockOnHelpfulClick}
        />
      );
      expect(screen.queryByText("Verified Purchase")).not.toBeInTheDocument();
    });

    it("should display user initials", () => {
      render(
        <ReviewCard review={mockReview} onHelpfulClick={mockOnHelpfulClick} />
      );
      expect(screen.getByText("JD")).toBeInTheDocument(); // John Doe -> JD
    });

    it("should handle single name for initials", () => {
      const singleNameReview = { ...mockReview, userName: "John" };
      render(
        <ReviewCard
          review={singleNameReview}
          onHelpfulClick={mockOnHelpfulClick}
        />
      );
      expect(screen.getByText("JO")).toBeInTheDocument(); // Takes first 2 chars
    });

    it("should display formatted date", () => {
      render(
        <ReviewCard review={mockReview} onHelpfulClick={mockOnHelpfulClick} />
      );
      expect(screen.getByText("October 15, 2025")).toBeInTheDocument();
    });

    it("should render without title", () => {
      const noTitleReview = { ...mockReview, title: "" };
      render(
        <ReviewCard
          review={noTitleReview}
          onHelpfulClick={mockOnHelpfulClick}
        />
      );

      expect(screen.queryByText("Excellent Product")).not.toBeInTheDocument();
      expect(
        screen.getByText("This is a great product. I highly recommend it!")
      ).toBeInTheDocument();
    });
  });

  describe("Rating Stars", () => {
    it("should display correct rating", () => {
      const { container } = render(
        <ReviewCard review={mockReview} onHelpfulClick={mockOnHelpfulClick} />
      );

      // RatingStars component should be rendered
      expect(
        container.querySelector('div[class*="flex items-center gap-3"]')
      ).toBeInTheDocument();
    });

    it("should handle different rating values", () => {
      const lowRatingReview = { ...mockReview, rating: 2 };
      render(
        <ReviewCard
          review={lowRatingReview}
          onHelpfulClick={mockOnHelpfulClick}
        />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  describe("Review Images", () => {
    it("should display review images when present", () => {
      const reviewWithImages = {
        ...mockReview,
        images: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg",
        ],
      };

      const { container } = render(
        <ReviewCard
          review={reviewWithImages}
          onHelpfulClick={mockOnHelpfulClick}
        />
      );

      const images = container.querySelectorAll("img");
      expect(images).toHaveLength(2);
    });

    it("should not display images section when no images", () => {
      const { container } = render(
        <ReviewCard review={mockReview} onHelpfulClick={mockOnHelpfulClick} />
      );

      // No images in mockReview
      const imageContainer = container.querySelector(
        'div[class*="flex gap-2"]'
      );
      expect(imageContainer).not.toBeInTheDocument();
    });

    it("should open image in new tab on click", () => {
      const reviewWithImages = {
        ...mockReview,
        images: ["https://example.com/image1.jpg"],
      };

      window.open = jest.fn();

      const { container } = render(
        <ReviewCard
          review={reviewWithImages}
          onHelpfulClick={mockOnHelpfulClick}
        />
      );

      const image = container.querySelector("img");
      fireEvent.click(image!);

      expect(window.open).toHaveBeenCalledWith(
        "https://example.com/image1.jpg",
        "_blank"
      );
    });
  });

  describe("Helpful Button", () => {
    it("should mark review as helpful on click", async () => {
      (reviewsService.markReviewHelpful as jest.Mock).mockResolvedValue({
        success: true,
      });

      render(
        <ReviewCard review={mockReview} onHelpfulClick={mockOnHelpfulClick} />
      );

      const helpfulButton = screen.getByRole("button", { name: /Helpful/i });
      fireEvent.click(helpfulButton);

      await waitFor(() => {
        expect(reviewsService.markReviewHelpful).toHaveBeenCalledWith(
          "review123"
        );
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Thanks for your feedback!");
      });

      await waitFor(() => {
        expect(mockOnHelpfulClick).toHaveBeenCalled();
      });
    });

    it("should increment helpful count after clicking", async () => {
      (reviewsService.markReviewHelpful as jest.Mock).mockResolvedValue({
        success: true,
      });

      render(
        <ReviewCard review={mockReview} onHelpfulClick={mockOnHelpfulClick} />
      );

      const helpfulButton = screen.getByRole("button", {
        name: /Helpful \(10\)/i,
      });
      fireEvent.click(helpfulButton);

      await waitFor(() => {
        expect(screen.getByText(/Helpful \(11\)/i)).toBeInTheDocument();
      });
    });

    it("should prevent multiple votes from same user", async () => {
      (reviewsService.markReviewHelpful as jest.Mock).mockResolvedValue({
        success: true,
      });

      render(
        <ReviewCard review={mockReview} onHelpfulClick={mockOnHelpfulClick} />
      );

      const helpfulButton = screen.getByRole("button", { name: /Helpful/i });

      // First click
      fireEvent.click(helpfulButton);

      await waitFor(() => {
        expect(reviewsService.markReviewHelpful).toHaveBeenCalledTimes(1);
      });

      // Second click
      fireEvent.click(helpfulButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "You've already marked this review as helpful"
        );
      });

      // Should still be called only once
      expect(reviewsService.markReviewHelpful).toHaveBeenCalledTimes(1);
    });

    it("should handle helpful click error", async () => {
      (reviewsService.markReviewHelpful as jest.Mock).mockResolvedValue({
        success: false,
        error: "Failed to mark as helpful",
      });

      render(
        <ReviewCard review={mockReview} onHelpfulClick={mockOnHelpfulClick} />
      );

      const helpfulButton = screen.getByRole("button", { name: /Helpful/i });
      fireEvent.click(helpfulButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Failed to mark as helpful");
      });
    });

    it("should disable helpful button after voting", async () => {
      (reviewsService.markReviewHelpful as jest.Mock).mockResolvedValue({
        success: true,
      });

      render(
        <ReviewCard review={mockReview} onHelpfulClick={mockOnHelpfulClick} />
      );

      const helpfulButton = screen.getByRole("button", { name: /Helpful/i });
      fireEvent.click(helpfulButton);

      await waitFor(() => {
        expect(helpfulButton).toBeDisabled();
      });
    });

    it("should show helpful count even when zero", () => {
      const noHelpfulReview = { ...mockReview, helpful: 0 };
      render(
        <ReviewCard
          review={noHelpfulReview}
          onHelpfulClick={mockOnHelpfulClick}
        />
      );

      // Should show "Helpful" without count when zero
      expect(screen.getByText(/Helpful/i)).toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    it("should handle invalid date gracefully", () => {
      const invalidDateReview = { ...mockReview, createdAt: "invalid-date" };
      render(
        <ReviewCard
          review={invalidDateReview}
          onHelpfulClick={mockOnHelpfulClick}
        />
      );

      // Should still render without crashing
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should format date correctly", () => {
      render(
        <ReviewCard review={mockReview} onHelpfulClick={mockOnHelpfulClick} />
      );
      expect(screen.getByText("October 15, 2025")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long names", () => {
      const longNameReview = {
        ...mockReview,
        userName: "John Jacob Jingleheimer Schmidt",
      };
      render(
        <ReviewCard
          review={longNameReview}
          onHelpfulClick={mockOnHelpfulClick}
        />
      );

      // Should only show first 2 initials
      expect(screen.getByText("JJ")).toBeInTheDocument();
      expect(
        screen.getByText("John Jacob Jingleheimer Schmidt")
      ).toBeInTheDocument();
    });

    it("should handle very long comments", () => {
      const longCommentReview = {
        ...mockReview,
        comment: "A".repeat(1000),
      };
      render(
        <ReviewCard
          review={longCommentReview}
          onHelpfulClick={mockOnHelpfulClick}
        />
      );

      expect(screen.getByText("A".repeat(1000))).toBeInTheDocument();
    });

    it("should handle missing onHelpfulClick callback", () => {
      render(<ReviewCard review={mockReview} />);

      const helpfulButton = screen.getByRole("button", { name: /Helpful/i });
      expect(helpfulButton).toBeInTheDocument();
    });
  });
});
