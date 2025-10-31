/**
 * Validation Tests
 * Demonstrates the validation functions for different countries
 */

/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-undef */

import {
  validateEmail,
  validatePhone,
  validatePostalCode,
  validateName,
  validateAddress,
  validateCity,
  validateCountry,
  getCountryInfo,
} from "../lib/utils/validation";

describe("Form Validation", () => {
  describe("Email Validation", () => {
    it("should accept valid emails", () => {
      expect(validateEmail("test@example.com")).toBeNull();
      expect(validateEmail("user.name+tag@example.co.uk")).toBeNull();
    });

    it("should reject invalid emails", () => {
      expect(validateEmail("")).toBeTruthy();
      expect(validateEmail("notanemail")).toBeTruthy();
      expect(validateEmail("missing@domain")).toBeTruthy();
    });
  });

  describe("Phone Validation", () => {
    it("should accept valid Indian phone numbers", () => {
      expect(validatePhone("+91 9876543210", "IN")).toBeNull();
      expect(validatePhone("+91-987-654-3210", "IN")).toBeNull();
    });

    it("should accept valid Singapore phone numbers", () => {
      expect(validatePhone("+65 91234567", "SG")).toBeNull();
      expect(validatePhone("+65-9123-4567", "SG")).toBeNull();
    });

    it("should reject phone numbers without country code", () => {
      expect(validatePhone("9876543210", "IN")).toBeTruthy();
      expect(validatePhone("91234567", "SG")).toBeTruthy();
    });

    it("should reject phone numbers with wrong country code", () => {
      expect(validatePhone("+1 9876543210", "IN")).toBeTruthy();
      expect(validatePhone("+91 91234567", "SG")).toBeTruthy();
    });
  });

  describe("Postal Code Validation - Numeric Countries", () => {
    it("should accept valid Indian postal codes", () => {
      expect(validatePostalCode("560001", "IN")).toBeNull();
      expect(validatePostalCode("110011", "IN")).toBeNull();
    });

    it("should accept valid Singapore postal codes", () => {
      expect(validatePostalCode("238859", "SG")).toBeNull();
      expect(validatePostalCode("018956", "SG")).toBeNull();
    });

    it("should reject Indian postal codes with letters", () => {
      expect(validatePostalCode("56000A", "IN")).toBeTruthy();
      expect(validatePostalCode("ABC123", "IN")).toBeTruthy();
    });

    it("should reject Singapore postal codes with letters", () => {
      expect(validatePostalCode("23885A", "SG")).toBeTruthy();
      expect(validatePostalCode("ABC123", "SG")).toBeTruthy();
    });

    it("should reject invalid length postal codes", () => {
      expect(validatePostalCode("5600", "IN")).toBeTruthy(); // Too short
      expect(validatePostalCode("2388", "SG")).toBeTruthy(); // Too short
    });
  });

  describe("Postal Code Validation - Alphanumeric Countries", () => {
    it("should accept valid UK postal codes", () => {
      expect(validatePostalCode("SW1A 1AA", "GB")).toBeNull();
      expect(validatePostalCode("M1 1AA", "GB")).toBeNull();
      expect(validatePostalCode("CR2 6XH", "GB")).toBeNull();
    });

    it("should accept valid Canadian postal codes", () => {
      expect(validatePostalCode("K1A 0B1", "CA")).toBeNull();
      expect(validatePostalCode("K1A0B1", "CA")).toBeNull(); // Without space
      expect(validatePostalCode("M5W 1E6", "CA")).toBeNull();
    });

    it("should reject invalid UK postal codes", () => {
      expect(validatePostalCode("123456", "GB")).toBeTruthy();
      expect(validatePostalCode("ABCDEF", "GB")).toBeTruthy();
    });

    it("should reject invalid Canadian postal codes", () => {
      expect(validatePostalCode("123456", "CA")).toBeTruthy();
      expect(validatePostalCode("K1A0B", "CA")).toBeTruthy(); // Incomplete
    });
  });

  describe("Name Validation", () => {
    it("should accept valid names", () => {
      expect(validateName("John Doe")).toBeNull();
      expect(validateName("Mary-Jane O'Connor")).toBeNull();
      expect(validateName("Jean-Pierre")).toBeNull();
    });

    it("should reject invalid names", () => {
      expect(validateName("")).toBeTruthy();
      expect(validateName("A")).toBeTruthy(); // Too short
      expect(validateName("John123")).toBeTruthy(); // Contains numbers
      expect(validateName("@John")).toBeTruthy(); // Special characters
    });
  });

  describe("Address Validation", () => {
    it("should accept valid addresses", () => {
      expect(validateAddress("123 Main Street")).toBeNull();
      expect(validateAddress("Flat 4B, Building 12")).toBeNull();
    });

    it("should reject invalid addresses", () => {
      expect(validateAddress("")).toBeTruthy();
      expect(validateAddress("123")).toBeTruthy(); // Too short
    });
  });

  describe("City Validation", () => {
    it("should accept valid city names", () => {
      expect(validateCity("Bangalore")).toBeNull();
      expect(validateCity("New York")).toBeNull();
      expect(validateCity("Saint-Denis")).toBeNull();
    });

    it("should reject invalid city names", () => {
      expect(validateCity("")).toBeTruthy();
      expect(validateCity("A")).toBeTruthy(); // Too short
      expect(validateCity("City123")).toBeTruthy(); // Contains numbers
    });
  });

  describe("Country Validation", () => {
    it("should accept valid country codes", () => {
      expect(validateCountry("US")).toBeNull();
      expect(validateCountry("IN")).toBeNull();
      expect(validateCountry("GB")).toBeNull();
    });

    it("should reject invalid country codes", () => {
      expect(validateCountry("")).toBeTruthy();
      expect(validateCountry("XX")).toBeTruthy();
      expect(validateCountry("INVALID")).toBeTruthy();
    });
  });

  describe("Country Info", () => {
    it("should return correct info for India", () => {
      const info = getCountryInfo("IN");
      expect(info.name).toBe("India");
      expect(info.phoneCode).toBe("+91");
      expect(info.postalCodeType).toBe("numeric");
    });

    it("should return correct info for Singapore", () => {
      const info = getCountryInfo("SG");
      expect(info.name).toBe("Singapore");
      expect(info.phoneCode).toBe("+65");
      expect(info.postalCodeType).toBe("numeric");
    });

    it("should return correct info for UK", () => {
      const info = getCountryInfo("GB");
      expect(info.name).toBe("United Kingdom");
      expect(info.phoneCode).toBe("+44");
      expect(info.postalCodeType).toBe("alphanumeric");
    });

    it("should return correct info for Canada", () => {
      const info = getCountryInfo("CA");
      expect(info.name).toBe("Canada");
      expect(info.phoneCode).toBe("+1");
      expect(info.postalCodeType).toBe("alphanumeric");
    });
  });
});
