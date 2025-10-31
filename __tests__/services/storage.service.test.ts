/**
 * Unit Tests for Storage Service
 */

// Mock Firebase before any imports
jest.mock("firebase/storage");
jest.mock("../../firebase/config", () => ({
  db: {},
  auth: {},
  storage: {},
}));

import { storageService } from "../../services/storage.service";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

describe("Storage Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadProductImage", () => {
    const mockFile = new File(["image content"], "test.jpg", {
      type: "image/jpeg",
    });
    const mockProductId = "product123";

    it("should upload image successfully", async () => {
      const mockRef = { fullPath: "products/product123/image.jpg" };
      const mockDownloadURL = "https://firebase.storage/image.jpg";

      (ref as jest.Mock).mockReturnValue(mockRef);
      (uploadBytes as jest.Mock).mockResolvedValue({ ref: mockRef });
      (getDownloadURL as jest.Mock).mockResolvedValue(mockDownloadURL);

      const result = await storageService.uploadProductImage(
        mockFile,
        mockProductId
      );

      expect(result.success).toBe(true);
      expect(result.url).toBe(mockDownloadURL);
      expect(result.storageRef).toContain("products/product123");
      expect(uploadBytes).toHaveBeenCalledWith(mockRef, mockFile);
    });

    it("should generate unique filename with timestamp", async () => {
      const mockRef = { fullPath: "products/product123/image.jpg" };
      const mockDownloadURL = "https://firebase.storage/image.jpg";

      (ref as jest.Mock).mockReturnValue(mockRef);
      (uploadBytes as jest.Mock).mockResolvedValue({ ref: mockRef });
      (getDownloadURL as jest.Mock).mockResolvedValue(mockDownloadURL);

      const result = await storageService.uploadProductImage(
        mockFile,
        mockProductId
      );

      expect(result.storageRef).toMatch(/products\/product123\/\d+-test\.jpg/);
    });

    it("should handle upload error", async () => {
      (ref as jest.Mock).mockReturnValue({});
      (uploadBytes as jest.Mock).mockRejectedValue(new Error("Upload failed"));

      const result = await storageService.uploadProductImage(
        mockFile,
        mockProductId
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("Upload failed");
    });

    it("should validate file size before upload", async () => {
      const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
        type: "image/jpeg",
      });
      Object.defineProperty(largeFile, "size", { value: 6 * 1024 * 1024 });

      const result = await storageService.uploadProductImage(
        largeFile,
        mockProductId
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("File size must be less than 5MB");
      expect(uploadBytes).not.toHaveBeenCalled();
    });

    it("should validate file type before upload", async () => {
      const pdfFile = new File(["pdf content"], "document.pdf", {
        type: "application/pdf",
      });

      const result = await storageService.uploadProductImage(
        pdfFile,
        mockProductId
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("Only image files are allowed");
      expect(uploadBytes).not.toHaveBeenCalled();
    });

    it("should accept JPEG files", async () => {
      const jpegFile = new File(["image"], "test.jpeg", {
        type: "image/jpeg",
      });

      const mockRef = { fullPath: "products/product123/test.jpeg" };
      (ref as jest.Mock).mockReturnValue(mockRef);
      (uploadBytes as jest.Mock).mockResolvedValue({ ref: mockRef });
      (getDownloadURL as jest.Mock).mockResolvedValue("url");

      const result = await storageService.uploadProductImage(
        jpegFile,
        mockProductId
      );

      expect(result.success).toBe(true);
    });

    it("should accept PNG files", async () => {
      const pngFile = new File(["image"], "test.png", { type: "image/png" });

      const mockRef = { fullPath: "products/product123/test.png" };
      (ref as jest.Mock).mockReturnValue(mockRef);
      (uploadBytes as jest.Mock).mockResolvedValue({ ref: mockRef });
      (getDownloadURL as jest.Mock).mockResolvedValue("url");

      const result = await storageService.uploadProductImage(
        pngFile,
        mockProductId
      );

      expect(result.success).toBe(true);
    });

    it("should accept WebP files", async () => {
      const webpFile = new File(["image"], "test.webp", {
        type: "image/webp",
      });

      const mockRef = { fullPath: "products/product123/test.webp" };
      (ref as jest.Mock).mockReturnValue(mockRef);
      (uploadBytes as jest.Mock).mockResolvedValue({ ref: mockRef });
      (getDownloadURL as jest.Mock).mockResolvedValue("url");

      const result = await storageService.uploadProductImage(
        webpFile,
        mockProductId
      );

      expect(result.success).toBe(true);
    });

    it("should sanitize filename", async () => {
      const fileWithSpaces = new File(["image"], "my test image!@#.jpg", {
        type: "image/jpeg",
      });

      const mockRef = { fullPath: "products/product123/sanitized.jpg" };
      (ref as jest.Mock).mockReturnValue(mockRef);
      (uploadBytes as jest.Mock).mockResolvedValue({ ref: mockRef });
      (getDownloadURL as jest.Mock).mockResolvedValue("url");

      const result = await storageService.uploadProductImage(
        fileWithSpaces,
        mockProductId
      );

      expect(result.success).toBe(true);
      expect(result.storageRef).not.toContain(" ");
      expect(result.storageRef).not.toContain("!");
    });
  });

  describe("uploadReviewImage", () => {
    const mockFile = new File(["image"], "review.jpg", { type: "image/jpeg" });
    const mockReviewId = "review123";

    it("should upload review image successfully", async () => {
      const mockRef = { fullPath: "reviews/review123/image.jpg" };
      const mockDownloadURL = "https://firebase.storage/review.jpg";

      (ref as jest.Mock).mockReturnValue(mockRef);
      (uploadBytes as jest.Mock).mockResolvedValue({ ref: mockRef });
      (getDownloadURL as jest.Mock).mockResolvedValue(mockDownloadURL);

      const result = await storageService.uploadReviewImage(
        mockFile,
        mockReviewId
      );

      expect(result.success).toBe(true);
      expect(result.url).toBe(mockDownloadURL);
      expect(result.storageRef).toContain("reviews/review123");
    });

    it("should use different path than product images", async () => {
      const mockRef = { fullPath: "reviews/review123/image.jpg" };
      (ref as jest.Mock).mockReturnValue(mockRef);
      (uploadBytes as jest.Mock).mockResolvedValue({ ref: mockRef });
      (getDownloadURL as jest.Mock).mockResolvedValue("url");

      const result = await storageService.uploadReviewImage(
        mockFile,
        mockReviewId
      );

      expect(result.storageRef).toContain("reviews/");
      expect(result.storageRef).not.toContain("products/");
    });

    it("should validate file size for review images", async () => {
      const largeFile = new File(["x".repeat(4 * 1024 * 1024)], "large.jpg", {
        type: "image/jpeg",
      });
      Object.defineProperty(largeFile, "size", { value: 4 * 1024 * 1024 });

      const result = await storageService.uploadReviewImage(
        largeFile,
        mockReviewId
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("File size must be less than 3MB");
    });
  });

  describe("deleteProductImage", () => {
    const mockStorageRef = "products/product123/image.jpg";

    it("should delete image successfully", async () => {
      const mockRef = { fullPath: mockStorageRef };
      (ref as jest.Mock).mockReturnValue(mockRef);
      (deleteObject as jest.Mock).mockResolvedValue(undefined);

      const result = await storageService.deleteProductImage(mockStorageRef);

      expect(result.success).toBe(true);
      expect(deleteObject).toHaveBeenCalledWith(mockRef);
    });

    it("should handle delete error", async () => {
      const mockRef = { fullPath: mockStorageRef };
      (ref as jest.Mock).mockReturnValue(mockRef);
      (deleteObject as jest.Mock).mockRejectedValue(new Error("Delete failed"));

      const result = await storageService.deleteProductImage(mockStorageRef);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Delete failed");
    });

    it("should handle non-existent file gracefully", async () => {
      const mockRef = { fullPath: mockStorageRef };
      (ref as jest.Mock).mockReturnValue(mockRef);
      (deleteObject as jest.Mock).mockRejectedValue({
        code: "storage/object-not-found",
      });

      const result = await storageService.deleteProductImage(mockStorageRef);

      expect(result.success).toBe(false);
    });
  });

  describe("deleteReviewImage", () => {
    const mockStorageRef = "reviews/review123/image.jpg";

    it("should delete review image successfully", async () => {
      const mockRef = { fullPath: mockStorageRef };
      (ref as jest.Mock).mockReturnValue(mockRef);
      (deleteObject as jest.Mock).mockResolvedValue(undefined);

      const result = await storageService.deleteReviewImage(mockStorageRef);

      expect(result.success).toBe(true);
      expect(deleteObject).toHaveBeenCalledWith(mockRef);
    });
  });

  describe("isValidImageUrl", () => {
    it("should validate accessible image URL", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue("image/jpeg"),
        },
      });

      const result = await storageService.isValidImageUrl(
        "https://example.com/image.jpg"
      );

      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith("https://example.com/image.jpg", {
        method: "HEAD",
      });
    });

    it("should reject non-image content type", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue("text/html"),
        },
      });

      const result = await storageService.isValidImageUrl(
        "https://example.com/page.html"
      );

      expect(result).toBe(false);
    });

    it("should reject inaccessible URLs", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await storageService.isValidImageUrl(
        "https://example.com/notfound.jpg"
      );

      expect(result).toBe(false);
    });

    it("should handle network errors", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      const result = await storageService.isValidImageUrl(
        "https://example.com/image.jpg"
      );

      expect(result).toBe(false);
    });

    it("should reject invalid URL format", async () => {
      const result = await storageService.isValidImageUrl("not-a-url");

      expect(result).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should accept various image MIME types", async () => {
      const mimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

      for (const mimeType of mimeTypes) {
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue(mimeType),
          },
        });

        const result = await storageService.isValidImageUrl(
          "https://example.com/image"
        );

        expect(result).toBe(true);
      }
    });
  });

  describe("getOptimizedImageUrl", () => {
    it("should return optimized Firebase Storage URL", () => {
      const firebaseUrl =
        "https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fimage.jpg";

      const result = storageService.getOptimizedImageUrl(firebaseUrl, {
        width: 400,
        height: 400,
      });

      expect(result).toContain("_400x400");
    });

    it("should return original URL for non-Firebase URLs", () => {
      const externalUrl = "https://example.com/image.jpg";

      const result = storageService.getOptimizedImageUrl(externalUrl, {
        width: 400,
        height: 400,
      });

      expect(result).toBe(externalUrl);
    });

    it("should handle quality parameter", () => {
      const firebaseUrl =
        "https://firebasestorage.googleapis.com/v0/b/bucket/o/image.jpg";

      const result = storageService.getOptimizedImageUrl(firebaseUrl, {
        width: 400,
        height: 400,
        quality: 80,
      });

      expect(result).toContain("_400x400");
    });

    it("should handle missing dimensions", () => {
      const firebaseUrl =
        "https://firebasestorage.googleapis.com/v0/b/bucket/o/image.jpg";

      const result = storageService.getOptimizedImageUrl(firebaseUrl, {});

      expect(result).toBe(firebaseUrl);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty filename", async () => {
      const emptyNameFile = new File(["image"], "", { type: "image/jpeg" });

      const mockRef = { fullPath: "products/product123/image.jpg" };
      (ref as jest.Mock).mockReturnValue(mockRef);
      (uploadBytes as jest.Mock).mockResolvedValue({ ref: mockRef });
      (getDownloadURL as jest.Mock).mockResolvedValue("url");

      const result = await storageService.uploadProductImage(
        emptyNameFile,
        "product123"
      );

      expect(result.success).toBe(true);
      expect(result.storageRef).toMatch(/products\/product123\/\d+/);
    });

    it("should handle very long filename", async () => {
      const longName = "a".repeat(200) + ".jpg";
      const longNameFile = new File(["image"], longName, {
        type: "image/jpeg",
      });

      const mockRef = { fullPath: "products/product123/truncated.jpg" };
      (ref as jest.Mock).mockReturnValue(mockRef);
      (uploadBytes as jest.Mock).mockResolvedValue({ ref: mockRef });
      (getDownloadURL as jest.Mock).mockResolvedValue("url");

      const result = await storageService.uploadProductImage(
        longNameFile,
        "product123"
      );

      expect(result.success).toBe(true);
    });

    it("should handle concurrent uploads", async () => {
      const files = [
        new File(["1"], "1.jpg", { type: "image/jpeg" }),
        new File(["2"], "2.jpg", { type: "image/jpeg" }),
        new File(["3"], "3.jpg", { type: "image/jpeg" }),
      ];

      (ref as jest.Mock).mockReturnValue({ fullPath: "path" });
      (uploadBytes as jest.Mock).mockResolvedValue({ ref: {} });
      (getDownloadURL as jest.Mock).mockResolvedValue("url");

      const results = await Promise.all(
        files.map((file) =>
          storageService.uploadProductImage(file, "product123")
        )
      );

      results.forEach((result) => {
        expect(result.success).toBe(true);
      });
    });

    it("should handle special characters in product ID", async () => {
      const file = new File(["image"], "test.jpg", { type: "image/jpeg" });
      const specialId = "product-123_test@2025";

      const mockRef = { fullPath: `products/${specialId}/test.jpg` };
      (ref as jest.Mock).mockReturnValue(mockRef);
      (uploadBytes as jest.Mock).mockResolvedValue({ ref: mockRef });
      (getDownloadURL as jest.Mock).mockResolvedValue("url");

      const result = await storageService.uploadProductImage(file, specialId);

      expect(result.success).toBe(true);
      expect(result.storageRef).toContain(specialId);
    });
  });
});
