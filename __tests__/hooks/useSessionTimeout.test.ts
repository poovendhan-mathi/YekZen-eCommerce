/**
 * Session Timeout Hook Tests
 *
 * Tests the useSessionTimeout hook functionality:
 * - Session timeout after inactivity
 * - Warning notifications
 * - Activity tracking
 * - Auto-logout
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useSessionTimeout } from "../../lib/hooks/useSessionTimeout";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { signOut } from "firebase/auth";

// Mock dependencies
vi.mock("../../contexts/AuthContext");
vi.mock("firebase/auth");
vi.mock("react-hot-toast");
vi.mock("../../firebase/config", () => ({
  auth: {},
}));

describe("useSessionTimeout", () => {
  const mockUser = { uid: "test-user", email: "test@example.com" };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Initialization", () => {
    it("should not track activity for guest users", () => {
      (useAuth as any).mockReturnValue({ user: null });

      const { result } = renderHook(() => useSessionTimeout());

      expect(result.current.getRemainingTime()).toBeNull();
    });

    it("should initialize with current timestamp for authenticated users", () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      const { result } = renderHook(() => useSessionTimeout());
      const lastActivity = result.current.getLastActivity();

      expect(lastActivity).toBeGreaterThan(0);
      expect(Date.now() - lastActivity).toBeLessThan(100); // Within 100ms
    });
  });

  describe("Activity Tracking", () => {
    it("should update last activity on user interaction", () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      const { result } = renderHook(() => useSessionTimeout());

      const initialActivity = result.current.getLastActivity();

      // Fast forward time
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Simulate user interaction
      act(() => {
        const event = new MouseEvent("mousedown");
        window.dispatchEvent(event);
      });

      const updatedActivity = result.current.getLastActivity();
      expect(updatedActivity).toBeGreaterThan(initialActivity);
    });

    it("should track multiple event types", () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      const { result } = renderHook(() => useSessionTimeout());

      const eventTypes = [
        "mousedown",
        "keydown",
        "scroll",
        "touchstart",
        "click",
      ];

      eventTypes.forEach((eventType) => {
        act(() => {
          vi.advanceTimersByTime(1000);
          const event = new Event(eventType);
          window.dispatchEvent(event);
        });

        expect(result.current.getLastActivity()).toBeGreaterThan(0);
      });
    });
  });

  describe("Session Warning", () => {
    it("should show warning 2 minutes before timeout", async () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      const onWarning = vi.fn();
      renderHook(() => useSessionTimeout({ onWarning }));

      // Fast forward to 13 minutes (15 min timeout - 2 min warning)
      act(() => {
        vi.advanceTimersByTime(13 * 60 * 1000);
      });

      // Trigger session check (runs every 30 seconds)
      act(() => {
        vi.advanceTimersByTime(30 * 1000);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringContaining("session will expire in 2 minutes"),
          expect.any(Object)
        );
        expect(onWarning).toHaveBeenCalled();
      });
    });

    it("should only show warning once", async () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      renderHook(() => useSessionTimeout());

      // Fast forward to warning time
      act(() => {
        vi.advanceTimersByTime(13 * 60 * 1000);
      });

      // Trigger multiple checks
      act(() => {
        vi.advanceTimersByTime(30 * 1000);
      });
      act(() => {
        vi.advanceTimersByTime(30 * 1000);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Session Timeout", () => {
    it("should logout user after 15 minutes of inactivity", async () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      const onTimeout = vi.fn();
      renderHook(() => useSessionTimeout({ onTimeout }));

      // Fast forward past timeout (15 minutes + 30 seconds for check)
      act(() => {
        vi.advanceTimersByTime(15 * 60 * 1000 + 30 * 1000);
      });

      await waitFor(() => {
        expect(signOut).toHaveBeenCalled();
        expect(onTimeout).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringContaining("Session expired"),
          expect.any(Object)
        );
      });
    });

    it("should clear session data on timeout", async () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      localStorage.setItem("tokenExpiration", "12345");
      sessionStorage.setItem("test", "data");

      renderHook(() => useSessionTimeout());

      // Fast forward past timeout
      act(() => {
        vi.advanceTimersByTime(15 * 60 * 1000 + 30 * 1000);
      });

      await waitFor(() => {
        expect(localStorage.getItem("tokenExpiration")).toBeNull();
        expect(sessionStorage.length).toBe(0);
      });
    });
  });

  describe("Remaining Time", () => {
    it("should return correct remaining time", () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      const { result } = renderHook(() => useSessionTimeout());

      const remainingTime = result.current.getRemainingTime();

      // Should be close to 15 minutes (with small margin for execution time)
      expect(remainingTime).toBeGreaterThan(14.9 * 60 * 1000);
      expect(remainingTime).toBeLessThanOrEqual(15 * 60 * 1000);
    });

    it("should decrease remaining time as time passes", () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      const { result } = renderHook(() => useSessionTimeout());

      const initialRemaining = result.current.getRemainingTime();

      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000); // 5 minutes
      });

      const updatedRemaining = result.current.getRemainingTime();

      expect(updatedRemaining).toBeLessThan(initialRemaining!);
      expect(initialRemaining! - updatedRemaining!).toBeGreaterThan(
        4.9 * 60 * 1000
      );
    });

    it("should reset remaining time after user activity", () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      const { result } = renderHook(() => useSessionTimeout());

      // Let time pass
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
      });

      const remainingBefore = result.current.getRemainingTime();

      // User interacts
      act(() => {
        const event = new MouseEvent("click");
        window.dispatchEvent(event);
      });

      const remainingAfter = result.current.getRemainingTime();

      expect(remainingAfter).toBeGreaterThan(remainingBefore!);
    });
  });

  describe("Configuration", () => {
    it("should not track session when disabled", () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      const { result } = renderHook(() =>
        useSessionTimeout({ enabled: false })
      );

      // Fast forward past timeout
      act(() => {
        vi.advanceTimersByTime(20 * 60 * 1000);
      });

      // Should not have logged out
      expect(signOut).not.toHaveBeenCalled();
    });
  });

  describe("Cleanup", () => {
    it("should remove event listeners on unmount", () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useSessionTimeout());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "touchstart",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "click",
        expect.any(Function)
      );
    });

    it("should clear interval on unmount", () => {
      (useAuth as any).mockReturnValue({ user: mockUser });

      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      const { unmount } = renderHook(() => useSessionTimeout());

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});
