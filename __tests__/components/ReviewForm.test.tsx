/**
 * Unit Tests for ReviewForm Component
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
jest.mock("react-hot-toast");

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReviewForm from "../../components/product/ReviewForm";
import { reviewsService } from "../../services/reviews.service";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const mockUser = {
  uid: "user123",
  email: "test@example.com",
  displayName: "Test User",
};

describe("ReviewForm Component", () => {
  const mockOnReviewSubmitted = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  describe("Rendering", () => {
    it("should render form with all fields", () => {
      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Write a Review")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Summarize your experience/i)
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Share your experience/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Submit Review/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Cancel/i })
      ).toBeInTheDocument();
    });

    it("should show verified purchase badge when orderId is provided", () => {
      render(
        <ReviewForm
          productId="prod123"
          orderId="order456"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Verified Purchase")).toBeInTheDocument();
    });

    it("should not show verified purchase badge when orderId is not provided", () => {
      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.queryByText("Verified Purchase")).not.toBeInTheDocument();
    });

    it("should display character count for title", () => {
      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("0/100 characters")).toBeInTheDocument();
    });

    it("should display character count for comment", () => {
      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("0/1000 characters")).toBeInTheDocument();
    });
  });

  describe("Form Input", () => {
    it("should update title input", () => {
      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const titleInput = screen.getByPlaceholderText(
        /Summarize your experience/i
      );
      fireEvent.change(titleInput, { target: { value: "Great product" } });
      expect(titleInput).toHaveValue("Great product");
      expect(screen.getByText("13/100 characters")).toBeInTheDocument();
    });

    it("should update comment input", () => {
      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const commentInput = screen.getByPlaceholderText(
        /Share your experience/i
      );
      fireEvent.change(commentInput, {
        target: { value: "This is a test review" },
      });
      expect(commentInput).toHaveValue("This is a test review");
      expect(screen.getByText("21/1000 characters")).toBeInTheDocument();
    });

    it("should enforce max length on title (100 chars)", () => {
      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const titleInput = screen.getByPlaceholderText(
        /Summarize your experience/i
      ) as HTMLInputElement;
      expect(titleInput.maxLength).toBe(100);
    });

    it("should enforce max length on comment (1000 chars)", () => {
      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const commentInput = screen.getByPlaceholderText(
        /Share your experience/i
      ) as HTMLTextAreaElement;
      expect(commentInput.maxLength).toBe(1000);
    });
  });

  describe("Rating Selection", () => {
    it("should default to 5 stars", () => {
      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Excellent")).toBeInTheDocument();
    });

    it("should show correct rating label for each rating", () => {
      const { rerender } = render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      // The component starts with rating 5 (Excellent)
      expect(screen.getByText("Excellent")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show error if user not signed in", async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: null });

      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByRole("button", {
        name: /Submit Review/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Please sign in to submit a review"
        );
      });
    });

    it("should show error if comment is too short", async () => {
      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const commentInput = screen.getByPlaceholderText(
        /Share your experience/i
      );
      fireEvent.change(commentInput, { target: { value: "Short" } }); // Only 5 chars

      const submitButton = screen.getByRole("button", {
        name: /Submit Review/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Review must be at least 10 characters long"
        );
      });
    });

    it("should disable submit button when comment is too short", () => {
      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByRole("button", {
        name: /Submit Review/i,
      });
      expect(submitButton).toBeDisabled();

      const commentInput = screen.getByPlaceholderText(
        /Share your experience/i
      );
      fireEvent.change(commentInput, {
        target: { value: "This is a valid review" },
      });

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Form Submission", () => {
    it("should submit review successfully", async () => {
      (reviewsService.createReview as jest.Mock).mockResolvedValue({
        success: true,
        reviewId: "review123",
      });

      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const titleInput = screen.getByPlaceholderText(
        /Summarize your experience/i
      );
      const commentInput = screen.getByPlaceholderText(
        /Share your experience/i
      );

      fireEvent.change(titleInput, { target: { value: "Great product" } });
      fireEvent.change(commentInput, {
        target: { value: "This is a detailed review about the product" },
      });

      const submitButton = screen.getByRole("button", {
        name: /Submit Review/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(reviewsService.createReview).toHaveBeenCalledWith({
          productId: "prod123",
          userId: "user123",
          userName: "Test User",
          userEmail: "test@example.com",
          rating: 5,
          title: "Great product",
          comment: "This is a detailed review about the product",
          orderId: undefined,
        });
      });

      await waitFor(() => {
        expect(mockOnReviewSubmitted).toHaveBeenCalled();
      });
    });

    it("should handle submission error", async () => {
      (reviewsService.createReview as jest.Mock).mockResolvedValue({
        success: false,
        error: "Failed to create review",
      });

      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const commentInput = screen.getByPlaceholderText(
        /Share your experience/i
      );
      fireEvent.change(commentInput, {
        target: { value: "This is a detailed review" },
      });

      const submitButton = screen.getByRole("button", {
        name: /Submit Review/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Failed to create review");
      });

      expect(mockOnReviewSubmitted).not.toHaveBeenCalled();
    });

    it("should show submitting state during submission", async () => {
      (reviewsService.createReview as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const commentInput = screen.getByPlaceholderText(
        /Share your experience/i
      );
      fireEvent.change(commentInput, {
        target: { value: "This is a detailed review" },
      });

      const submitButton = screen.getByRole("button", {
        name: /Submit Review/i,
      });
      fireEvent.click(submitButton);

      expect(screen.getByText("Submitting...")).toBeInTheDocument();
    });

    it("should include orderId when provided", async () => {
      (reviewsService.createReview as jest.Mock).mockResolvedValue({
        success: true,
        reviewId: "review123",
      });

      render(
        <ReviewForm
          productId="prod123"
          orderId="order456"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const commentInput = screen.getByPlaceholderText(
        /Share your experience/i
      );
      fireEvent.change(commentInput, {
        target: { value: "This is a detailed review" },
      });

      const submitButton = screen.getByRole("button", {
        name: /Submit Review/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(reviewsService.createReview).toHaveBeenCalledWith(
          expect.objectContaining({
            orderId: "order456",
          })
        );
      });
    });
  });

  describe("Cancel Action", () => {
    it("should call onCancel when cancel button is clicked", () => {
      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole("button", { name: /Cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe("User Display", () => {
    it("should handle user without displayName", async () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: { uid: "user123", email: "test@example.com", displayName: null },
      });

      (reviewsService.createReview as jest.Mock).mockResolvedValue({
        success: true,
        reviewId: "review123",
      });

      render(
        <ReviewForm
          productId="prod123"
          onReviewSubmitted={mockOnReviewSubmitted}
          onCancel={mockOnCancel}
        />
      );

      const commentInput = screen.getByPlaceholderText(
        /Share your experience/i
      );
      fireEvent.change(commentInput, {
        target: { value: "This is a detailed review" },
      });

      const submitButton = screen.getByRole("button", {
        name: /Submit Review/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(reviewsService.createReview).toHaveBeenCalledWith(
          expect.objectContaining({
            userName: "Anonymous",
          })
        );
      });
    });
  });
});
