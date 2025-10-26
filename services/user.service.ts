/**
 * User Service
 *
 * Manages user profiles in Firestore (separate from Firebase Auth)
 * Following best practices: Auth for authentication, Firestore for user data
 */

import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  preferredCurrency?: string;
  defaultShippingAddress?: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
  lastLogin: string | Timestamp;
}

export const userService = {
  /**
   * Create or update user profile in Firestore when they sign in/up
   * This is separate from Firebase Auth - Auth handles authentication,
   * Firestore stores user preferences and data
   */
  async createOrUpdateUserProfile(
    uid: string,
    email: string,
    displayName?: string,
    photoURL?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      const now = serverTimestamp();

      if (userSnap.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          displayName: displayName || userSnap.data().displayName,
          photoURL: photoURL || userSnap.data().photoURL,
          lastLogin: now,
          updatedAt: now,
        });
      } else {
        // Create new user profile
        await setDoc(userRef, {
          uid,
          email,
          displayName: displayName || "",
          photoURL: photoURL || "",
          phoneNumber: "",
          preferredCurrency: "USD", // Will be updated based on locale
          createdAt: now,
          updatedAt: now,
          lastLogin: now,
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error creating/updating user profile:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(uid: string): Promise<{
    success: boolean;
    profile?: UserProfile;
    error?: string;
  }> {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return {
          success: false,
          error: "User profile not found",
        };
      }

      const data = userSnap.data();
      const profile: UserProfile = {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        phoneNumber: data.phoneNumber,
        photoURL: data.photoURL,
        preferredCurrency: data.preferredCurrency,
        defaultShippingAddress: data.defaultShippingAddress,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt,
        lastLogin:
          data.lastLogin instanceof Timestamp
            ? data.lastLogin.toDate().toISOString()
            : data.lastLogin,
      };

      return {
        success: true,
        profile,
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Update user profile
   */
  async updateUserProfile(
    uid: string,
    updates: Partial<Omit<UserProfile, "uid" | "email" | "createdAt">>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Update user's preferred currency
   */
  async updatePreferredCurrency(
    uid: string,
    currency: string
  ): Promise<{ success: boolean; error?: string }> {
    return this.updateUserProfile(uid, { preferredCurrency: currency });
  },

  /**
   * Update user's default shipping address
   */
  async updateDefaultShippingAddress(
    uid: string,
    address: UserProfile["defaultShippingAddress"]
  ): Promise<{ success: boolean; error?: string }> {
    return this.updateUserProfile(uid, { defaultShippingAddress: address });
  },
};
