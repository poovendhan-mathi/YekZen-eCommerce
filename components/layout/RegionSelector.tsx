"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { CURRENCIES } from "../../lib/utils/currency";
import { useCurrency } from "../../contexts/CurrencyContext";

interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: "SG", name: "Singapore", currency: "SGD", flag: "🇸🇬" },
  { code: "IN", name: "India", currency: "INR", flag: "🇮🇳" },
  { code: "US", name: "United States", currency: "USD", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", currency: "GBP", flag: "🇬🇧" },
  { code: "EU", name: "Europe", currency: "EUR", flag: "🇪🇺" },
  { code: "AU", name: "Australia", currency: "AUD", flag: "🇦🇺" },
  { code: "CA", name: "Canada", currency: "CAD", flag: "🇨🇦" },
  { code: "JP", name: "Japan", currency: "JPY", flag: "🇯🇵" },
];

/**
 * RegionSelector Component
 *
 * Allows users to select their country/region which determines:
 * - Display currency (real-time updates via CurrencyContext)
 * - Available payment methods
 * - Shipping options
 *
 * Performance: No page reload needed - uses React Context for instant updates
 */
export default function RegionSelector() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES[0]!
  ); // Default to Singapore
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currency, setCurrency } = useCurrency();

  // Initialize from currency context
  useEffect(() => {
    const country = COUNTRIES.find((c) => c.currency === currency);
    if (country) {
      setSelectedCountry(country);
    }
  }, [currency]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setCurrency(country.currency); // Update currency context - triggers re-render across app
    setShowDropdown(false);

    // Store country preference
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredCountry", country.code);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="region-selector-button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Select region and currency"
      >
        <GlobeAltIcon className="w-5 h-5 text-gray-600" />
        <span className="text-lg">{selectedCountry.flag}</span>
        <span className="text-sm font-medium text-gray-700 hidden md:block">
          {selectedCountry.currency}
        </span>
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
          >
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900">
                Select Region
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Choose your country to see prices in your local currency
              </p>
            </div>

            <div className="py-2 max-h-96 overflow-y-auto">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleSelectCountry(country)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                    selectedCountry.code === country.code ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {country.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {CURRENCIES[country.currency]?.symbol}{" "}
                        {country.currency}
                      </p>
                    </div>
                  </div>
                  {selectedCountry.code === country.code && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Get user's selected country code
 */
export function getUserCountry(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("preferredCountry");
    if (stored) return stored;
  }
  return "SG"; // Default to Singapore
}

/**
 * Check if user's country is India
 */
export function isIndianUser(): boolean {
  return getUserCountry() === "IN";
}
