"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Button from "../ui/Button";

const ReviewSection = ({ reviews = [], productId, onReviewSubmit }) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    name: "",
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();

    const review = {
      id: Date.now(),
      user: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
      verified: false,
    };

    if (onReviewSubmit) {
      onReviewSubmit(review);
    }

    // Reset form
    setNewReview({ rating: 5, comment: "", name: "" });
    setShowAddReview(false);
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Customer Reviews ({reviews.length})
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {averageRating.toFixed(1)} out of 5
              </span>
            </div>
          )}
        </div>
        <Button
          onClick={() => setShowAddReview(!showAddReview)}
          variant="secondary"
          size="sm"
        >
          {showAddReview ? "Cancel" : "Write Review"}
        </Button>
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmitReview}
          className="bg-gray-50 rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="p-1"
                >
                  <StarIcon
                    className={`w-6 h-6 ${
                      star <= newReview.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Share your experience with this product..."
              required
            />
          </div>

          <div className="flex space-x-3">
            <Button type="submit">Submit Review</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddReview(false)}
            >
              Cancel
            </Button>
          </div>
        </motion.form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {review.user}
                      </h4>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-3 text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Load More Reviews */}
      {reviews.length > 5 && (
        <div className="text-center">
          <Button variant="secondary">Load More Reviews</Button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
