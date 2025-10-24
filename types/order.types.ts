/**
 * Order Types
 * Type definitions for order-related data structures
 */

import { Timestamp } from "firebase/firestore";
import { CartItem } from "./cart.types";
import { Address } from "./user.types";

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  statusHistory: OrderStatusHistory[];
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export enum OrderStatus {
  Pending = "pending",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
  Refunded = "refunded",
}

export enum PaymentStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
  Refunded = "refunded",
}

export enum PaymentMethod {
  Stripe = "stripe",
  Razorpay = "razorpay",
  COD = "cod",
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date | Timestamp;
  note?: string;
}

export interface OrderInput {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  billingAddress: Address;
}

export interface OrderFilter {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
