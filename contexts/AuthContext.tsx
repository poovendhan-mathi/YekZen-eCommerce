// Goal: Authentication context with Firebase Auth integration
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
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../firebase/config";
import toast from "react-hot-toast";

interface AuthResponse {
  success: boolean;
  user?: FirebaseUser;
  error?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signOut: logout,
    resetPassword,
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
