/**
 * Product Types
 * Type definitions for product-related data structures
 */

import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  brand: string;
  image: string;
  images: ProductImage[]; // Changed from optional to required array
  inStock: boolean;
  stock: number;
  stockCount?: number;
  rating: number; // Calculated from reviews (read-only)
  reviews: number; // Count of reviews (read-only)
  reviewCount?: number; // Total review count
  ratingDistribution?: RatingDistribution; // Distribution of ratings
  featured: boolean;
  tags: string[];
  features?: string[];
  specifications?: ProductSpecification[];
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface ProductImage {
  url: string;
  alt?: string;
  order: number;
  type: "url" | "uploaded";
  storageRef?: string; // Firebase Storage reference if uploaded
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export type Category =
  | "Electronics"
  | "Clothing"
  | "Books"
  | "Home"
  | "Sports"
  | "Accessories"
  | "All";

export interface ProductSpecification {
  label: string;
  value: string;
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export interface ProductFilter {
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  tags?: string[];
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[]; // Review images
  helpful: number;
  verified: boolean; // Verified purchase
  orderId?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface ProductReviewInput {
  productId: string;
  rating: number;
  title: string;
  comment: string;
  orderId?: string;
}
