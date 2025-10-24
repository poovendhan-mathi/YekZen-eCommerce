// Goal: Stripe checkout button component with loading states and error handling
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
}

interface StripeCheckoutButtonProps {
  items: CartItem[];
  customerEmail?: string;
  amount?: number;
  disabled?: boolean;
  className?: string;
}

const StripeCheckoutButton: React.FC<StripeCheckoutButtonProps> = ({
  items,
  customerEmail,
  amount,
  disabled = false,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStripeCheckout = async () => {
    if (!items || items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      // Create checkout session
      const response = await fetch("/api/payments/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            description: item.description || "",
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          customerEmail,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast.error(
        (error as Error).message || "Payment failed. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Button
        onClick={handleStripeCheckout}
        disabled={disabled || isLoading || !items?.length}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCardIcon className="w-6 h-6" />
            <span>Pay with Stripe</span>
            {amount && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                ${amount.toFixed(2)}
              </span>
            )}
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default StripeCheckoutButton;
