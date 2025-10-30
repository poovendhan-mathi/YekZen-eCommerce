"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  getUserCurrency,
  setUserCurrency,
  convertCurrency,
  formatCurrency,
  CURRENCIES,
} from "../lib/utils/currency";

/**
 * CurrencyContext - Global currency state management
 *
 * Provides real-time currency conversion across the entire application.
 * Similar to Amazon's approach: all prices stored in USD (base currency),
 * converted on-the-fly based on user's selected currency.
 *
 * Performance optimizations:
 * - Memoized conversion function
 * - Single source of truth (USD base prices)
 * - Efficient state updates with minimal re-renders
 */

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  convertPrice: (amount: number, fromCurrency?: string) => number;
  formatPrice: (amount: number, fromCurrency?: string) => string;
  getCurrencySymbol: () => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<string>("SGD"); // Default to SGD
  const [isLoading, setIsLoading] = useState(true);

  // Initialize currency from localStorage or default
  useEffect(() => {
    const storedCurrency = getUserCurrency();
    setCurrencyState(storedCurrency);
    setIsLoading(false);
  }, []);

  /**
   * Update currency and persist to localStorage
   * Memoized to prevent unnecessary re-renders
   */
  const setCurrency = useCallback((newCurrency: string) => {
    if (CURRENCIES[newCurrency]) {
      setCurrencyState(newCurrency);
      setUserCurrency(newCurrency);
    }
  }, []);

  /**
   * Convert price from base currency (USD) to selected currency
   * Memoized for performance
   *
   * @param amount - Price in base currency (USD by default)
   * @param fromCurrency - Source currency (default: USD)
   * @returns Converted price in selected currency
   */
  const convertPrice = useCallback(
    (amount: number, fromCurrency: string = "USD"): number => {
      if (!amount || amount === 0) return 0;
      return convertCurrency(amount, fromCurrency, currency);
    },
    [currency]
  );

  /**
   * Format price with currency symbol
   *
   * @param amount - Price in base currency (USD by default)
   * @param fromCurrency - Source currency (default: USD)
   * @returns Formatted price string with currency symbol
   */
  const formatPrice = useCallback(
    (amount: number, fromCurrency: string = "USD"): string => {
      const converted = convertPrice(amount, fromCurrency);
      return formatCurrency(converted, currency);
    },
    [currency, convertPrice]
  );

  /**
   * Get current currency symbol
   */
  const getCurrencySymbol = useCallback((): string => {
    return CURRENCIES[currency]?.symbol || "$";
  }, [currency]);

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    convertPrice,
    formatPrice,
    getCurrencySymbol,
    isLoading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

/**
 * Custom hook to use currency context
 * Throws error if used outside CurrencyProvider
 */
export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

/**
 * Hook for displaying prices
 * Automatically converts and formats based on current currency
 *
 * @example
 * const price = usePrice(99.99); // Returns "S$134.99" if SGD selected
 */
export function usePrice(amount: number, fromCurrency: string = "USD"): string {
  const { formatPrice } = useCurrency();
  return formatPrice(amount, fromCurrency);
}

/**
 * Hook for getting converted price as number
 * Useful for calculations
 *
 * @example
 * const converted = usePriceValue(99.99); // Returns 134.99 if SGD selected
 */
export function usePriceValue(
  amount: number,
  fromCurrency: string = "USD"
): number {
  const { convertPrice } = useCurrency();
  return convertPrice(amount, fromCurrency);
}
