/**
 * Session Management Hook
 *
 * Implements secure session timeout for all users:
 * - 15-minute inactivity timeout
 * - 2-minute warning before expiry
 * - Activity tracking (mouse, keyboard, scroll)
 * - Auto-logout for authenticated users
 * - Modal prompt for guest users (keep cart or clear)
 */

import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import toast from "react-hot-toast";

// Session configuration (in milliseconds)
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_TIME = 2 * 60 * 1000; // 2 minutes before timeout
const CHECK_INTERVAL = 30 * 1000; // Check every 30 seconds

interface SessionConfig {
  enabled?: boolean;
  onWarning?: () => void;
  onTimeout?: () => void;
  onGuestTimeout?: () => void;
}

export const useSessionTimeout = (config: SessionConfig = {}) => {
  const { user } = useAuth();
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
  }, []);

  // Handle session timeout
  const handleTimeout = useCallback(async () => {
    console.log("🔒 Session expired due to inactivity");

    if (user) {
      // Authenticated user: Auto-logout
      localStorage.removeItem("tokenExpiration");
      sessionStorage.clear();

      try {
        await signOut(auth);
        toast.error("Session expired due to inactivity. Please sign in again.");

        if (config.onTimeout) {
          config.onTimeout();
        }
      } catch (error) {
        console.error("Error signing out:", error);
      }
    } else {
      // Guest user: Trigger modal
      if (config.onGuestTimeout) {
        config.onGuestTimeout();
      }
    }
  }, [user, config]);

  // Show warning before timeout
  const showWarning = useCallback(() => {
    if (!warningShownRef.current) {
      warningShownRef.current = true;
      toast.error("Your session will expire in 2 minutes due to inactivity.", {
        duration: 5000,
        icon: "⏰",
      });

      if (config.onWarning) {
        config.onWarning();
      }
    }
  }, [config]);

  // Check session status
  const checkSession = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // Session expired
    if (timeSinceLastActivity >= SESSION_TIMEOUT) {
      handleTimeout();
    }
    // Show warning
    else if (timeSinceLastActivity >= SESSION_TIMEOUT - WARNING_TIME) {
      showWarning();
    }
  }, [handleTimeout, showWarning]);

  // Track user activity
  useEffect(() => {
    // Track activity for both authenticated and guest users
    if (config.enabled === false) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];

    const handleActivity = () => {
      updateActivity();
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Start session check interval
    const intervalId = setInterval(checkSession, CHECK_INTERVAL);
    timeoutIdRef.current = intervalId;

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });

      if (timeoutIdRef.current) {
        clearInterval(timeoutIdRef.current);
      }
    };
  }, [config.enabled, updateActivity, checkSession]);

  // Initialize last activity on mount
  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Return session management functions
  return {
    updateActivity,
    getLastActivity: () => lastActivityRef.current,
    getRemainingTime: () => {
      const elapsed = Date.now() - lastActivityRef.current;
      return Math.max(0, SESSION_TIMEOUT - elapsed);
    },
  };
};
