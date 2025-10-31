/**
 * Storage Service
 * Handles file uploads to Firebase Storage
 */

import { storage } from "../firebase/config";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

export const storageService = {
  /**
   * Upload product image to Firebase Storage
   */
  async uploadProductImage(
    file: File,
    productId: string,
    imageIndex: number
  ): Promise<{
    success: boolean;
    url?: string;
    storageRef?: string;
    error?: string;
  }> {
    try {
      // Validate file
      if (!file.type.startsWith("image/")) {
        return { success: false, error: "File must be an image" };
      }

      // Max 5MB
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: "Image must be less than 5MB" };
      }

      // Allowed formats
      const allowedFormats = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedFormats.includes(file.type)) {
        return {
          success: false,
          error: "Only JPEG, PNG, WebP, and GIF images are allowed",
        };
      }

      // Create storage reference
      const timestamp = Date.now();
      const extension = file.name.split(".").pop() || "jpg";
      const storagePath = `products/${productId}/images/image-${imageIndex}-${timestamp}.${extension}`;
      const storageReference = ref(storage, storagePath);

      // Upload file
      await uploadBytes(storageReference, file);

      // Get download URL
      const url = await getDownloadURL(storageReference);

      return {
        success: true,
        url,
        storageRef: storagePath,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload image",
      };
    }
  },

  /**
   * Upload review image to Firebase Storage
   */
  async uploadReviewImage(
    file: File,
    reviewId: string,
    imageIndex: number
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validate file
      if (!file.type.startsWith("image/")) {
        return { success: false, error: "File must be an image" };
      }

      // Max 3MB for review images
      if (file.size > 3 * 1024 * 1024) {
        return { success: false, error: "Image must be less than 3MB" };
      }

      // Create storage reference
      const timestamp = Date.now();
      const extension = file.name.split(".").pop() || "jpg";
      const storagePath = `reviews/${reviewId}/image-${imageIndex}-${timestamp}.${extension}`;
      const storageReference = ref(storage, storagePath);

      // Upload file
      await uploadBytes(storageReference, file);

      // Get download URL
      const url = await getDownloadURL(storageReference);

      return { success: true, url };
    } catch (error) {
      console.error("Error uploading review image:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload image",
      };
    }
  },

  /**
   * Delete product image from Firebase Storage
   */
  async deleteProductImage(storagePath: string): Promise<boolean> {
    try {
      const imageRef = ref(storage, storagePath);
      await deleteObject(imageRef);
      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      return false;
    }
  },

  /**
   * Delete all images for a product
   */
  async deleteAllProductImages(productId: string): Promise<boolean> {
    try {
      const listRef = ref(storage, `products/${productId}/images`);
      const listResult = await listAll(listRef);

      const deletePromises = listResult.items.map((itemRef) =>
        deleteObject(itemRef)
      );
      await Promise.all(deletePromises);

      return true;
    } catch (error) {
      console.error("Error deleting all images:", error);
      return false;
    }
  },

  /**
   * Validate image URL
   */
  isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      // Check if URL has valid protocol
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        return false;
      }
      // Check if URL ends with image extension
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
        ".svg",
      ];
      const hasImageExtension = imageExtensions.some((ext) =>
        url.toLowerCase().includes(ext)
      );
      return (
        hasImageExtension ||
        url.includes("unsplash.com") ||
        url.includes("firebasestorage")
      );
    } catch {
      return false;
    }
  },

  /**
   * Get optimized image URL (for thumbnails)
   */
  getOptimizedImageUrl(url: string, width?: number, height?: number): string {
    // If it's an Unsplash URL, add size parameters
    if (url.includes("unsplash.com")) {
      const params = new URLSearchParams();
      if (width) params.set("w", width.toString());
      if (height) params.set("h", height.toString());
      params.set("fit", "crop");
      params.set("q", "80");

      return `${url.split("?")[0]}?${params.toString()}`;
    }

    // Return original URL for other sources
    return url;
  },
};
