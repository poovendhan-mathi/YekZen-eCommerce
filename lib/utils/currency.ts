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
 * Convert amount between currencies (would need exchange rate API in production)
 * For now, returns the same amount - integrate with real exchange rate API
 */
export function convertCurrency(
  amount: number,
  _fromCurrency: string,
  _toCurrency: string
): number {
  // TODO: Integrate with real exchange rate API like https://exchangerate-api.com/
  console.warn("Currency conversion not implemented - using 1:1 rate");
  return amount;
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
  return detectUserCurrency();
}
