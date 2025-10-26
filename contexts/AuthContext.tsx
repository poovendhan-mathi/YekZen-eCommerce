// Goal: Authentication context with Firebase Auth integration
// Enhanced with session management, token refresh, and user profiles
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  onIdTokenChanged,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { userService } from "../services/user.service";
import toast from "react-hot-toast";

interface AuthResponse {
  success: boolean;
  user?: FirebaseUser;
  error?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  sessionExpired: boolean;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<AuthResponse>;
  signInWithFacebook: () => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      // Create/update user profile in Firestore when user signs in
      if (user) {
        await userService.createOrUpdateUserProfile(
          user.uid,
          user.email!,
          user.displayName || undefined,
          user.photoURL || undefined
        );
      }
    });

    return unsubscribe;
  }, []);

  // Monitor ID token changes for automatic token refresh
  // Firebase Auth automatically refreshes tokens every hour
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          // Get fresh token (variable needed for side effects)
          await user.getIdToken(true);
          console.log("🔑 Token refreshed successfully");

          // Store token expiration time
          const tokenResult = await user.getIdTokenResult();
          const expirationTime = new Date(tokenResult.expirationTime).getTime();
          localStorage.setItem("tokenExpiration", expirationTime.toString());

          setSessionExpired(false);
        } catch (error) {
          console.error("❌ Token refresh failed:", error);
          setSessionExpired(true);
          toast.error("Session expired. Please sign in again.");
        }
      }
    });

    return unsubscribe;
  }, []);

  // Auto-refresh token before expiration (proactive refresh)
  useEffect(() => {
    if (!user) return;

    const checkTokenExpiration = setInterval(async () => {
      const tokenExpiration = localStorage.getItem("tokenExpiration");
      if (tokenExpiration) {
        const expirationTime = parseInt(tokenExpiration);
        const now = Date.now();
        const timeUntilExpiration = expirationTime - now;

        // Refresh token 5 minutes before expiration
        if (timeUntilExpiration < 5 * 60 * 1000 && timeUntilExpiration > 0) {
          console.log("🔄 Proactively refreshing token...");
          await refreshToken();
        }

        // Token already expired
        if (timeUntilExpiration <= 0) {
          setSessionExpired(true);
          toast.error("Session expired. Please sign in again.");
          await signOut(auth);
        }
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(checkTokenExpiration);
  }, [user]);

  // Manual token refresh function
  const refreshToken = async (): Promise<void> => {
    if (!user) return;

    try {
      await user.getIdToken(true); // Force refresh
      const tokenResult = await user.getIdTokenResult();
      const expirationTime = new Date(tokenResult.expirationTime).getTime();
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      console.log("✅ Token manually refreshed");
    } catch (error) {
      console.error("❌ Manual token refresh failed:", error);
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Create user profile in Firestore
      await userService.createOrUpdateUserProfile(
        user.uid,
        user.email!,
        displayName,
        undefined
      );

      toast.success("Account created successfully!");
      return { success: true, user };
    } catch (error) {
      console.error("Sign up error:", error);
      const message = error instanceof Error ? error.message : "Sign up failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // Update user profile with last login
      await userService.createOrUpdateUserProfile(
        user.uid,
        user.email!,
        user.displayName || undefined,
        user.photoURL || undefined
      );

      toast.success("Welcome back!");
      return { success: true, user };
    } catch (error) {
      console.error("Sign in error:", error);
      const message = error instanceof Error ? error.message : "Sign in failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      // Create/update user profile
      await userService.createOrUpdateUserProfile(
        user.uid,
        user.email!,
        user.displayName || undefined,
        user.photoURL || undefined
      );

      toast.success("Signed in with Google");
      return { success: true, user };
    } catch (error) {
      console.error("Google sign-in error:", error);
      const message =
        error instanceof Error ? error.message : "Google sign-in failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Facebook
  const signInWithFacebook = async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      // Create/update user profile
      await userService.createOrUpdateUserProfile(
        user.uid,
        user.email!,
        user.displayName || undefined,
        user.photoURL || undefined
      );

      toast.success("Signed in with Facebook");
      return { success: true, user };
    } catch (error) {
      console.error("Facebook sign-in error:", error);
      const message =
        error instanceof Error ? error.message : "Facebook sign-in failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async (): Promise<AuthResponse> => {
    try {
      await signOut(auth);

      // Clear token expiration from localStorage
      localStorage.removeItem("tokenExpiration");

      toast.success("Signed out successfully");
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      const message =
        error instanceof Error ? error.message : "Sign out failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      const message =
        error instanceof Error ? error.message : "Password reset failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    sessionExpired,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signOut: logout,
    resetPassword,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
