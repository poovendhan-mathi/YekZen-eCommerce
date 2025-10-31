/**
 * Review Section Component
 * Complete reviews section for product detail page with Firebase integration
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RatingStars from "./RatingStars";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { reviewsService } from "../../services/reviews.service";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import Button from "../ui/Button";

interface ReviewSectionProps {
  productId: string;
  productRating: number;
  reviewCount: number;
  ratingDistribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  orderId?: string; // If user came from order page
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  productRating,
  reviewCount,
  ratingDistribution,
  orderId,
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<
    "recent" | "helpful" | "rating" | "verified"
  >("recent");
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  useEffect(() => {
    loadReviews();
    checkUserReview();
  }, [sortBy, productId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const result = await reviewsService.getProductReviews(productId, sortBy);
      if (result.success && result.reviews) {
        setReviews(result.reviews);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserReview = async () => {
    if (!user?.email) return;

    const result = await reviewsService.hasUserReviewed(productId, user.email);
    if (result.success) {
      setHasUserReviewed(result.hasReviewed);
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setHasUserReviewed(true);
    loadReviews();
    toast.success("Thank you for your review!");
  };

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "helpful", label: "Most Helpful" },
    { value: "rating", label: "Highest Rating" },
    { value: "verified", label: "Verified Purchases" },
  ];

  return (
    <div className="mt-12">
      {/* Section Header */}
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Customer Reviews
      </h2>

      {/* Rating Summary */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center md:border-r border-gray-200">
            <div className="text-6xl font-bold text-gray-900 mb-2">
              {productRating.toFixed(1)}
            </div>
            <RatingStars rating={productRating} size="lg" />
            <p className="text-gray-600 mt-2">
              Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count =
                ratingDistribution?.[star as keyof typeof ratingDistribution] ||
                0;
              const percentage =
                reviewCount > 0 ? (count / reviewCount) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-16 flex items-center gap-1">
                    {star} <span className="text-yellow-400">★</span>
                  </span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.1 * (5 - star) }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      {user && !hasUserReviewed && !showReviewForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => setShowReviewForm(true)}
            className="w-full md:w-auto"
          >
            Write a Review
          </Button>
        </motion.div>
      )}

      {/* Already Reviewed Message */}
      {user && hasUserReviewed && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✓ You've already reviewed this product. Thank you for your feedback!
          </p>
        </div>
      )}

      {/* Must Sign In Message */}
      {!user && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            Please{" "}
            <a href="/signin" className="font-medium underline">
              sign in
            </a>{" "}
            to write a review.
          </p>
        </div>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm
              productId={productId}
              orderId={orderId}
              onReviewSubmitted={handleReviewSubmitted}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Sort Options */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSortBy(option.value as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              sortBy === option.value
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-500">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <ReviewCard review={review} onHelpfulClick={loadReviews} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load More (if you implement pagination) */}
      {reviews.length > 0 && reviews.length % 10 === 0 && (
        <div className="mt-8 text-center">
          <Button variant="secondary">Load More Reviews</Button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
