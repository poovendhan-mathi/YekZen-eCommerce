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
  images?: string[];
  inStock: boolean;
  stock: number;
  stockCount?: number;
  rating: number;
  reviews: number;
  featured: boolean;
  tags: string[];
  features?: string[];
  specifications?: ProductSpecification[];
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
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
  userAvatar?: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: Date | Timestamp;
}

export interface ProductReviewInput {
  productId: string;
  rating: number;
  comment: string;
}
