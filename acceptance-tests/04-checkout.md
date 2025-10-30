# 04 - Checkout Process Testing

**Module**: Checkout  
**Total Scenarios**: 25  
**Priority**: 🔴 Critical

## Progress: 0/25

## A. Checkout Flow

### A1: Navigate to Checkout ⏳
**Steps**: Cart with items → Click "Proceed to Checkout"  
**Expected**: Redirects to `/checkout`, cart items visible

### A2: Checkout - Guest User ⏳
**Steps**: Not logged in → Try checkout  
**Expected**: Prompted to login/signup OR guest checkout allowed

### A3: Checkout - Logged In User ⏳
**Steps**: Login → Add to cart → Checkout  
**Expected**: User details pre-filled if saved

### A4: Empty Cart Checkout Prevention ⏳
**Steps**: Navigate to `/checkout` with empty cart  
**Expected**: Redirect to cart or products, message "Cart is empty"

---

## B. Shipping Information

### B5: Enter Shipping Address ⏳
**Expected**: Fields for name, address, city, state, ZIP, country

### B6: Shipping - Field Validation ⏳
**Expected**: Required fields marked, email format validated, phone number format

### B7: Save Address for Later ⏳
**Expected**: Checkbox to save address, stored in user profile

### B8: Select Saved Address ⏳
**Expected**: Dropdown shows saved addresses, can select one

### B9: Different Billing Address ⏳
**Expected**: Checkbox "Different billing address", shows additional form

---

## C. Order Review

### C10: Review Order Items ⏳
**Expected**: Lists all cart items, quantities, individual prices

### C11: Subtotal Calculation ⏳
**Expected**: Correct sum of all items

### C12: Shipping Cost Display ⏳
**Expected**: Shows shipping fee (or "Free shipping")

### C13: Tax Calculation (If Applicable) ⏳
**Expected**: Tax amount calculated based on location

### C14: Order Total ⏳
**Expected**: Subtotal + Shipping + Tax = Grand Total

### C15: Edit Cart from Checkout ⏳
**Expected**: "Edit Cart" link returns to cart page

---

## D. Payment Method Selection

### D16: Display Payment Options ⏳
**Expected**: Shows Stripe (Cards) and Razorpay (UPI, Cards)

### D17: Select Stripe Payment ⏳
**Expected**: Card input form appears, Stripe branding

### D18: Select Razorpay Payment ⏳
**Expected**: Razorpay options shown (UPI, Cards, Wallets)

---

## E. Place Order

### E19: Place Order - Loading State ⏳
**Expected**: Button disabled, spinner shown, "Processing..." text

### E20: Place Order - Success ⏳
**Expected**: Redirect to order confirmation, order ID shown

### E21: Place Order - Payment Failure ⏳
**Expected**: Error message, stays on checkout, can retry

### E22: Order Confirmation Page ⏳
**Expected**: Shows order details, email sent, download invoice option

---

## F. Edge Cases

### F23: Browser Back Button During Checkout ⏳
**Expected**: Data preserved OR warning about losing progress

### F24: Session Timeout During Checkout ⏳
**Expected**: Graceful handling, redirect to login, cart preserved

### F25: Multiple Checkout Attempts ⏳
**Expected**: Prevents duplicate orders, proper error handling

---

**Last Updated**: October 30, 2025
