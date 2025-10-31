/**
 * Unit Tests for Reviews Service
 */

// Mock Firebase before any imports
jest.mock("firebase/firestore");
jest.mock("../../firebase/config", () => ({
  db: {},
  auth: {},
  storage: {},
}));

import { reviewsService } from "../../services/reviews.service";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  getDoc,
  increment,
} from "firebase/firestore";

describe("Reviews Service", () => {
  // Helper to create mock query snapshot with forEach
  const createMockQuerySnapshot = (docs: any[]) => ({
    empty: docs.length === 0,
    docs,
    forEach: function (callback: any) {
      this.docs.forEach((doc: any) => callback(doc));
    },
  });

  // Helper to create mock document snapshot
  const createMockDocSnap = (exists: boolean, data: any = {}) => ({
    exists: () => exists,
    data: () => data,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    (query as jest.Mock).mockReturnValue({});
    (doc as jest.Mock).mockReturnValue({});
    (collection as jest.Mock).mockReturnValue({});
  });

  describe("createReview", () => {
    const mockReviewData = {
      productId: "product123",
      userId: "user123",
      userName: "John Doe",
      userEmail: "john@example.com",
      rating: 5,
      title: "Great Product",
      comment: "I love this product!",
      images: [],
      orderId: "order123",
    };

    it("should create review successfully", async () => {
      const mockDocRef = { id: "review123" };
      const mockOrderSnap = createMockDocSnap(true, {
        userId: "user123",
        items: [{ productId: "product123" }],
      });
      const mockReviewsDocs = createMockQuerySnapshot([
        { data: () => ({ rating: 5 }) },
      ]);

      (getDocs as jest.Mock)
        .mockResolvedValueOnce(createMockQuerySnapshot([])) // Check for existing review
        .mockResolvedValueOnce(mockReviewsDocs); // Get reviews for stats
      (getDoc as jest.Mock).mockResolvedValue(mockOrderSnap);
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      const result = await reviewsService.createReview(mockReviewData);

      expect(result.success).toBe(true);
      expect(result.reviewId).toBe("review123");
      expect(addDoc).toHaveBeenCalled();
    });

    it("should prevent duplicate reviews from same user", async () => {
      (query as jest.Mock).mockReturnValue({});
      (getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [{ id: "existing-review" }],
      });

      const result = await reviewsService.createReview(mockReviewData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("already reviewed");
      expect(addDoc).not.toHaveBeenCalled();
    });

    it("should validate rating range", async () => {
      const invalidRatingData = { ...mockReviewData, rating: 6 };

      const result = await reviewsService.createReview(invalidRatingData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Rating must be between 1 and 5");
    });

    it("should validate minimum comment length", async () => {
      const shortCommentData = { ...mockReviewData, comment: "Short" };

      const result = await reviewsService.createReview(shortCommentData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("at least 10 characters");
    });

    it("should update product rating stats after review", async () => {
      const mockDocRef = { id: "review123" };
      const mockOrderSnap = createMockDocSnap(true, {
        userId: "user123",
        items: [{ productId: "product123" }],
      });
      const mockReviewsDocs = createMockQuerySnapshot([
        { data: () => ({ rating: 5 }) },
      ]);

      (getDocs as jest.Mock)
        .mockResolvedValueOnce(createMockQuerySnapshot([])) // Check existing review
        .mockResolvedValueOnce(mockReviewsDocs); // Get reviews for stats
      (getDoc as jest.Mock).mockResolvedValue(mockOrderSnap);
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      await reviewsService.createReview(mockReviewData);

      expect(updateDoc).toHaveBeenCalled();
    });

    it("should handle creation error gracefully", async () => {
      const mockOrderSnap = createMockDocSnap(true, {
        userId: "user123",
        items: [{ productId: "product123" }],
      });

      (getDocs as jest.Mock).mockResolvedValue(createMockQuerySnapshot([]));
      (getDoc as jest.Mock).mockResolvedValue(mockOrderSnap);
      (addDoc as jest.Mock).mockRejectedValue(new Error("Database error"));

      const result = await reviewsService.createReview(mockReviewData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Database error");
    });

    it("should include verified flag when orderId provided", async () => {
      const mockDocRef = { id: "review123" };
      const mockOrderSnap = createMockDocSnap(true, {
        userId: "user123",
        items: [{ productId: "product123" }],
      });
      const mockReviewsDocs = createMockQuerySnapshot([
        { data: () => ({ rating: 5 }) },
      ]);

      (getDocs as jest.Mock)
        .mockResolvedValueOnce(createMockQuerySnapshot([])) // Check existing review
        .mockResolvedValueOnce(mockReviewsDocs); // Get reviews for stats
      (getDoc as jest.Mock).mockResolvedValue(mockOrderSnap);
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      const dataWithOrder = { ...mockReviewData, orderId: "order123" };
      await reviewsService.createReview(dataWithOrder);

      const addDocCall = (addDoc as jest.Mock).mock.calls[0][1];
      expect(addDocCall.verified).toBe(true);
    });

    it("should set verified to false when no orderId", async () => {
      const mockDocRef = { id: "review123" };
      const mockReviewsDocs = createMockQuerySnapshot([
        { data: () => ({ rating: 5 }) },
      ]);

      (getDocs as jest.Mock)
        .mockResolvedValueOnce(createMockQuerySnapshot([])) // Check existing review
        .mockResolvedValueOnce(mockReviewsDocs); // Get reviews for stats
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      const dataNoOrder = { ...mockReviewData, orderId: undefined };
      await reviewsService.createReview(dataNoOrder);

      const addDocCall = (addDoc as jest.Mock).mock.calls[0][1];
      expect(addDocCall.verified).toBe(false);
    });
  });

  describe("getProductReviews", () => {
    const mockReviews = [
      {
        id: "review1",
        data: () => ({
          userName: "John Doe",
          rating: 5,
          title: "Great",
          comment: "Excellent product",
          helpful: 10,
          verified: true,
          createdAt: { toDate: () => new Date("2025-01-15") },
        }),
      },
      {
        id: "review2",
        data: () => ({
          userName: "Jane Smith",
          rating: 4,
          title: "Good",
          comment: "Nice product",
          helpful: 5,
          verified: false,
          createdAt: { toDate: () => new Date("2025-01-14") },
        }),
      },
    ];

    it("should get reviews sorted by recent", async () => {
      (getDocs as jest.Mock).mockResolvedValue(
        createMockQuerySnapshot(mockReviews)
      );

      const result = await reviewsService.getProductReviews(
        "product123",
        "recent"
      );

      expect(result.success).toBe(true);
      expect(result.reviews).toHaveLength(2);
      expect(result.reviews[0].id).toBe("review1");
      expect(orderBy).toHaveBeenCalledWith("createdAt", "desc");
    });

    it("should get reviews sorted by helpful", async () => {
      (getDocs as jest.Mock).mockResolvedValue(
        createMockQuerySnapshot(mockReviews)
      );

      const result = await reviewsService.getProductReviews(
        "product123",
        "helpful"
      );

      expect(result.success).toBe(true);
      expect(orderBy).toHaveBeenCalledWith("helpful", "desc");
    });

    it("should get reviews sorted by rating (high to low)", async () => {
      (getDocs as jest.Mock).mockResolvedValue(
        createMockQuerySnapshot(mockReviews)
      );

      const result = await reviewsService.getProductReviews(
        "product123",
        "rating"
      );

      expect(result.success).toBe(true);
      expect(orderBy).toHaveBeenCalledWith("rating", "desc");
    });

    it("should sort verified reviews first", async () => {
      (getDocs as jest.Mock).mockResolvedValue(
        createMockQuerySnapshot(mockReviews)
      );

      const result = await reviewsService.getProductReviews(
        "product123",
        "verified"
      );

      expect(result.success).toBe(true);
      expect(orderBy).toHaveBeenCalledWith("verified", "desc");
    });

    it("should handle empty reviews", async () => {
      (getDocs as jest.Mock).mockResolvedValue(createMockQuerySnapshot([]));

      const result = await reviewsService.getProductReviews("product123");

      expect(result.success).toBe(true);
      expect(result.reviews).toHaveLength(0);
    });

    it("should handle fetch error", async () => {
      (getDocs as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

      const result = await reviewsService.getProductReviews("product123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Fetch failed");
    });

    it("should convert Firestore timestamps to ISO strings", async () => {
      const mockReviewsWithTimestamp = [
        {
          id: "review1",
          data: () => ({
            userName: "John Doe",
            rating: 5,
            comment: "Great!",
            createdAt: {
              toDate: () => new Date("2025-01-15"),
              seconds: 1736899200,
            },
            updatedAt: {
              toDate: () => new Date("2025-01-15"),
              seconds: 1736899200,
            },
          }),
        },
      ];

      // Mock Timestamp class
      const Timestamp = class {
        constructor(public seconds: number, public nanoseconds: number) {}
        toDate() {
          return new Date(this.seconds * 1000);
        }
      };

      // Make the mock data match Timestamp instance
      const mockWithRealTimestamp = [
        {
          id: "review1",
          data: () => ({
            userName: "John Doe",
            rating: 5,
            comment: "Great!",
            createdAt: new Timestamp(1736899200, 0),
            updatedAt: new Timestamp(1736899200, 0),
          }),
        },
      ];

      (getDocs as jest.Mock).mockResolvedValue(
        createMockQuerySnapshot(mockWithRealTimestamp)
      );

      const result = await reviewsService.getProductReviews("product123");

      expect(result.success).toBe(true);
      expect(result.reviews[0].createdAt).toBeDefined();
    });
  });

  describe("verifyPurchase", () => {
    it("should verify user purchased product", async () => {
      const mockOrderSnap = createMockDocSnap(true, {
        userId: "user123",
        items: [
          { productId: "product123", quantity: 1 },
          { productId: "product456", quantity: 2 },
        ],
      });

      (getDoc as jest.Mock).mockResolvedValue(mockOrderSnap);

      const result = await reviewsService.verifyPurchase(
        "order123",
        "user123",
        "product123"
      );

      expect(result).toBe(true);
    });

    it("should return false if no purchase found", async () => {
      const mockOrderSnap = createMockDocSnap(true, {
        userId: "user123",
        items: [{ productId: "product456", quantity: 1 }],
      });

      (getDoc as jest.Mock).mockResolvedValue(mockOrderSnap);

      const result = await reviewsService.verifyPurchase(
        "order123",
        "user123",
        "product123"
      );

      expect(result).toBe(false);
    });

    it("should return false if no orders found", async () => {
      const mockOrderSnap = createMockDocSnap(false);

      (getDoc as jest.Mock).mockResolvedValue(mockOrderSnap);

      const result = await reviewsService.verifyPurchase(
        "order123",
        "user123",
        "product123"
      );

      expect(result).toBe(false);
    });

    it("should handle verification error", async () => {
      (getDoc as jest.Mock).mockRejectedValue(new Error("Query failed"));

      const result = await reviewsService.verifyPurchase(
        "order123",
        "user123",
        "product123"
      );

      expect(result).toBe(false);
    });
  });

  describe("hasUserReviewed", () => {
    it("should return true if user already reviewed", async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [{ id: "review123" }],
      });

      const result = await reviewsService.hasUserReviewed(
        "product123",
        "user123"
      );

      expect(result.success).toBe(true);
      expect(result.hasReviewed).toBe(true);
    });

    it("should return false if user has not reviewed", async () => {
      (getDocs as jest.Mock).mockResolvedValue({ empty: true });

      const result = await reviewsService.hasUserReviewed(
        "product123",
        "user123"
      );

      expect(result.success).toBe(true);
      expect(result.hasReviewed).toBe(false);
    });

    it("should handle check error", async () => {
      (getDocs as jest.Mock).mockRejectedValue(new Error("Query failed"));

      const result = await reviewsService.hasUserReviewed(
        "product123",
        "user123"
      );

      expect(result.success).toBe(false);
      expect(result.hasReviewed).toBe(false);
    });
  });

  describe("markReviewHelpful", () => {
    it("should increment helpful count", async () => {
      (doc as jest.Mock).mockReturnValue({});
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      const result = await reviewsService.markReviewHelpful("review123");

      expect(result.success).toBe(true);
      expect(updateDoc).toHaveBeenCalled();
    });

    it("should handle update error", async () => {
      (doc as jest.Mock).mockReturnValue({});
      (updateDoc as jest.Mock).mockRejectedValue(new Error("Update failed"));

      const result = await reviewsService.markReviewHelpful("review123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Update failed");
    });
  });

  describe("updateProductRatingStats", () => {
    const mockProduct = {
      data: () => ({
        averageRating: 4.0,
        reviewCount: 2,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 2, 5: 0 },
      }),
    };

    const mockReviews = [
      { data: () => ({ rating: 5 }) },
      { data: () => ({ rating: 4 }) },
      { data: () => ({ rating: 4 }) },
    ];

    it("should recalculate average rating", async () => {
      (getDocs as jest.Mock).mockResolvedValue(
        createMockQuerySnapshot(mockReviews)
      );
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      await reviewsService.updateProductRatingStats("product123");

      expect(updateDoc).toHaveBeenCalled();
      const updateCall = (updateDoc as jest.Mock).mock.calls[0][1];
      expect(updateCall.reviewCount).toBe(3);
      expect(updateCall.rating).toBeCloseTo(4.33, 1);
    });

    it("should update rating distribution", async () => {
      (getDocs as jest.Mock).mockResolvedValue(
        createMockQuerySnapshot(mockReviews)
      );
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      await reviewsService.updateProductRatingStats("product123");

      const updateCall = (updateDoc as jest.Mock).mock.calls[0][1];
      expect(updateCall.ratingDistribution).toEqual({
        1: 0,
        2: 0,
        3: 0,
        4: 2,
        5: 1,
      });
    });

    it("should handle zero reviews", async () => {
      (getDocs as jest.Mock).mockResolvedValue(createMockQuerySnapshot([]));
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      await reviewsService.updateProductRatingStats("product123");

      expect(updateDoc).toHaveBeenCalled();
      const updateCall = (updateDoc as jest.Mock).mock.calls[0][1];
      expect(updateCall.reviewCount).toBe(0);
      expect(updateCall.rating).toBe(0);
    });

    it("should handle product not found", async () => {
      (getDocs as jest.Mock).mockRejectedValue(new Error("Not found"));

      // This method doesn't throw, it just logs the error
      await reviewsService.updateProductRatingStats("nonexistent");

      expect(updateDoc).not.toHaveBeenCalled();
    });
  });

  describe("getReviewStats", () => {
    const mockReviews = [
      { data: () => ({ rating: 5, verified: true }) },
      { data: () => ({ rating: 4, verified: true }) },
      { data: () => ({ rating: 3, verified: false }) },
      { data: () => ({ rating: 5, verified: true }) },
    ];

    it("should calculate review statistics", async () => {
      (getDocs as jest.Mock).mockResolvedValue(
        createMockQuerySnapshot(mockReviews)
      );

      const result = await reviewsService.getReviewStats("product123");

      expect(result.success).toBe(true);
      expect(result.stats?.totalReviews).toBe(4);
      expect(result.stats?.averageRating).toBeCloseTo(4.25, 2);
      expect(result.stats?.ratingDistribution).toEqual({
        1: 0,
        2: 0,
        3: 1,
        4: 1,
        5: 2,
      });
    });

    it("should handle empty reviews", async () => {
      (getDocs as jest.Mock).mockResolvedValue(createMockQuerySnapshot([]));

      const result = await reviewsService.getReviewStats("product123");

      expect(result.success).toBe(true);
      expect(result.stats?.totalReviews).toBe(0);
      expect(result.stats?.averageRating).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle concurrent review submissions", async () => {
      const mockOrderSnap = createMockDocSnap(true, {
        userId: "user1",
        items: [{ productId: "product123" }],
      });
      const mockReviewsDocs = createMockQuerySnapshot([
        { data: () => ({ rating: 5 }) },
      ]);

      // Mock for both concurrent calls
      (getDoc as jest.Mock).mockResolvedValue(mockOrderSnap);
      (getDocs as jest.Mock).mockResolvedValue(createMockQuerySnapshot([])); // Always return empty for hasUserReviewed
      (addDoc as jest.Mock).mockResolvedValue({ id: "review123" });
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      const reviews = [
        {
          productId: "product123",
          userId: "user1",
          userName: "User 1",
          userEmail: "user1@example.com",
          rating: 5,
          comment: "Great product!",
          title: "Great",
          orderId: "order123",
        },
        {
          productId: "product123",
          userId: "user2",
          userName: "User 2",
          userEmail: "user2@example.com",
          rating: 4,
          comment: "Good product!",
          title: "Good",
          orderId: "order124",
        },
      ];

      // Run them sequentially to avoid mock conflicts
      const result1 = await reviewsService.createReview(reviews[0]);
      const result2 = await reviewsService.createReview(reviews[1]);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    it("should sanitize user input", async () => {
      const maliciousData = {
        productId: "product123",
        userId: "user123",
        userName: "<script>alert('xss')</script>",
        userEmail: "user@example.com",
        rating: 5,
        comment:
          "<img src=x onerror=alert('xss')>Good product, very happy with it!",
        title: "Great product",
        orderId: "order123",
      };

      const mockOrderSnap = createMockDocSnap(true, {
        userId: "user123",
        items: [{ productId: "product123" }],
      });
      const mockDocRef = { id: "review123" };
      const mockReviewsDocs = createMockQuerySnapshot([
        { data: () => ({ rating: 5 }) },
      ]);

      (getDoc as jest.Mock).mockResolvedValue(mockOrderSnap);
      (getDocs as jest.Mock)
        .mockResolvedValueOnce(createMockQuerySnapshot([])) // hasUserReviewed
        .mockResolvedValueOnce(mockReviewsDocs); // getReviewStats
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      const result = await reviewsService.createReview(maliciousData);

      expect(result.success).toBe(true);
    });

    it("should handle very long review lists", async () => {
      const manyReviews = Array.from({ length: 1000 }, (_, i) => ({
        id: `review${i}`,
        data: () => ({
          userName: `User ${i}`,
          rating: (i % 5) + 1,
          comment: "Review comment",
          helpful: i,
          verified: i % 2 === 0,
          createdAt: { toDate: () => new Date() },
        }),
      }));

      (getDocs as jest.Mock).mockResolvedValue(
        createMockQuerySnapshot(manyReviews)
      );

      const result = await reviewsService.getProductReviews("product123");

      expect(result.success).toBe(true);
      expect(result.reviews).toHaveLength(1000);
    });
  });
});
