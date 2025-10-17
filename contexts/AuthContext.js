// Goal: Authentication context with Firebase Auth integration
"use client";

import { createContext, useContext, useState, useEffect } from "react";
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
} from "firebase/auth";
import { auth } from "../firebase/config";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, displayName) => {
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
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      return { success: true, user };
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
      toast.success("Signed in with Google");
      const isAdmin = user?.email === "admin@yekzen.com";
      return { success: true, user, isAdmin };
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error(error.message || "Google sign-in failed");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
      toast.success("Signed in with Facebook");
      const isAdmin = user?.email === "admin@yekzen.com";
      return { success: true, user, isAdmin };
    } catch (error) {
      console.error("Facebook sign-in error:", error);
      toast.error(error.message || "Facebook sign-in failed");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(error.message);
      return { success: false, error: error.message };
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
