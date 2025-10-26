"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface DemoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
  customerInfo: {
    name: string;
    email: string;
  };
  currency?: "USD" | "INR";
  paymentType?: "card" | "upi";
}

// Dummy card details that will be accepted
const VALID_DEMO_CARDS = [
  {
    number: "4111111111111111",
    name: "Visa Test Card",
    cvv: "123",
    expiry: "12/25",
  },
  {
    number: "5555555555554444",
    name: "Mastercard Test Card",
    cvv: "456",
    expiry: "11/26",
  },
  {
    number: "378282246310005",
    name: "Amex Test Card",
    cvv: "1234",
    expiry: "10/27",
  },
];

export default function DemoPaymentModal({
  isOpen,
  onClose,
  amount,
  onSuccess,
  customerInfo,
  currency = "USD",
  paymentType = "card",
}: DemoPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(customerInfo.name || "");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">(
    paymentType
  );

  const currencySymbol = currency === "INR" ? "₹" : "$";

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCardNumber("");
      setCardName(customerInfo.name || "");
      setExpiryDate("");
      setCvv("");
      setError("");
      setIsSuccess(false);
      setShowHint(false);
    }
  }, [isOpen, customerInfo.name]);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(value);
      setError("");
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setExpiryDate(value);
      setError("");
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCvv(value);
      setError("");
    }
  };

  const validateCard = () => {
    // Check if the card matches any valid demo card
    const isValidCard = VALID_DEMO_CARDS.some(
      (card) =>
        card.number === cardNumber &&
        card.cvv === cvv &&
        card.expiry.replace("/", "") === expiryDate
    );

    return isValidCard;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setError("Please fill in all card details");
      return;
    }

    if (cardNumber.length < 15) {
      setError("Invalid card number");
      return;
    }

    if (expiryDate.length < 4) {
      setError("Invalid expiry date");
      return;
    }

    if (cvv.length < 3) {
      setError("Invalid CVV");
      return;
    }

    // Check if card is valid
    if (!validateCard()) {
      setError("Card declined. Use a test card or click 'Show Test Cards'");
      setShowHint(true);
      return;
    }

    // Simulate payment processing
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Wait a bit to show success, then call onSuccess
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2000);
  };

  const autoFillCard = (card: (typeof VALID_DEMO_CARDS)[0]) => {
    setCardNumber(card.number);
    setCvv(card.cvv);
    setExpiryDate(card.expiry.replace("/", ""));
    setError("");
    setShowHint(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Success State */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your demo payment has been processed
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ${amount.toFixed(2)}
                </p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCardIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Demo Payment
                  </h2>
                  <p className="text-gray-600 mt-1">Enter test card details</p>
                  <div className="mt-2 text-3xl font-bold text-purple-600">
                    {currencySymbol}
                    {amount.toFixed(2)}
                  </div>
                </div>

                {/* Payment Method Tabs (if UPI available) */}
                {currency === "INR" && (
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        paymentMethod === "card"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      💳 Card
                    </button>
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        paymentMethod === "upi"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      📱 UPI
                    </button>
                  </div>
                )}

                {/* Card Payment Form */}
                {paymentMethod === "card" ? (
                  <>
                    {/* Test Cards Hint */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="w-full text-left flex items-center justify-between text-sm font-medium text-blue-800"
                      >
                        <span>💳 Show Test Cards</span>
                        <span>{showHint ? "▼" : "▶"}</span>
                      </button>
                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 space-y-2"
                        >
                          {VALID_DEMO_CARDS.map((card, index) => (
                            <button
                              key={index}
                              onClick={() => autoFillCard(card)}
                              className="w-full text-left p-2 bg-white rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                            >
                              <div className="text-xs font-semibold text-gray-900">
                                {card.name}
                              </div>
                              <div className="text-xs text-gray-600 font-mono">
                                {formatCardNumber(card.number)}
                              </div>
                              <div className="text-xs text-gray-600">
                                CVV: {card.cvv} | Exp: {card.expiry}
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>

                    {/* Payment Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Card Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <Input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={formatCardNumber(cardNumber)}
                          onChange={handleCardNumberChange}
                          className="font-mono"
                          required
                        />
                      </div>

                      {/* Cardholder Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <Input
                          type="text"
                          placeholder="JOHN DOE"
                          value={cardName}
                          onChange={(e) =>
                            setCardName(e.target.value.toUpperCase())
                          }
                          required
                        />
                      </div>

                      {/* Expiry and CVV */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <Input
                            type="text"
                            placeholder="MM/YY"
                            value={formatExpiryDate(expiryDate)}
                            onChange={handleExpiryChange}
                            className="font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <Input
                            type="text"
                            placeholder="123"
                            value={cvv}
                            onChange={handleCvvChange}
                            className="font-mono"
                            required
                          />
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800"
                        >
                          {error}
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400"
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <LockClosedIcon className="w-5 h-5 mr-2" />
                            Pay {currencySymbol}
                            {amount.toFixed(2)}
                          </span>
                        )}
                      </Button>
                    </form>

                    {/* Security Note */}
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center text-green-800 text-sm">
                        <LockClosedIcon className="w-4 h-4 mr-2" />
                        <span className="font-medium">Development Mode</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        This is a demo payment. No real charges will be made.
                      </p>
                    </div>
                  </>
                ) : (
                  /* UPI Payment Option */
                  <div className="space-y-4">
                    {/* UPI QR Code Mockup */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
                      <div className="w-48 h-48 mx-auto bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-6xl">📱</div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Scan QR Code
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Use any UPI app to scan and pay
                      </p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">
                          UPI ID (Demo)
                        </p>
                        <p className="font-mono text-sm font-semibold text-gray-900">
                          yekzen@demobank
                        </p>
                      </div>
                    </div>

                    {/* Amount Display */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        Amount to Pay
                      </p>
                      <p className="text-3xl font-bold text-purple-600">
                        {currencySymbol}
                        {amount.toFixed(2)}
                      </p>
                    </div>

                    {/* Demo Complete Button */}
                    <Button
                      onClick={() => {
                        setIsProcessing(true);
                        setTimeout(() => {
                          setIsProcessing(false);
                          setIsSuccess(true);
                          setTimeout(() => {
                            onSuccess();
                          }, 1500);
                        }, 2000);
                      }}
                      disabled={isProcessing}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Verifying Payment...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <CheckCircleIcon className="w-5 h-5 mr-2" />
                          Complete Demo UPI Payment
                        </span>
                      )}
                    </Button>

                    {/* Demo Note */}
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center text-green-800 text-sm">
                        <LockClosedIcon className="w-4 h-4 mr-2" />
                        <span className="font-medium">Development Mode</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        This is a demo UPI payment. Click the button to simulate
                        successful payment.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
