/**
 * Currency Utilities
 *
 * Locale-based currency formatting following best practices
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
}

// Supported currencies with their locales
export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", locale: "en-US" },
  SGD: { code: "SGD", symbol: "S$", locale: "en-SG" },
  INR: { code: "INR", symbol: "₹", locale: "en-IN" },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB" },
  JPY: { code: "JPY", symbol: "¥", locale: "ja-JP" },
  AUD: { code: "AUD", symbol: "A$", locale: "en-AU" },
  CAD: { code: "CAD", symbol: "C$", locale: "en-CA" },
};

/**
 * Detect user's currency based on locale/country
 */
export function detectUserCurrency(): string {
  if (typeof window === "undefined") return "USD";

  try {
    const locale = navigator.language || "en-US";

    // Map common locales to currencies
    const localeToCurrency: Record<string, string> = {
      "en-US": "USD",
      "en-SG": "SGD",
      "en-IN": "INR",
      "en-GB": "GBP",
      "de-DE": "EUR",
      "fr-FR": "EUR",
      "es-ES": "EUR",
      "it-IT": "EUR",
      "ja-JP": "JPY",
      "en-AU": "AUD",
      "en-CA": "CAD",
    };

    // Try exact match
    if (localeToCurrency[locale]) {
      return localeToCurrency[locale];
    }

    // Try language code match
    const languageCode = locale.split("-")[0];
    if (languageCode) {
      const match = Object.keys(localeToCurrency).find((key) =>
        key.startsWith(languageCode)
      );

      if (match && localeToCurrency[match]) {
        return localeToCurrency[match];
      }
    }

    // Default to USD
    return "USD";
  } catch (error) {
    console.error("Error detecting currency:", error);
    return "USD";
  }
}

/**
 * Format currency amount based on locale and currency code
 *
 * @param amount - The numeric amount to format
 * @param currencyCode - ISO currency code (USD, INR, EUR, etc.)
 * @param showSymbol - Whether to show currency symbol (default: true)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56, 'USD') // "$1,234.56"
 * formatCurrency(1234.56, 'INR') // "₹1,234.56"
 * formatCurrency(1234.56, 'EUR') // "1.234,56 €"
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = "USD",
  showSymbol: boolean = true
): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.USD;

  if (!config) {
    return showSymbol ? `$${amount.toFixed(2)}` : amount.toFixed(2);
  }

  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formatted;
  } catch (error) {
    console.error("Currency formatting error:", error);
    // Fallback to simple formatting
    return showSymbol
      ? `${config.symbol}${amount.toFixed(2)}`
      : amount.toFixed(2);
  }
}

/**
 * Get currency symbol for a given currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCIES[currencyCode]?.symbol || "$";
}

/**
 * Exchange rates relative to USD (base currency)
 * In production, these should be fetched from a real-time API like:
 * - https://exchangerate-api.com/
 * - https://openexchangerates.org/
 * - https://currencyapi.com/
 *
 * Updated: October 30, 2025 (from XE.com live rates)
 */
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0, // Base currency
  SGD: 1.34, // 1 USD = 1.34 SGD (Singapore Dollar)
  INR: 83.85, // 1 USD = 83.85 INR (Indian Rupee)
  EUR: 0.86, // 1 USD = 0.86 EUR (Euro)
  GBP: 0.76, // 1 USD = 0.76 GBP (British Pound)
  JPY: 154.14, // 1 USD = 154.14 JPY (Japanese Yen)
  AUD: 1.53, // 1 USD = 1.53 AUD (Australian Dollar)
  CAD: 1.4, // 1 USD = 1.40 CAD (Canadian Dollar)
};

/**
 * Convert amount between currencies using exchange rates
 *
 * @param amount - Amount in source currency
 * @param fromCurrency - Source currency code (e.g., 'USD')
 * @param toCurrency - Target currency code (e.g., 'INR')
 * @returns Converted amount in target currency
 *
 * @example
 * convertCurrency(100, 'USD', 'INR') // 8312.00 INR
 * convertCurrency(8312, 'INR', 'USD') // 100.00 USD
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  // If same currency, no conversion needed
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Get exchange rates
  const fromRate = EXCHANGE_RATES[fromCurrency];
  const toRate = EXCHANGE_RATES[toCurrency];

  // If rates not found, log error and return original amount
  if (!fromRate || !toRate) {
    console.error(
      `Exchange rate not found for ${fromCurrency} or ${toCurrency}`
    );
    return amount;
  }

  // Convert to USD first (base currency), then to target currency
  const amountInUSD = amount / fromRate;
  const convertedAmount = amountInUSD * toRate;

  // Round to 2 decimal places
  return Math.round(convertedAmount * 100) / 100;
}

/**
 * Store user's preferred currency in localStorage
 */
export function setUserCurrency(currencyCode: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("preferredCurrency", currencyCode);
  }
}

/**
 * Get user's preferred currency from localStorage or detect it
 */
export function getUserCurrency(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("preferredCurrency");
    if (stored && CURRENCIES[stored]) {
      return stored;
    }
  }
  // Default to SGD (Singapore) instead of detecting
  return "SGD";
}
