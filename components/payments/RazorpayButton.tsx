// Goal: Razorpay UPI button component with Indian payment methods
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import DemoPaymentModal from "./DemoPaymentModal";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

interface RazorpayButtonProps {
  items: CartItem[];
  customerInfo: CustomerInfo;
  amount: number;
  disabled?: boolean;
  className?: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  items,
  customerInfo,
  amount,
  disabled = false,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = (): Promise<boolean> => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setIsRazorpayLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          setIsRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error("Failed to load Razorpay script");
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const handleRazorpayPayment = async () => {
    if (!items || items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      // Check if we're in development mode without Razorpay keys
      const isDevelopmentMode =
        process.env.NODE_ENV === "development" &&
        !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (isDevelopmentMode) {
        // Show demo payment modal with card/UPI form
        setIsLoading(false);
        setShowDemoModal(true);
        return;
      }

      if (!isRazorpayLoaded) {
        toast.error("Payment system not ready. Please try again.");
        setIsLoading(false);
        return;
      }

      // Create Razorpay order
      const response = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
          customerInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment order");
      }

      // Razorpay checkout options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "YekZen",
        description: `Payment for ${items.length} item(s)`,
        order_id: data.orderId,
        prefill: {
          name: customerInfo?.name || "",
          email: customerInfo?.email || "",
          contact: customerInfo?.phone || "",
        },
        theme: {
          color: "#6366f1",
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        handler: async function (response: RazorpayResponse) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/razorpay/order", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              toast.success("Payment successful!");
              // Redirect to success page
              window.location.href = `/payment/success?payment_id=${verifyData.paymentId}`;
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay payment error:", error);
      toast.error(
        (error as Error).message || "Payment failed. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleDemoPaymentSuccess = async () => {
    try {
      // Create order and update stock
      const { ordersService } = await import("../../services/orders.service");
      const orderResult = await ordersService.createOrder({
        items: items.map((item) => ({
          id: String(item.id),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customerInfo: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address || "",
          city: customerInfo.city || "",
          postalCode: customerInfo.postalCode || "",
          country: customerInfo.country || "",
        },
        paymentMethod: "Razorpay (Demo)",
        totalAmount: amount || 0,
        paymentId: `demo_razorpay_${Date.now()}`,
      });

      if (!orderResult.success) {
        toast.error(orderResult.error || "Failed to create order");
        return;
      }

      // Store guest email for order tracking (if not authenticated)
      if (
        customerInfo.email &&
        !window.location.pathname.includes("/profile")
      ) {
        localStorage.setItem("yekzen-guest-email", customerInfo.email);
      }

      toast.success("🎉 Demo Razorpay Payment Successful!");
      localStorage.removeItem("yekzen-cart");

      setTimeout(() => {
        window.location.href = `/payment/success?orderId=${orderResult.orderId}&method=razorpay`;
      }, 500);
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Failed to complete order");
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={className}
      >
        <Button
          onClick={handleRazorpayPayment}
          disabled={
            disabled || isLoading || !items?.length || !isRazorpayLoaded
          }
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <DevicePhoneMobileIcon className="w-6 h-6" />
              <span>Pay with UPI</span>
              {amount && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  ₹{amount.toFixed(2)}
                </span>
              )}
            </>
          )}
        </Button>

        {!isRazorpayLoaded && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Loading payment system...
          </p>
        )}
      </motion.div>

      <DemoPaymentModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        amount={amount || 0}
        onSuccess={handleDemoPaymentSuccess}
        customerInfo={{
          name: customerInfo.name,
          email: customerInfo.email,
        }}
        currency="INR"
        paymentType="upi"
      />
    </>
  );
};

export default RazorpayButton;
