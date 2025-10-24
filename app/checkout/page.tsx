// Goal: Complete checkout page with Stripe and Razorpay payment integration
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCardIcon,
  LockClosedIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import StripeCheckoutButton from "../../components/payments/StripeCheckoutButton";
import RazorpayButton from "../../components/payments/RazorpayButton";
import Link from "next/link";

// Type definitions
interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "US",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");
  const [isFormValid, setIsFormValid] = useState(false);

  // Mock cart data - in real app, get from context/localStorage
  useEffect(() => {
    const mockCartItems: CartItem[] = [
      {
        id: "1",
        name: "Wireless Headphones",
        description: "Premium noise-cancelling headphones",
        price: 129.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
      },
      {
        id: "2",
        name: "Phone Case",
        description: "Protective case for smartphones",
        price: 29.99,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1601593346740-925612772716?w=300",
      },
    ];
    setCartItems(mockCartItems);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Convert USD to INR for Razorpay (approximate rate)
  const totalINR = total * 83; // 1 USD ≈ 83 INR

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  useEffect(() => {
    const requiredFields: (keyof CustomerInfo)[] = [
      "name",
      "email",
      "address",
      "city",
      "postalCode",
    ];
    const isValid = requiredFields.every((field) =>
      customerInfo[field]?.trim()
    );
    setIsFormValid(isValid);
  }, [customerInfo]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before checking out.
          </p>
          <Link href="/products">
            <Button className="w-full">Browse Products</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <UserIcon className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                />
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <TruckIcon className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>

              <div className="space-y-4">
                <Input
                  name="address"
                  placeholder="Street Address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="city"
                    placeholder="City"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="postalCode"
                    placeholder="Postal Code"
                    value={customerInfo.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <select
                  name="country"
                  value={customerInfo.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="US">United States</option>
                  <option value="IN">India</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <CreditCardIcon className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setSelectedPaymentMethod("stripe")}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === "stripe"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <CreditCardIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-medium">Credit/Debit Card</h3>
                      <p className="text-sm text-gray-600">
                        Visa, Mastercard, Amex
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedPaymentMethod("razorpay")}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === "razorpay"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 bg-green-600 rounded text-white flex items-center justify-center text-sm font-bold">
                        UPI
                      </div>
                      <h3 className="font-medium">UPI & Indian Methods</h3>
                      <p className="text-sm text-gray-600">
                        UPI, NetBanking, Wallets
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="pt-4">
                  {selectedPaymentMethod === "stripe" ? (
                    <StripeCheckoutButton
                      items={cartItems}
                      customerEmail={customerInfo.email}
                      amount={total}
                      disabled={!isFormValid}
                    />
                  ) : (
                    <RazorpayButton
                      items={cartItems}
                      customerInfo={customerInfo}
                      amount={totalINR}
                      disabled={!isFormValid}
                    />
                  )}
                </div>

                {!isFormValid && (
                  <p className="text-sm text-red-600 text-center">
                    Please fill in all required fields to proceed with payment
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 h-fit"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>
                  {selectedPaymentMethod === "stripe"
                    ? `$${total.toFixed(2)}`
                    : `₹${totalINR.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center text-green-800">
                <LockClosedIcon className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Secure Checkout</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Your payment information is encrypted and secure
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
