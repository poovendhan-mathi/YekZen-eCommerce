/**
 * User Types
 * Type definitions for user-related data structures
 */

import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  phoneNumber?: string | null;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export enum UserRole {
  Admin = "admin",
  Customer = "customer",
  Guest = "guest",
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserPreferences {
  newsletter: boolean;
  notifications: boolean;
  theme: "light" | "dark" | "auto";
  currency: string;
  language: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface PasswordResetRequest {
  email: string;
}
