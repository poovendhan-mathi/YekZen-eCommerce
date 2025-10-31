// Reviews service for managing product reviews
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";

interface CreateReviewData {
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  orderId?: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export const reviewsService = {
  /**
   * Create a new review
   */
  async createReview(reviewData: CreateReviewData): Promise<{
    success: boolean;
    reviewId?: string;
    error?: string;
  }> {
    try {
      // Validate rating
      if (reviewData.rating < 1 || reviewData.rating > 5) {
        return {
          success: false,
          error: "Rating must be between 1 and 5",
        };
      }

      // Validate comment length
      if (reviewData.comment.trim().length < 10) {
        return {
          success: false,
          error: "Review must be at least 10 characters long",
        };
      }

      // Check if user already reviewed this product
      const existingReview = await this.hasUserReviewed(
        reviewData.productId,
        reviewData.userEmail
      );

      if (existingReview.hasReviewed) {
        return {
          success: false,
          error: "You have already reviewed this product",
        };
      }

      // Verify purchase if orderId provided
      let verified = false;
      if (reviewData.orderId) {
        verified = await this.verifyPurchase(
          reviewData.orderId,
          reviewData.userId,
          reviewData.productId
        );
      }

      // Create review
      const review = {
        productId: reviewData.productId,
        userId: reviewData.userId,
        userName: reviewData.userName,
        userEmail: reviewData.userEmail,
        rating: reviewData.rating,
        title: reviewData.title.trim(),
        comment: reviewData.comment.trim(),
        images: reviewData.images || [],
        orderId: reviewData.orderId || null,
        helpful: 0,
        verified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const reviewRef = await addDoc(collection(db, "reviews"), review);

      // Update product's average rating and stats
      await this.updateProductRatingStats(reviewData.productId);

      return {
        success: true,
        reviewId: reviewRef.id,
      };
    } catch (error) {
      console.error("Error creating review:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create review",
      };
    }
  },

  /**
   * Get all reviews for a product with sorting
   */
  async getProductReviews(
    productId: string,
    sortBy: "recent" | "helpful" | "rating" | "verified" = "recent"
  ): Promise<{
    success: boolean;
    reviews?: any[];
    error?: string;
  }> {
    try {
      let reviewsQuery = query(
        collection(db, "reviews"),
        where("productId", "==", productId)
      );

      // Apply sorting
      switch (sortBy) {
        case "recent":
          reviewsQuery = query(reviewsQuery, orderBy("createdAt", "desc"));
          break;
        case "helpful":
          reviewsQuery = query(reviewsQuery, orderBy("helpful", "desc"));
          break;
        case "rating":
          reviewsQuery = query(reviewsQuery, orderBy("rating", "desc"));
          break;
        case "verified":
          reviewsQuery = query(
            reviewsQuery,
            orderBy("verified", "desc"),
            orderBy("createdAt", "desc")
          );
          break;
      }

      const querySnapshot = await getDocs(reviewsQuery);
      const reviews: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          ...data,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt,
          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate().toISOString()
              : data.updatedAt,
        });
      });

      return {
        success: true,
        reviews,
      };
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch reviews",
        reviews: [],
      };
    }
  },

  /**
   * Get reviews by a specific user
   */
  async getUserReviews(userEmail: string): Promise<{
    success: boolean;
    reviews?: any[];
    error?: string;
  }> {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("userEmail", "==", userEmail),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(reviewsQuery);
      const reviews: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          ...data,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt,
        });
      });

      return {
        success: true,
        reviews,
      };
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user reviews",
        reviews: [],
      };
    }
  },

  /**
   * Check if user has already reviewed a product
   */
  async hasUserReviewed(
    productId: string,
    userEmail: string
  ): Promise<{
    success: boolean;
    hasReviewed: boolean;
    error?: string;
  }> {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("productId", "==", productId),
        where("userEmail", "==", userEmail)
      );

      const querySnapshot = await getDocs(reviewsQuery);

      return {
        success: true,
        hasReviewed: !querySnapshot.empty,
      };
    } catch (error) {
      console.error("Error checking review status:", error);
      return {
        success: false,
        hasReviewed: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to check review status",
      };
    }
  },

  /**
   * Update product's average rating based on reviews
   */
  async updateProductRating(productId: string): Promise<void> {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("productId", "==", productId)
      );

      const querySnapshot = await getDocs(reviewsQuery);

      let totalRating = 0;
      let count = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalRating += data.rating || 0;
        count++;
      });

      const averageRating = count > 0 ? totalRating / count : 0;

      // Update product
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        rating: averageRating,
        reviewCount: count,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating product rating:", error);
    }
  },

  /**
   * Update product rating statistics (comprehensive)
   */
  async updateProductRatingStats(productId: string): Promise<void> {
    try {
      const stats = await this.getReviewStats(productId);

      if (!stats.success || !stats.stats) {
        return;
      }

      // Update product with detailed stats
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        rating: stats.stats.averageRating,
        reviewCount: stats.stats.totalReviews,
        reviews: stats.stats.totalReviews,
        ratingDistribution: stats.stats.ratingDistribution,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating product rating stats:", error);
    }
  },

  /**
   * Verify if user purchased the product
   */
  async verifyPurchase(
    orderId: string,
    userId: string,
    productId: string
  ): Promise<boolean> {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        return false;
      }

      const orderData = orderSnap.data();

      // Check if order belongs to user and contains the product
      const belongsToUser = orderData.userId === userId;
      const containsProduct = orderData.items?.some(
        (item: any) => item.id === productId || item.productId === productId
      );

      return belongsToUser && containsProduct;
    } catch (error) {
      console.error("Error verifying purchase:", error);
      return false;
    }
  },

  /**
   * Mark review as helpful
   */
  async markReviewHelpful(reviewId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, {
        helpful: increment(1),
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark review as helpful",
      };
    }
  },

  /**
   * Get review statistics for a product
   */
  async getReviewStats(productId: string): Promise<{
    success: boolean;
    stats?: {
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Record<number, number>;
    };
    error?: string;
  }> {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("productId", "==", productId)
      );

      const querySnapshot = await getDocs(reviewsQuery);

      let totalRating = 0;
      let totalReviews = 0;
      const distribution: Record<number, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const rating = Math.floor(data.rating || 0);
        totalRating += rating;
        totalReviews++;
        if (rating >= 1 && rating <= 5) {
          distribution[rating] = (distribution[rating] || 0) + 1;
        }
      });

      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      return {
        success: true,
        stats: {
          averageRating,
          totalReviews,
          ratingDistribution: distribution,
        },
      };
    } catch (error) {
      console.error("Error getting review stats:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get review stats",
      };
    }
  },
};
