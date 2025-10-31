# Enhanced Checkout Form Validation

## Overview

The checkout page now features comprehensive, country-specific form validation for all fields including:

- ✅ Country code phone number validation
- ✅ Country-specific postal code formats
- ✅ Automatic input formatting
- ✅ Real-time validation feedback
- ✅ Support for 20+ countries

## Features Implemented

### 1. **Country Code Phone Number Selector**

#### Functionality:

- Automatic country code dropdown based on selected country
- Phone number must include the correct country code
- Real-time validation ensures phone matches country format
- Auto-populates country code when country is changed

#### Example:

```
Country: India (+91)
Phone: +91 9876543210 ✅
Phone: 9876543210 ❌ (Missing country code)
Phone: +1 9876543210 ❌ (Wrong country code for India)
```

### 2. **Country-Specific Postal Code Validation**

#### Numeric-Only Countries (India, Singapore, etc.):

- Only accepts numbers (no letters)
- Auto-filters out alphabetic characters
- Country-specific length validation

#### Examples:

- **India**: `560001` (6 digits, numeric only) ✅
- **Singapore**: `238859` (6 digits, numeric only) ✅
- **India**: `56000A` ❌ (Contains letter)

#### Alphanumeric Countries (UK, Canada):

- Accepts letters and numbers
- Country-specific format validation
- Auto-converts to uppercase

#### Examples:

- **UK**: `SW1A 1AA` ✅
- **Canada**: `K1A 0B1` ✅
- **UK**: `123456` ❌ (Wrong format)

### 3. **Comprehensive Form Validation**

All fields have proper validation:

| Field           | Validation Rules                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| **Name**        | • Minimum 2 characters<br>• Only letters, spaces, hyphens, apostrophes<br>• Required                   |
| **Email**       | • Valid email format (RFC 5322)<br>• Required                                                          |
| **Phone**       | • Must start with country code<br>• Matches selected country<br>• 6-15 digits after code<br>• Required |
| **Address**     | • Minimum 5 characters<br>• Required                                                                   |
| **City**        | • Minimum 2 characters<br>• Only letters, spaces, hyphens, apostrophes<br>• Required                   |
| **Postal Code** | • Country-specific format<br>• Numeric or alphanumeric based on country<br>• Required                  |
| **Country**     | • Must select from dropdown<br>• Required                                                              |

### 4. **Supported Countries**

#### Countries with Numeric-Only Postal Codes:

- 🇺🇸 United States (12345 or 12345-6789)
- 🇮🇳 India (123456)
- 🇸🇬 Singapore (123456)
- 🇦🇺 Australia (1234)
- 🇩🇪 Germany (12345)
- 🇫🇷 France (12345)
- 🇮🇹 Italy (12345)
- 🇪🇸 Spain (12345)
- 🇯🇵 Japan (123-4567)
- 🇨🇳 China (123456)
- 🇧🇷 Brazil (12345-678)
- 🇲🇽 Mexico (12345)
- 🇦🇪 UAE (12345)
- 🇸🇦 Saudi Arabia (12345)
- 🇿🇦 South Africa (1234)
- 🇳🇿 New Zealand (1234)
- 🇲🇾 Malaysia (12345)
- 🇹🇭 Thailand (12345)
- 🇵🇭 Philippines (1234)

#### Countries with Alphanumeric Postal Codes:

- 🇨🇦 Canada (A1A 1A1)
- 🇬🇧 United Kingdom (SW1A 1AA)

## Technical Implementation

### Validation Utility (`lib/utils/validation.ts`)

The validation system is built using a centralized utility module:

```typescript
import {
  validateEmail,
  validatePhone,
  validatePostalCode,
  validateName,
  validateAddress,
  validateCity,
  validateCountry,
  getCountryInfo,
  getAllCountries,
} from "../../lib/utils/validation";
```

### Key Functions:

#### `validatePhone(phone, countryCode)`

Validates phone number format and ensures it matches the selected country's phone code.

```typescript
const error = validatePhone("+91 9876543210", "IN");
// Returns null if valid, error message string if invalid
```

#### `validatePostalCode(postalCode, countryCode)`

Validates postal code based on country-specific format rules.

```typescript
const error = validatePostalCode("560001", "IN");
// Returns null if valid (numeric only for India)

const error = validatePostalCode("56000A", "IN");
// Returns error: "Postal code for India must contain only numbers"
```

#### `getCountryInfo(countryCode)`

Returns country-specific information:

```typescript
const info = getCountryInfo("IN");
// Returns: {
//   name: "India",
//   phoneCode: "+91",
//   postalCodeFormat: /^\d{6}$/,
//   postalCodePlaceholder: "123456",
//   postalCodeType: "numeric"
// }
```

## User Experience Enhancements

### 1. **Smart Auto-Fill**

- When country is selected, phone number is auto-populated with country code
- Postal code placeholder updates to show correct format
- Form fields enable/disable based on country selection

### 2. **Real-Time Validation**

- Validation occurs as user types
- Error messages appear only after field is touched
- Success indicators for valid inputs

### 3. **Input Filtering**

- **Numeric postal codes**: Automatically removes letters as user types
- **Phone numbers**: Only allows numbers, +, -, (), and spaces
- **Alphanumeric postal codes**: Auto-converts to uppercase

### 4. **Helpful Hints**

- Format examples shown in placeholders
- Helper text displays expected format
- Error messages are clear and actionable

## Example Usage

### Singapore User:

1. Select **Country**: Singapore
2. **Phone** auto-fills: `+65 `
3. User enters: `+65 91234567` ✅
4. **Postal Code**: `238859` ✅ (6 digits, numeric only)

### India User:

1. Select **Country**: India
2. **Phone** auto-fills: `+91 `
3. User enters: `+91 9876543210` ✅
4. **Postal Code**: `560001` ✅ (6 digits, numeric only)
5. If user tries: `56000A` ❌ Letters are auto-filtered

### UK User:

1. Select **Country**: United Kingdom
2. **Phone** auto-fills: `+44 `
3. User enters: `+44 2012345678` ✅
4. **Postal Code**: `SW1A 1AA` ✅ (Alphanumeric format)

### Canada User:

1. Select **Country**: Canada
2. **Phone** auto-fills: `+1 `
3. User enters: `+1 4165551234` ✅
4. **Postal Code**: `K1A 0B1` ✅ (Letter-Digit-Letter format)

## Error Messages

### Clear and Actionable:

```
❌ "Phone must start with country code +91 for India"
❌ "Postal code for Singapore must contain only numbers"
❌ "Invalid postal code format. Expected format: 123456"
❌ "Name must be at least 2 characters"
❌ "Please enter a valid email address"
```

## Testing

### Test Cases:

#### India (Numeric Postal Code):

- ✅ `560001` - Valid
- ❌ `56000A` - Contains letter
- ❌ `5600` - Too short

#### Singapore (Numeric Postal Code):

- ✅ `238859` - Valid
- ❌ `23885A` - Contains letter
- ❌ `23885` - Too short

#### UK (Alphanumeric Postal Code):

- ✅ `SW1A 1AA` - Valid
- ✅ `sw1a 1aa` - Valid (auto-converts to uppercase)
- ❌ `123456` - Wrong format

#### Canada (Alphanumeric Postal Code):

- ✅ `K1A 0B1` - Valid
- ✅ `K1A0B1` - Valid (space optional)
- ❌ `K1A0B` - Incomplete

## Benefits

1. **Improved Data Quality**: Only valid addresses and phone numbers accepted
2. **Better User Experience**: Clear guidance and real-time feedback
3. **Reduced Errors**: Auto-formatting and filtering prevent common mistakes
4. **International Support**: Handles diverse postal code systems correctly
5. **Accessibility**: Clear error messages and labels
6. **Maintainable**: Centralized validation logic easy to extend

## Future Enhancements

Potential additions:

- [ ] Phone number length validation per country
- [ ] Address auto-complete integration
- [ ] State/Province validation for certain countries
- [ ] More granular postal code patterns
- [ ] Integration with address verification APIs

---

**Last Updated:** October 31, 2025
**Version:** 1.0
