/**
 * Review Card Component
 * Displays individual product review
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpSolid } from "@heroicons/react/24/solid";
import RatingStars from "./RatingStars";
import { reviewsService } from "../../services/reviews.service";
import toast from "react-hot-toast";

interface ReviewCardProps {
  review: {
    id: string;
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
    helpful: number;
    verified: boolean;
    createdAt: string;
    images?: string[];
  };
  onHelpfulClick?: () => void;
}

export default function ReviewCard({
  review,
  onHelpfulClick,
}: ReviewCardProps) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpfulClick = async () => {
    if (hasVoted) {
      toast.error("You've already marked this review as helpful");
      return;
    }

    try {
      const result = await reviewsService.markReviewHelpful(review.id);
      if (result.success) {
        setHelpful((prev) => prev + 1);
        setHasVoted(true);
        toast.success("Thanks for your feedback!");
        onHelpfulClick?.();
      } else {
        toast.error("Failed to mark as helpful");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {getInitials(review.userName)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              {review.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <RatingStars rating={review.rating} size="sm" />
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Title */}
      {review.title && (
        <h5 className="font-semibold text-gray-900 mb-2 text-lg">
          {review.title}
        </h5>
      )}

      {/* Review Comment */}
      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => window.open(image, "_blank")}
            />
          ))}
        </div>
      )}

      {/* Helpful Button */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <button
          onClick={handleHelpfulClick}
          disabled={hasVoted}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            hasVoted
              ? "bg-purple-100 text-purple-700 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {hasVoted ? (
            <HandThumbUpSolid className="w-4 h-4" />
          ) : (
            <HandThumbUpIcon className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            Helpful {helpful > 0 && `(${helpful})`}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
