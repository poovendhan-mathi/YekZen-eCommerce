import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  onIdTokenChanged,
} from "firebase/auth";
import toast from "react-hot-toast";

// Mock Firebase Auth
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  onIdTokenChanged: jest.fn(),
  updateProfile: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  FacebookAuthProvider: jest.fn(),
}));

jest.mock("../firebase/config", () => ({
  auth: {},
}));

jest.mock("react-hot-toast");

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn();
    });
    onIdTokenChanged.mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn();
    });
  });

  describe("useAuth Hook", () => {
    it("should provide auth context", () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toHaveProperty("user");
      expect(result.current).toHaveProperty("loading");
      expect(result.current).toHaveProperty("signIn");
      expect(result.current).toHaveProperty("signUp");
      expect(result.current).toHaveProperty("signOut");
    });

    it("should throw error when used outside provider", () => {
      // Suppress console.error for this test
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within an AuthProvider");

      consoleError.mockRestore();
    });
  });

  describe("Sign In", () => {
    it("should sign in successfully", async () => {
      const mockUser = { email: "test@example.com", uid: "123" };
      signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signIn(
          "test@example.com",
          "password123"
        );
      });

      expect(signInResult.success).toBe(true);
      expect(signInResult.user).toEqual(mockUser);
      expect(toast.success).toHaveBeenCalledWith("Welcome back!");
    });

    it("should handle sign in error", async () => {
      const mockError = new Error("Invalid credentials");
      signInWithEmailAndPassword.mockRejectedValue(mockError);

      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signIn(
          "test@example.com",
          "wrongpassword"
        );
      });

      expect(signInResult.success).toBe(false);
      expect(signInResult.error).toBe("Invalid credentials");
      // Note: toast.error is no longer called for sign-in errors (handled by page components)
    });
  });

  describe("Sign Up", () => {
    it("should sign up successfully", async () => {
      const mockUser = { email: "test@example.com", uid: "123" };
      createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });

      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp(
          "test@example.com",
          "password123",
          "Test User"
        );
      });

      expect(signUpResult.success).toBe(true);
      expect(toast.success).toHaveBeenCalledWith(
        "Account created successfully!"
      );
    });

    it("should handle sign up error", async () => {
      const mockError = new Error("Email already in use");
      createUserWithEmailAndPassword.mockRejectedValue(mockError);

      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp(
          "test@example.com",
          "password123"
        );
      });

      expect(signUpResult.success).toBe(false);
      expect(signUpResult.error).toBe("Email already in use");
      // Toast.error is no longer called - errors are shown inline
    });
  });

  describe("Sign Out", () => {
    it("should sign out successfully", async () => {
      signOut.mockResolvedValue();

      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      let signOutResult;
      await act(async () => {
        signOutResult = await result.current.signOut();
      });

      expect(signOutResult.success).toBe(true);
      expect(toast.success).toHaveBeenCalledWith("Signed out successfully");
    });
  });

  describe("Auth State", () => {
    it("should update user state on auth change", async () => {
      const mockUser = { email: "test@example.com", uid: "123" };

      onAuthStateChanged.mockImplementation((auth, callback) => {
        setTimeout(() => callback(mockUser), 0);
        return jest.fn();
      });

      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.loading).toBe(false);
      });
    });
  });
});
