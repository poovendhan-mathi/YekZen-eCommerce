/**
 * Review Form Component
 * Allows users to submit product reviews
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import RatingStars from "./RatingStars";
import { reviewsService } from "../../services/reviews.service";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId: string;
  orderId?: string;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

export default function ReviewForm({
  productId,
  orderId,
  onReviewSubmitted,
  onCancel,
}: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const ratingLabels: Record<number, string> = {
    1: "Terrible",
    2: "Poor",
    3: "Average",
    4: "Very Good",
    5: "Excellent",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Review must be at least 10 characters long");
      return;
    }

    setSubmitting(true);

    try {
      const result = await reviewsService.createReview({
        productId,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userEmail: user.email || "",
        rating,
        title: title.trim(),
        comment: comment.trim(),
        orderId,
      });

      if (result.success) {
        toast.success("Review submitted successfully!");
        onReviewSubmitted();
      } else {
        toast.error(result.error || "Failed to submit review");
      }
    } catch (error) {
      toast.error("An error occurred while submitting your review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 space-y-6"
    >
      <h3 className="text-2xl font-bold text-gray-900">Write a Review</h3>

      {/* Rating Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Your Rating *
        </label>
        <div className="flex items-center gap-3">
          <RatingStars
            rating={rating}
            size="xl"
            interactive
            onRatingChange={setRating}
          />
          <span className="text-lg font-medium text-purple-600">
            {ratingLabels[rating]}
          </span>
        </div>
      </div>

      {/* Review Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Review Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience in a few words"
          maxLength={100}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
        <p className="text-xs text-gray-500 mt-1">
          {title.length}/100 characters
        </p>
      </div>

      {/* Review Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product... (minimum 10 characters)"
          rows={6}
          required
          minLength={10}
          maxLength={1000}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/1000 characters
        </p>
      </div>

      {/* Verified Purchase Badge */}
      {orderId && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-green-800">
            Verified Purchase
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={submitting || comment.trim().length < 10}
          className="flex-1"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </motion.form>
  );
}
