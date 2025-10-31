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
import { isIndianUser } from "../../components/layout/RegionSelector";
import {
  CountryCode,
  validateEmail,
  validatePhone,
  validatePostalCode,
  validateName,
  validateAddress,
  validateCity,
  validateCountry,
  getAllCountries,
  getCountryInfo,
} from "../../lib/utils/validation";

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
  phoneCountryCode: string;
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
    phoneCountryCode: "US",
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
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  // Validate form
  useEffect(() => {
    const errors: Record<string, string> = {};
    const countryCode = customerInfo.country as CountryCode;

    // Only validate touched fields to avoid showing errors immediately
    if (touchedFields.name) {
      const nameError = validateName(customerInfo.name);
      if (nameError) errors.name = nameError;
    }

    if (touchedFields.email) {
      const emailError = validateEmail(customerInfo.email);
      if (emailError) errors.email = emailError;
    }

    if (touchedFields.phone) {
      // Combine country code and phone for validation
      const fullPhone = `${
        getCountryInfo(customerInfo.phoneCountryCode as CountryCode).phoneCode
      } ${customerInfo.phone}`;
      const phoneError = validatePhone(
        fullPhone,
        customerInfo.phoneCountryCode as CountryCode
      );
      if (phoneError) errors.phone = phoneError;
    }

    if (touchedFields.address) {
      const addressError = validateAddress(customerInfo.address);
      if (addressError) errors.address = addressError;
    }

    if (touchedFields.city) {
      const cityError = validateCity(customerInfo.city);
      if (cityError) errors.city = cityError;
    }

    if (touchedFields.postalCode) {
      const postalCodeError = validatePostalCode(
        customerInfo.postalCode,
        countryCode || "US"
      );
      if (postalCodeError) errors.postalCode = postalCodeError;
    }

    if (touchedFields.country) {
      const countryError = validateCountry(customerInfo.country);
      if (countryError) errors.country = countryError;
    }

    setValidationErrors(errors);

    // Form is valid if all fields are filled and no errors exist
    const allFieldsFilled =
      customerInfo.name.trim() !== "" &&
      customerInfo.email.trim() !== "" &&
      customerInfo.phone.trim() !== "" &&
      customerInfo.address.trim() !== "" &&
      customerInfo.city.trim() !== "" &&
      customerInfo.postalCode.trim() !== "" &&
      customerInfo.country.trim() !== "";

    setIsFormValid(allFieldsFilled && Object.keys(errors).length === 0);
  }, [customerInfo, touchedFields]);

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
                    onBlur={() => handleBlur("name")}
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
                    onBlur={() => handleBlur("email")}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <select
                      name="phoneCountryCode"
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      value={customerInfo.phoneCountryCode}
                      onChange={handleInputChange}
                    >
                      {getAllCountries().map(({ code, phoneCode }) => (
                        <option key={code} value={code}>
                          {phoneCode}
                        </option>
                      ))}
                    </select>

                    {/* Phone Number Input (without country code) */}
                    <Input
                      name="phone"
                      placeholder="1234567890"
                      value={customerInfo.phone}
                      onChange={(e) => {
                        // Only allow numbers, spaces, hyphens, parentheses
                        const value = e.target.value.replace(
                          /[^0-9\-() ]/g,
                          ""
                        );
                        handleInputChange({
                          ...e,
                          target: { ...e.target, name: "phone", value },
                        });
                      }}
                      onBlur={() => handleBlur("phone")}
                      required
                      className={`flex-1 ${
                        touchedFields.phone && validationErrors.phone
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {touchedFields.phone && validationErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.phone}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Phone number will be sent as:{" "}
                    {
                      getCountryInfo(
                        customerInfo.phoneCountryCode as CountryCode
                      ).phoneCode
                    }{" "}
                    {customerInfo.phone || "XXXXXXXXXX"}
                  </p>
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
                    onBlur={() => handleBlur("address")}
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
                      onBlur={() => handleBlur("city")}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <Input
                      name="postalCode"
                      placeholder={
                        customerInfo.country
                          ? getCountryInfo(customerInfo.country as CountryCode)
                              .postalCodePlaceholder
                          : "Postal Code"
                      }
                      value={customerInfo.postalCode}
                      onChange={(e) => {
                        let value = e.target.value;

                        // Apply country-specific formatting
                        if (customerInfo.country) {
                          const countryInfo = getCountryInfo(
                            customerInfo.country as CountryCode
                          );

                          // For numeric-only countries (India, Singapore, etc.), remove non-digits
                          if (countryInfo.postalCodeType === "numeric") {
                            value = value.replace(/[^0-9]/g, "");
                            // Limit to 6 digits for India and Singapore
                            if (
                              (customerInfo.country === "IN" ||
                                customerInfo.country === "SG") &&
                              value.length > 6
                            ) {
                              value = value.slice(0, 6);
                            }
                          } else {
                            // For alphanumeric (UK, Canada), allow letters, numbers, spaces, hyphens
                            value = value
                              .replace(/[^a-zA-Z0-9\s-]/g, "")
                              .toUpperCase();
                          }
                        }

                        handleInputChange({
                          ...e,
                          target: { ...e.target, name: "postalCode", value },
                        });
                      }}
                      onBlur={() => handleBlur("postalCode")}
                      required
                      disabled={!customerInfo.country}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={customerInfo.country}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("country")}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      touchedFields.country && validationErrors.country
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select Country</option>
                    {getAllCountries().map(({ code, name }) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
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

                  {/* UPI - Only show for Indian users */}
                  {isIndianUser() && (
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
                        <h3 className="font-medium">UPI</h3>
                        <p className="text-sm text-gray-600">
                          UPI, NetBanking, Wallets
                        </p>
                      </div>
                    </div>
                  )}
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
                      customerInfo={{
                        ...customerInfo,
                        phone: `${
                          getCountryInfo(
                            customerInfo.phoneCountryCode as CountryCode
                          ).phoneCode
                        } ${customerInfo.phone}`,
                      }}
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
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    {/* Quantity Badge on Image */}
                    {item.quantity > 1 && (
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {item.quantity}x
                      </span>
                    )}
                  </div>
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
              {/* Detailed Subtotal Breakdown */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between font-medium text-gray-700 mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-gray-600 pl-4"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
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
