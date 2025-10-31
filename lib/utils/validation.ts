/**
 * Form Validation Utilities
 * Provides comprehensive validation for checkout and other forms
 */

// Country data with phone codes and postal code formats
export const COUNTRIES = {
  US: {
    name: "United States",
    phoneCode: "+1",
    postalCodeFormat: /^\d{5}(-\d{4})?$/,
    postalCodePlaceholder: "12345 or 12345-6789",
    postalCodeType: "numeric",
  },
  IN: {
    name: "India",
    phoneCode: "+91",
    postalCodeFormat: /^\d{6}$/,
    postalCodePlaceholder: "123456 (6 digits only)",
    postalCodeType: "numeric",
    postalCodeLength: 6,
  },
  SG: {
    name: "Singapore",
    phoneCode: "+65",
    postalCodeFormat: /^\d{6}$/,
    postalCodePlaceholder: "123456 (6 digits only)",
    postalCodeType: "numeric",
    postalCodeLength: 6,
  },
  CA: {
    name: "Canada",
    phoneCode: "+1",
    postalCodeFormat: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    postalCodePlaceholder: "A1A 1A1",
    postalCodeType: "alphanumeric",
  },
  GB: {
    name: "United Kingdom",
    phoneCode: "+44",
    postalCodeFormat: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
    postalCodePlaceholder: "SW1A 1AA",
    postalCodeType: "alphanumeric",
  },
  AU: {
    name: "Australia",
    phoneCode: "+61",
    postalCodeFormat: /^\d{4}$/,
    postalCodePlaceholder: "1234",
    postalCodeType: "numeric",
  },
  DE: {
    name: "Germany",
    phoneCode: "+49",
    postalCodeFormat: /^\d{5}$/,
    postalCodePlaceholder: "12345",
    postalCodeType: "numeric",
  },
  FR: {
    name: "France",
    phoneCode: "+33",
    postalCodeFormat: /^\d{5}$/,
    postalCodePlaceholder: "12345",
    postalCodeType: "numeric",
  },
  IT: {
    name: "Italy",
    phoneCode: "+39",
    postalCodeFormat: /^\d{5}$/,
    postalCodePlaceholder: "12345",
    postalCodeType: "numeric",
  },
  ES: {
    name: "Spain",
    phoneCode: "+34",
    postalCodeFormat: /^\d{5}$/,
    postalCodePlaceholder: "12345",
    postalCodeType: "numeric",
  },
  JP: {
    name: "Japan",
    phoneCode: "+81",
    postalCodeFormat: /^\d{3}-?\d{4}$/,
    postalCodePlaceholder: "123-4567",
    postalCodeType: "numeric",
  },
  CN: {
    name: "China",
    phoneCode: "+86",
    postalCodeFormat: /^\d{6}$/,
    postalCodePlaceholder: "123456",
    postalCodeType: "numeric",
  },
  BR: {
    name: "Brazil",
    phoneCode: "+55",
    postalCodeFormat: /^\d{5}-?\d{3}$/,
    postalCodePlaceholder: "12345-678",
    postalCodeType: "numeric",
  },
  MX: {
    name: "Mexico",
    phoneCode: "+52",
    postalCodeFormat: /^\d{5}$/,
    postalCodePlaceholder: "12345",
    postalCodeType: "numeric",
  },
  AE: {
    name: "United Arab Emirates",
    phoneCode: "+971",
    postalCodeFormat: /^\d{5}$/,
    postalCodePlaceholder: "12345",
    postalCodeType: "numeric",
  },
  SA: {
    name: "Saudi Arabia",
    phoneCode: "+966",
    postalCodeFormat: /^\d{5}(-\d{4})?$/,
    postalCodePlaceholder: "12345",
    postalCodeType: "numeric",
  },
  ZA: {
    name: "South Africa",
    phoneCode: "+27",
    postalCodeFormat: /^\d{4}$/,
    postalCodePlaceholder: "1234",
    postalCodeType: "numeric",
  },
  NZ: {
    name: "New Zealand",
    phoneCode: "+64",
    postalCodeFormat: /^\d{4}$/,
    postalCodePlaceholder: "1234",
    postalCodeType: "numeric",
  },
  MY: {
    name: "Malaysia",
    phoneCode: "+60",
    postalCodeFormat: /^\d{5}$/,
    postalCodePlaceholder: "12345",
    postalCodeType: "numeric",
  },
  TH: {
    name: "Thailand",
    phoneCode: "+66",
    postalCodeFormat: /^\d{5}$/,
    postalCodePlaceholder: "12345",
    postalCodeType: "numeric",
  },
  PH: {
    name: "Philippines",
    phoneCode: "+63",
    postalCodeFormat: /^\d{4}$/,
    postalCodePlaceholder: "1234",
    postalCodeType: "numeric",
  },
} as const;

export type CountryCode = keyof typeof COUNTRIES;

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required";
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return null;
};

// Phone validation based on country
export const validatePhone = (
  phone: string,
  countryCode: CountryCode
): string | null => {
  if (!phone.trim()) {
    return "Phone number is required";
  }

  // Remove all non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, "");

  // Check if phone starts with country code
  const expectedCode = COUNTRIES[countryCode].phoneCode;

  if (!cleanPhone.startsWith("+")) {
    return `Phone must start with country code ${expectedCode}`;
  }

  if (!cleanPhone.startsWith(expectedCode)) {
    return `Phone must start with ${expectedCode} for ${COUNTRIES[countryCode].name}`;
  }

  // Remove the country code to get just the phone number
  const phoneWithoutCode = cleanPhone.substring(expectedCode.length);

  // Basic length validation (phone numbers typically 6-15 digits after country code)
  if (phoneWithoutCode.length < 6 || phoneWithoutCode.length > 15) {
    return "Please enter a valid phone number";
  }

  return null;
};

// Postal code validation based on country
export const validatePostalCode = (
  postalCode: string,
  countryCode: CountryCode
): string | null => {
  if (!postalCode.trim()) {
    return "Postal code is required";
  }

  const country = COUNTRIES[countryCode];

  // For numeric-only countries (India, Singapore, etc.)
  if (country.postalCodeType === "numeric") {
    if (!/^\d+(-\d+)?$/.test(postalCode.trim())) {
      return `Postal code for ${country.name} must contain only numbers`;
    }
  }

  // Validate format
  if (!country.postalCodeFormat.test(postalCode.trim())) {
    return `Invalid postal code format. Expected format: ${country.postalCodePlaceholder}`;
  }

  return null;
};

// Name validation
export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return "Name is required";
  }

  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }

  return null;
};

// Address validation
export const validateAddress = (address: string): string | null => {
  if (!address.trim()) {
    return "Address is required";
  }

  if (address.trim().length < 5) {
    return "Please enter a complete address";
  }

  return null;
};

// City validation
export const validateCity = (city: string): string | null => {
  if (!city.trim()) {
    return "City is required";
  }

  if (city.trim().length < 2) {
    return "City name must be at least 2 characters";
  }

  if (!/^[a-zA-Z\s'-]+$/.test(city)) {
    return "City name can only contain letters, spaces, hyphens, and apostrophes";
  }

  return null;
};

// Country validation
export const validateCountry = (country: string): string | null => {
  if (!country || country === "") {
    return "Please select a country";
  }

  if (!COUNTRIES[country as CountryCode]) {
    return "Invalid country selected";
  }

  return null;
};

// Format phone number for display
export const formatPhoneNumber = (
  phone: string,
  countryCode: CountryCode
): string => {
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const expectedCode = COUNTRIES[countryCode].phoneCode;

  // If phone doesn't have country code, add it
  if (!cleanPhone.startsWith("+")) {
    return `${expectedCode} ${cleanPhone}`;
  }

  return cleanPhone;
};

// Get country info by code
export const getCountryInfo = (countryCode: CountryCode) => {
  return COUNTRIES[countryCode];
};

// Get all countries as array for dropdown
export const getAllCountries = () => {
  return Object.entries(COUNTRIES).map(([code, info]) => ({
    code,
    name: info.name,
    phoneCode: info.phoneCode,
  }));
};
