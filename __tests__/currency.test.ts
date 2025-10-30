/**
 * Currency Utilities Test Suite
 *
 * Tests for currency formatting and conversion functions
 * Critical for ensuring correct financial calculations
 */

import {
  formatCurrency,
  convertCurrency,
  getCurrencySymbol,
  getUserCurrency,
  setUserCurrency,
  CURRENCIES,
  EXCHANGE_RATES,
} from "../lib/utils/currency";

describe("Currency Utilities", () => {
  describe("formatCurrency", () => {
    it("should format USD correctly", () => {
      expect(formatCurrency(1234.56, "USD")).toBe("$1,234.56");
    });

    it("should format INR correctly", () => {
      const formatted = formatCurrency(1234.56, "INR");
      expect(formatted).toContain("₹");
      expect(formatted).toContain("1,234.56");
    });

    it("should format EUR correctly", () => {
      const formatted = formatCurrency(1234.56, "EUR");
      expect(formatted).toContain("€");
    });

    it("should format SGD correctly", () => {
      const formatted = formatCurrency(1234.56, "SGD");
      // SGD uses 'S$' symbol but Intl.NumberFormat might format it differently
      expect(formatted).toMatch(/[S$]/);
      expect(formatted).toContain("1,234.56");
    });

    it("should handle zero amount", () => {
      expect(formatCurrency(0, "USD")).toContain("0.00");
    });

    it("should handle negative amounts", () => {
      const formatted = formatCurrency(-100, "USD");
      expect(formatted).toContain("-");
      expect(formatted).toContain("100");
    });

    it("should round to 2 decimal places", () => {
      expect(formatCurrency(123.456789, "USD")).toContain("123.46");
    });

    it("should fallback to USD for unknown currency", () => {
      const formatted = formatCurrency(100, "XXX" as any);
      expect(formatted).toContain("$");
    });
  });

  describe("convertCurrency", () => {
    it("should convert USD to INR correctly", () => {
      const usdAmount = 100;
      const converted = convertCurrency(usdAmount, "USD", "INR");

      // 100 USD should be approximately 8385 INR (at rate 83.85)
      expect(converted).toBeCloseTo(8385, 0);
    });

    it("should convert INR to USD correctly", () => {
      const inrAmount = 8385;
      const converted = convertCurrency(inrAmount, "INR", "USD");

      // 8385 INR should be approximately 100 USD
      expect(converted).toBeCloseTo(100, 0);
    });

    it("should convert USD to EUR correctly", () => {
      const usdAmount = 100;
      const converted = convertCurrency(usdAmount, "USD", "EUR");

      // 100 USD should be approximately 86 EUR (at rate 0.86)
      expect(converted).toBeCloseTo(86, 0);
    });

    it("should convert USD to SGD correctly", () => {
      const usdAmount = 100;
      const converted = convertCurrency(usdAmount, "USD", "SGD");

      // 100 USD should be approximately 134 SGD (at rate 1.34)
      expect(converted).toBeCloseTo(134, 0);
    });

    it("should convert SGD to USD correctly", () => {
      const sgdAmount = 134;
      const converted = convertCurrency(sgdAmount, "SGD", "USD");

      // 134 SGD should be approximately 100 USD
      expect(converted).toBeCloseTo(100, 0);
    });

    it("should return same amount for same currency", () => {
      expect(convertCurrency(100, "USD", "USD")).toBe(100);
      expect(convertCurrency(1000, "INR", "INR")).toBe(1000);
    });

    it("should handle zero amount", () => {
      expect(convertCurrency(0, "USD", "INR")).toBe(0);
    });

    it("should round to 2 decimal places", () => {
      const converted = convertCurrency(1, "USD", "INR");
      const decimals = converted.toString().split(".")[1];

      // Should have at most 2 decimal places
      expect(decimals?.length || 0).toBeLessThanOrEqual(2);
    });

    it("should handle conversion chain correctly (USD -> INR -> USD)", () => {
      const original = 100;
      const toInr = convertCurrency(original, "USD", "INR");
      const backToUsd = convertCurrency(toInr, "INR", "USD");

      // Should be approximately equal (accounting for rounding)
      expect(backToUsd).toBeCloseTo(original, 0);
    });

    it("should return original amount for unknown currencies", () => {
      const amount = 100;
      const converted = convertCurrency(amount, "XXX" as any, "YYY" as any);

      expect(converted).toBe(amount);
    });
  });

  describe("getCurrencySymbol", () => {
    it("should return correct symbol for USD", () => {
      expect(getCurrencySymbol("USD")).toBe("$");
    });

    it("should return correct symbol for INR", () => {
      expect(getCurrencySymbol("INR")).toBe("₹");
    });

    it("should return correct symbol for EUR", () => {
      expect(getCurrencySymbol("EUR")).toBe("€");
    });

    it("should return correct symbol for GBP", () => {
      expect(getCurrencySymbol("GBP")).toBe("£");
    });

    it("should fallback to $ for unknown currency", () => {
      expect(getCurrencySymbol("XXX")).toBe("$");
    });
  });

  describe("Currency Configuration", () => {
    it("should have all required currencies defined", () => {
      expect(CURRENCIES).toHaveProperty("USD");
      expect(CURRENCIES).toHaveProperty("INR");
      expect(CURRENCIES).toHaveProperty("EUR");
      expect(CURRENCIES).toHaveProperty("GBP");
    });

    it("should have valid exchange rates", () => {
      expect(EXCHANGE_RATES.USD).toBe(1.0); // USD is base currency
      expect(EXCHANGE_RATES.INR).toBeGreaterThan(1); // INR should be more than 1:1
      expect(EXCHANGE_RATES.EUR).toBeLessThan(1); // EUR is stronger than USD
    });

    it("should have matching currencies in CURRENCIES and EXCHANGE_RATES", () => {
      Object.keys(CURRENCIES).forEach((currencyCode) => {
        expect(EXCHANGE_RATES).toHaveProperty(currencyCode);
      });
    });
  });

  describe("Real-world Scenarios", () => {
    it("should correctly calculate payment success page scenario", () => {
      // Scenario from bug report:
      // Item price: $1299.99 USD
      // Should be converted to INR correctly, not shown as ₹1299.99

      const priceUSD = 1299.99;
      const priceINR = convertCurrency(priceUSD, "USD", "INR");

      // At rate of 83.85, should be approximately 108,993 INR
      expect(priceINR).toBeGreaterThan(100000);
      expect(priceINR).toBeCloseTo(108993, -2); // Allow ±100 variance

      // Formatted correctly
      const formatted = formatCurrency(priceINR, "INR");
      expect(formatted).toContain("₹");
      // INR uses Indian numbering system: 1,08,993 or 1,09,004 due to rounding
      expect(formatted).toMatch(/1[,\s]0[89]|10[89]/); // Accept both formats
    });

    it("should handle cart subtotal with multiple items", () => {
      const items = [
        { price: 1299.99, quantity: 1 }, // Camera
        { price: 49.99, quantity: 2 }, // Accessories
      ];

      const subtotalUSD = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      expect(subtotalUSD).toBe(1399.97);

      const subtotalINR = convertCurrency(subtotalUSD, "USD", "INR");
      // 1399.97 * 83.85 = 117,392
      expect(subtotalINR).toBeCloseTo(117392, -2);
    });

    it("should calculate taxes correctly in different currencies", () => {
      const subtotal = 1000; // USD

      // USD: 8% tax
      const taxUSD = subtotal * 0.08;
      expect(taxUSD).toBe(80);

      // INR: Convert first, then apply 18% GST
      const subtotalINR = convertCurrency(subtotal, "USD", "INR");
      const gstINR = subtotalINR * 0.18;

      // 1000 * 83.85 * 0.18 = 15,093 INR GST
      expect(gstINR).toBeCloseTo(15093, 0);
    });

    it("should handle shipping costs in different currencies", () => {
      const shippingUSD = 5;

      // Convert to INR
      const shippingINR = convertCurrency(shippingUSD, "USD", "INR");

      // 5 * 83.85 = 419.25 INR
      expect(shippingINR).toBeCloseTo(419, 0);

      // Not the fixed 50 INR mentioned in the old code
      expect(shippingINR).not.toBe(50);
    });
  });

  describe("Edge Cases", () => {
    it("should handle very large amounts", () => {
      const largeAmount = 1000000; // 1 million USD
      const converted = convertCurrency(largeAmount, "USD", "INR");

      expect(converted).toBeGreaterThan(0);
      expect(Number.isFinite(converted)).toBe(true);
    });

    it("should handle very small amounts", () => {
      const smallAmount = 0.01; // 1 cent USD
      const converted = convertCurrency(smallAmount, "USD", "INR");

      expect(converted).toBeGreaterThan(0);
      expect(converted).toBeCloseTo(0.83, 1);
    });

    it("should handle decimal precision correctly", () => {
      const amount = 99.99;
      const converted = convertCurrency(amount, "USD", "INR");

      // Should not lose precision in conversion
      const backConverted = convertCurrency(converted, "INR", "USD");
      expect(backConverted).toBeCloseTo(amount, 1);
    });
  });

  describe("localStorage functions", () => {
    beforeEach(() => {
      // Clear localStorage before each test
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
    });

    it("should store and retrieve user currency preference", () => {
      if (typeof window === "undefined") {
        // Skip in Node.js environment
        return;
      }

      setUserCurrency("INR");
      const stored = localStorage.getItem("preferredCurrency");
      expect(stored).toBe("INR");
    });

    it("should get user currency from localStorage if available", () => {
      if (typeof window === "undefined") {
        // Skip in Node.js environment
        return;
      }

      localStorage.setItem("preferredCurrency", "EUR");
      const currency = getUserCurrency();
      expect(currency).toBe("EUR");
    });
  });
});
