/**
 * Unit Tests for RatingStars Component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import RatingStars from "../../components/product/RatingStars";

describe("RatingStars Component", () => {
  describe("Display Mode", () => {
    it("should render correct number of stars", () => {
      const { container } = render(<RatingStars rating={4} />);
      const stars = container.querySelectorAll("button");
      expect(stars).toHaveLength(5); // Default maxRating is 5
    });

    it("should display full stars for whole number ratings", () => {
      const { container } = render(<RatingStars rating={3} />);
      const filledStars = container.querySelectorAll(
        'svg[class*="text-yellow-400"]'
      );
      expect(filledStars.length).toBeGreaterThanOrEqual(3);
    });

    it("should show rating value when showValue is true", () => {
      render(<RatingStars rating={4.5} showValue />);
      expect(screen.getByText("4.5")).toBeInTheDocument();
    });

    it("should not show rating value when showValue is false", () => {
      const { container } = render(
        <RatingStars rating={4.5} showValue={false} />
      );
      expect(screen.queryByText("4.5")).not.toBeInTheDocument();
    });

    it("should apply correct size classes", () => {
      const { container: small } = render(<RatingStars rating={4} size="sm" />);
      expect(small.querySelector('svg[class*="w-4"]')).toBeInTheDocument();

      const { container: large } = render(<RatingStars rating={4} size="lg" />);
      expect(large.querySelector('svg[class*="w-6"]')).toBeInTheDocument();

      const { container: xlarge } = render(
        <RatingStars rating={4} size="xl" />
      );
      expect(xlarge.querySelector('svg[class*="w-8"]')).toBeInTheDocument();
    });

    it("should handle zero rating", () => {
      const { container } = render(<RatingStars rating={0} />);
      const filledStars = container.querySelectorAll(
        'svg[class*="text-yellow-400"]'
      );
      expect(filledStars.length).toBe(0);
    });

    it("should handle maximum rating", () => {
      const { container } = render(<RatingStars rating={5} />);
      const filledStars = container.querySelectorAll(
        'svg[class*="text-yellow-400"]'
      );
      expect(filledStars.length).toBeGreaterThanOrEqual(5);
    });

    it("should support custom maxRating", () => {
      const { container } = render(<RatingStars rating={8} maxRating={10} />);
      const stars = container.querySelectorAll("button");
      expect(stars).toHaveLength(10);
    });
  });

  describe("Interactive Mode", () => {
    it("should call onRatingChange when star is clicked", () => {
      const handleRatingChange = jest.fn();
      const { container } = render(
        <RatingStars
          rating={3}
          interactive
          onRatingChange={handleRatingChange}
        />
      );

      const stars = container.querySelectorAll("button");
      fireEvent.click(stars[4]); // Click 5th star
      expect(handleRatingChange).toHaveBeenCalledWith(5);
    });

    it("should not call onRatingChange when not interactive", () => {
      const handleRatingChange = jest.fn();
      const { container } = render(
        <RatingStars
          rating={3}
          interactive={false}
          onRatingChange={handleRatingChange}
        />
      );

      const stars = container.querySelectorAll("button");
      fireEvent.click(stars[4]);
      expect(handleRatingChange).not.toHaveBeenCalled();
    });

    it("should have cursor-pointer class when interactive", () => {
      const { container } = render(
        <RatingStars rating={3} interactive onRatingChange={() => {}} />
      );
      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button.className).toContain("cursor-pointer");
      });
    });

    it("should have cursor-default class when not interactive", () => {
      const { container } = render(
        <RatingStars rating={3} interactive={false} />
      );
      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button.className).toContain("cursor-default");
      });
    });

    it("should update rating on each star click", () => {
      const handleRatingChange = jest.fn();
      const { container } = render(
        <RatingStars
          rating={0}
          interactive
          onRatingChange={handleRatingChange}
        />
      );

      const stars = container.querySelectorAll("button");

      fireEvent.click(stars[0]);
      expect(handleRatingChange).toHaveBeenCalledWith(1);

      fireEvent.click(stars[2]);
      expect(handleRatingChange).toHaveBeenCalledWith(3);

      fireEvent.click(stars[4]);
      expect(handleRatingChange).toHaveBeenCalledWith(5);
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative ratings by showing no filled stars", () => {
      const { container } = render(<RatingStars rating={-1} />);
      const filledStars = container.querySelectorAll(
        'svg[class*="text-yellow-400"]'
      );
      expect(filledStars.length).toBe(0);
    });

    it("should handle ratings above maxRating", () => {
      const { container } = render(<RatingStars rating={10} maxRating={5} />);
      // Should still render 5 stars (maxRating)
      const stars = container.querySelectorAll("button");
      expect(stars).toHaveLength(5);
    });

    it("should handle decimal ratings for half-stars", () => {
      render(<RatingStars rating={3.5} />);
      // Component should render properly with decimal
      expect(screen.getByRole("generic")).toBeInTheDocument();
    });

    it("should round rating value display to one decimal", () => {
      render(<RatingStars rating={4.567} showValue />);
      expect(screen.getByText("4.6")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have buttons with proper type", () => {
      const { container } = render(<RatingStars rating={3} interactive />);
      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button.getAttribute("type")).toBe("button");
      });
    });

    it("should have disabled buttons when not interactive", () => {
      const { container } = render(
        <RatingStars rating={3} interactive={false} />
      );
      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it("should have enabled buttons when interactive", () => {
      const { container } = render(
        <RatingStars rating={3} interactive onRatingChange={() => {}} />
      );
      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button).not.toBeDisabled();
      });
    });
  });
});
