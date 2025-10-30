# 🔧 Edge Cases - Acceptance Test Scenarios

**Module**: Edge Cases & Error Handling  
**Total Scenarios**: 15  
**Status**: ⏳ Pending  
**Last Updated**: October 30, 2025

---

## 📋 Overview

This document contains acceptance test scenarios for edge cases, error handling, boundary conditions, and unusual user behaviors.

---

## ✅ Test Environment Setup

### Prerequisites

- [ ] Firebase emulators running
- [ ] Development server running
- [ ] Test accounts available
- [ ] Network throttling available

---

## 🧪 Test Scenarios

### 1. Input Validation Edge Cases

#### Scenario 1.1: Extremely Long Product Name

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Login as admin
2. Try to create product with name > 200 characters
3. Submit form

**Expected Results**:

- ✅ Validation error shown
- ✅ Error message clear
- ✅ Form doesn't submit
- ✅ UI doesn't break
- ✅ Character counter shown (if applicable)

**Actual Results**:
_Document findings here_

---

#### Scenario 1.2: Special Characters in Product Name

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Create product with name: `<script>alert('XSS')</script>`
2. Create product with emojis: `🚀 Amazing Product 🎉`
3. Create product with Unicode: `Café Münch Ñoño`

**Expected Results**:

- ✅ XSS attempts sanitized
- ✅ Emojis handled correctly
- ✅ Unicode characters supported
- ✅ No script execution
- ✅ Display correct in all places

**Actual Results**:
_Document findings here_

---

#### Scenario 1.3: Negative Price Values

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Edit product
2. Enter negative price: -50
3. Try to save

**Expected Results**:

- ✅ Validation prevents negative prices
- ✅ Error message shown
- ✅ Form doesn't submit
- ✅ Minimum value enforced (0 or 0.01)

**Actual Results**:
_Document findings here_

---

#### Scenario 1.4: Extremely Large Price

**Priority**: Low  
**Status**: ⏳ Pending

**Steps**:

1. Edit product
2. Enter price: 999999999.99
3. Add to cart and checkout

**Expected Results**:

- ✅ Large numbers handled correctly
- ✅ No JavaScript number precision errors
- ✅ Display formatted correctly
- ✅ Calculations accurate
- ✅ Payment processing handles large amounts

**Actual Results**:
_Document findings here_

---

#### Scenario 1.5: Zero Price Product

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Create product with price: 0
2. Add to cart
3. Proceed to checkout

**Expected Results**:

- ✅ System handles free products
- ✅ Checkout flow works
- ✅ No payment required
- ✅ Order created successfully
- ✅ "Free" label shown

**Actual Results**:
_Document findings here_

---

### 2. Quantity Edge Cases

#### Scenario 2.1: Add Maximum Quantity to Cart

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Find product with stock: 100
2. Add 100 to cart
3. Try to add 1 more

**Expected Results**:

- ✅ Can add up to stock limit
- ✅ Warning shown at stock limit
- ✅ Cannot exceed stock
- ✅ Error message clear
- ✅ Cart updated correctly

**Actual Results**:
_Document findings here_

---

#### Scenario 2.2: Update Cart Quantity to Zero

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Add item to cart
2. Update quantity to 0
3. Observe behavior

**Expected Results**:

- ✅ Item removed from cart OR
- ✅ Confirmation shown before removal
- ✅ Cart updates correctly
- ✅ Total recalculated
- ✅ No errors

**Actual Results**:
_Document findings here_

---

#### Scenario 2.3: Negative Quantity Input

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Add item to cart
2. Manually type -5 in quantity field
3. Try to update

**Expected Results**:

- ✅ Negative values rejected
- ✅ Validation error shown
- ✅ Quantity reverts or shows error
- ✅ Cart not corrupted

**Actual Results**:
_Document findings here_

---

#### Scenario 2.4: Non-Numeric Quantity

**Priority**: Low  
**Status**: ⏳ Pending

**Steps**:

1. Add item to cart
2. Enter "abc" or "five" in quantity field
3. Try to update

**Expected Results**:

- ✅ Non-numeric input rejected
- ✅ Input validation prevents submission
- ✅ Error message shown
- ✅ Quantity field reverts to valid value

**Actual Results**:
_Document findings here_

---

### 3. Authentication Edge Cases

#### Scenario 3.1: Session Expiry During Checkout

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Login and add items to cart
2. Manually clear auth token (DevTools > Application > Cookies)
3. Try to proceed with checkout

**Expected Results**:

- ✅ Session expiry detected
- ✅ Redirect to login
- ✅ Cart preserved after re-login
- ✅ Can continue checkout
- ✅ Helpful error message shown

**Actual Results**:
_Document findings here_

---

#### Scenario 3.2: Concurrent Login on Multiple Devices

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Login on Device A
2. Login with same account on Device B
3. Perform actions on both devices

**Expected Results**:

- ✅ Both sessions work OR
- ✅ First session invalidated with notice
- ✅ No data corruption
- ✅ Cart syncs across devices
- ✅ Orders attributed correctly

**Actual Results**:
_Document findings here_

---

#### Scenario 3.3: Login with Deleted Account

**Priority**: Low  
**Status**: ⏳ Pending

**Steps**:

1. Create account
2. Admin deletes account from backend
3. Try to login with deleted credentials

**Expected Results**:

- ✅ Clear error message
- ✅ "Account not found" or similar
- ✅ No crash or 500 error
- ✅ Option to sign up again

**Actual Results**:
_Document findings here_

---

### 4. Network & Connectivity Edge Cases

#### Scenario 4.1: Network Disconnection During Checkout

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Fill checkout form
2. Disconnect internet (DevTools > Network > Offline)
3. Click "Place Order"

**Expected Results**:

- ✅ Network error detected
- ✅ Helpful error message shown
- ✅ Form data preserved
- ✅ Can retry when back online
- ✅ No duplicate orders created

**Actual Results**:
_Document findings here_

---

#### Scenario 4.2: Slow API Response

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Throttle network to "Slow 3G"
2. Navigate to products page
3. Observe loading behavior

**Expected Results**:

- ✅ Loading spinner/skeleton shown
- ✅ UI remains responsive
- ✅ Timeout after reasonable period
- ✅ Retry option provided
- ✅ Helpful error if timeout

**Actual Results**:
_Document findings here_

---

#### Scenario 4.3: API Returns 500 Error

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Simulate 500 error (stop backend or mock response)
2. Try to fetch products
3. Observe error handling

**Expected Results**:

- ✅ User-friendly error message
- ✅ "Something went wrong" not technical jargon
- ✅ Retry button available
- ✅ Error logged (for devs)
- ✅ Fallback UI shown

**Actual Results**:
_Document findings here_

---

### 5. Payment Edge Cases

#### Scenario 5.1: Payment Declined

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Add items to cart, proceed to checkout
2. Use test card that will be declined: `4000 0000 0000 0002`
3. Submit payment

**Expected Results**:

- ✅ Clear error message ("Card declined")
- ✅ Order not created
- ✅ Stock not deducted
- ✅ User can try again
- ✅ Cart preserved

**Actual Results**:
_Document findings here_

---

#### Scenario 5.2: Payment Processing Timeout

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Initiate payment
2. Simulate timeout (wait without response)
3. Observe behavior

**Expected Results**:

- ✅ Timeout message shown after ~30s
- ✅ User instructed what to do
- ✅ No duplicate charge
- ✅ Order status checked before retry
- ✅ Contact support option shown

**Actual Results**:
_Document findings here_

---

### 6. Data Integrity Edge Cases

#### Scenario 6.1: Product Deleted During Checkout

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Add product to cart
2. Admin deletes product from database
3. Proceed to checkout

**Expected Results**:

- ✅ System detects deleted product
- ✅ Item removed from cart automatically
- ✅ User notified
- ✅ Checkout continues with remaining items
- ✅ No crash or error

**Actual Results**:
_Document findings here_

---

#### Scenario 6.2: Stock Reduced to Zero During Checkout

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. User A adds last item to cart
2. User B also adds same item to cart
3. User A completes checkout first
4. User B tries to checkout

**Expected Results**:

- ✅ User B sees "out of stock" error
- ✅ Cannot complete checkout
- ✅ Item removed from cart
- ✅ Helpful message shown
- ✅ Can continue with other items

**Actual Results**:
_Document findings here_

---

## 📊 Test Summary

### Results Overview

- **Total Scenarios**: 15
- **Passed**: 0
- **Failed**: 0
- **Blocked**: 0
- **Pending**: 15

### Priority Breakdown

- **High Priority**: 6 scenarios
- **Medium Priority**: 8 scenarios
- **Low Priority**: 1 scenario

---

## 🐛 Issues Found

### Critical Issues

_None yet_

### Major Issues

_None yet_

### Minor Issues

_None yet_

---

## 📝 Notes

### Edge Case Categories Covered

- ✅ Input validation extremes
- ✅ Numeric boundary conditions
- ✅ Authentication edge cases
- ✅ Network failures
- ✅ Payment failures
- ✅ Data integrity issues
- ✅ Concurrent operations
- ✅ Race conditions

### Additional Edge Cases to Consider

- Multiple rapid form submissions
- Browser back/forward with checkout
- Expired payment tokens
- Invalid coupon codes
- Address validation failures
- International characters in forms
- Time zone edge cases
- Daylight saving time transitions

---

**Tester**: _Your Name_  
**Date Completed**: _Date_  
**Sign-off**: _Signature_
