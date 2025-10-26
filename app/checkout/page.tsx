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
import { useAuth } from "../../contexts/AuthContext";

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
  const { user } = useAuth();
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
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setCustomerInfo((prev) => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
        // Phone can be pre-filled if stored in user profile
        phone: (user as any).phoneNumber || prev.phone,
      }));
    }
  }, [user]);

  // Get cart data from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("yekzen-cart");
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        // Map cart items to checkout format
        const mappedItems: CartItem[] = cartData.map((item: any) => ({
          id: String(item.id),
          name: item.name,
          description: item.description || "",
          price: item.price,
          quantity: item.quantity,
          image:
            item.image ||
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
        }));
        setCartItems(mappedItems);
      } catch (error) {
        console.error("Error loading cart:", error);
        setCartItems([]);
      }
    }
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
    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Validate form
  useEffect(() => {
    const errors: Record<string, string> = {};

    // Required field validation
    if (!customerInfo.name.trim()) {
      errors.name = "Name is required";
    }

    if (!customerInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation - relaxed for international numbers with country codes
    if (!customerInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    } else {
      const phoneDigits = customerInfo.phone.replace(/[^0-9]/g, "");
      if (phoneDigits.length < 7) {
        errors.phone = "Please enter a valid phone number";
      }
    }

    if (!customerInfo.address.trim()) {
      errors.address = "Address is required";
    }

    if (!customerInfo.city.trim()) {
      errors.city = "City is required";
    }

    if (!customerInfo.postalCode.trim()) {
      errors.postalCode = "Postal code is required";
    }

    if (!customerInfo.country.trim()) {
      errors.country = "Country is required";
    }

    setValidationErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
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
                <div>
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    required
                    className={
                      touchedFields.name && validationErrors.name
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {touchedFields.name && validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                    className={
                      touchedFields.email && validationErrors.email
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {touchedFields.email && validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Input
                    name="phone"
                    placeholder="Phone Number (e.g., +1234567890)"
                    value={customerInfo.phone}
                    onChange={(e) => {
                      // Only allow numbers, +, -, spaces, and parentheses
                      const value = e.target.value.replace(/[^0-9+\-() ]/g, "");
                      handleInputChange({
                        ...e,
                        target: { ...e.target, name: "phone", value },
                      });
                    }}
                    required
                    pattern="[\+]?[0-9\-() ]+"
                    minLength={10}
                    maxLength={15}
                    className={
                      touchedFields.phone && validationErrors.phone
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {touchedFields.phone && validationErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.phone}
                    </p>
                  )}
                </div>
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
                <div>
                  <Input
                    name="address"
                    placeholder="Street Address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    required
                    className={
                      touchedFields.address && validationErrors.address
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {touchedFields.address && validationErrors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.address}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      name="city"
                      placeholder="City"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      required
                      className={
                        touchedFields.city && validationErrors.city
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {touchedFields.city && validationErrors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      name="postalCode"
                      placeholder="Postal Code"
                      value={customerInfo.postalCode}
                      onChange={handleInputChange}
                      required
                      className={
                        touchedFields.postalCode && validationErrors.postalCode
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {touchedFields.postalCode &&
                      validationErrors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.postalCode}
                        </p>
                      )}
                  </div>
                </div>
                <div>
                  <select
                    name="country"
                    value={customerInfo.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      touchedFields.country && validationErrors.country
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="JP">Japan</option>
                    <option value="CN">China</option>
                    <option value="BR">Brazil</option>
                    <option value="MX">Mexico</option>
                    <option value="SG">Singapore</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="ZA">South Africa</option>
                    <option value="NZ">New Zealand</option>
                    <option value="SE">Sweden</option>
                    <option value="NO">Norway</option>
                    <option value="DK">Denmark</option>
                    <option value="FI">Finland</option>
                    <option value="NL">Netherlands</option>
                    <option value="BE">Belgium</option>
                    <option value="CH">Switzerland</option>
                    <option value="AT">Austria</option>
                    <option value="PL">Poland</option>
                    <option value="CZ">Czech Republic</option>
                    <option value="PT">Portugal</option>
                    <option value="GR">Greece</option>
                    <option value="IE">Ireland</option>
                    <option value="KR">South Korea</option>
                    <option value="TH">Thailand</option>
                    <option value="MY">Malaysia</option>
                    <option value="PH">Philippines</option>
                    <option value="VN">Vietnam</option>
                    <option value="ID">Indonesia</option>
                    <option value="PK">Pakistan</option>
                    <option value="BD">Bangladesh</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="EG">Egypt</option>
                    <option value="NG">Nigeria</option>
                    <option value="KE">Kenya</option>
                    <option value="AR">Argentina</option>
                    <option value="CL">Chile</option>
                    <option value="CO">Colombia</option>
                    <option value="PE">Peru</option>
                    <option value="TR">Turkey</option>
                    <option value="IL">Israel</option>
                    <option value="QA">Qatar</option>
                    <option value="RU">Russia</option>
                    <option value="UA">Ukraine</option>
                    <option value="RO">Romania</option>
                    <option value="BG">Bulgaria</option>
                    <option value="HR">Croatia</option>
                  </select>
                  {touchedFields.country && validationErrors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.country}
                    </p>
                  )}
                </div>
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
                      customerName={customerInfo.name}
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

                {!isFormValid &&
                  Object.keys(touchedFields).length > 0 &&
                  Object.keys(validationErrors).length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 font-semibold mb-1">
                        Please complete all required fields:
                      </p>
                      <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                        {Object.entries(validationErrors)
                          .filter(([field]) => touchedFields[field])
                          .map(([field, error]) => (
                            <li key={field}>{error}</li>
                          ))}
                      </ul>
                    </div>
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
