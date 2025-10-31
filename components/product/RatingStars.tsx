/**
 * Rating Stars Component
 * Displays star ratings with support for half stars
 */

"use client";

import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showValue?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const starSize = sizeClasses[size];
  const textSize = textSizeClasses[size];

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const filled = rating >= starValue;
    const halfFilled = rating >= starValue - 0.5 && rating < starValue;

    return (
      <button
        key={index}
        type="button"
        onClick={() => interactive && onRatingChange?.(starValue)}
        disabled={!interactive}
        className={`relative focus:outline-none ${
          interactive
            ? "cursor-pointer hover:scale-110 transition-transform"
            : "cursor-default"
        }`}
      >
        {/* Background star (outline) */}
        <StarOutline className={`${starSize} text-gray-300`} />

        {/* Filled star (overlay) */}
        {filled && (
          <StarSolid
            className={`${starSize} text-yellow-400 absolute top-0 left-0`}
          />
        )}

        {/* Half-filled star (overlay) */}
        {halfFilled && (
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: "50%" }}
          >
            <StarSolid className={`${starSize} text-yellow-400`} />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
      {showValue && (
        <span className={`ml-2 font-medium text-gray-700 ${textSize}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
