/**
 * Session Expiry Modal
 *
 * Shows when guest user's session expires after 15 minutes of inactivity.
 * Gives options to:
 * 1. Continue shopping (keep cart)
 * 2. Go home (clear cart and localStorage)
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExclamationTriangleIcon,
  ShoppingCartIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

interface SessionExpiryModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onGoHome: () => void;
}

export default function SessionExpiryModal({
  isOpen,
  onContinue,
  onGoHome,
}: SessionExpiryModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(60); // 60 seconds to decide

  useEffect(() => {
    if (!isOpen) {
      setCountdown(60);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Auto go home after countdown
          clearInterval(interval);
          handleGoHome();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleContinue = () => {
    onContinue();
  };

  const handleGoHome = () => {
    // Clear cart and all session data
    localStorage.removeItem("yekzen-cart");
    localStorage.removeItem("yekzen-cart-timestamp");
    sessionStorage.clear();

    onGoHome();
    router.push("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-10 h-10 text-orange-600" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Session Expired
              </h2>

              {/* Message */}
              <p className="text-gray-600 text-center mb-6">
                You've been inactive for 15 minutes. Would you like to continue
                shopping or return home?
              </p>

              {/* Countdown */}
              <div className="bg-gray-100 rounded-lg p-3 mb-6 text-center">
                <p className="text-sm text-gray-700">
                  Automatically redirecting to home in{" "}
                  <span className="font-bold text-orange-600">
                    {countdown}s
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Continue Shopping */}
                <Button
                  onClick={handleContinue}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Continue Shopping
                </Button>

                {/* Go Home & Clear Cart */}
                <button
                  onClick={handleGoHome}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <HomeIcon className="w-5 h-5" />
                  Go Home & Clear Cart
                </button>
              </div>

              {/* Info Text */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Choosing "Continue Shopping" will keep your cart items. "Go
                Home" will clear all cart data.
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
