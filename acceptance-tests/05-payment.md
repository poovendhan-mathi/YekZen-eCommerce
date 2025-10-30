# 05 - Payment Integration Testing

**Module**: Payment (Stripe & Razorpay)  
**Total Scenarios**: 20  
**Priority**: 🔴 Critical

## Progress: 0/20

## A. Stripe Payment

### A1: Stripe - Successful Card Payment ⏳

**Steps**: Select Stripe → Enter card 4242 4242 4242 4242 → Submit  
**Expected**: Payment processes, order created, redirect to success page

### A2: Stripe - Declined Card ⏳

**Steps**: Use card 4000 0000 0000 0002  
**Expected**: Payment fails, error message shown, can retry

### A3: Stripe - Insufficient Funds ⏳

**Steps**: Use card 4000 0000 0000 9995  
**Expected**: "Insufficient funds" error, order not created

### A4: Stripe - Invalid Card Number ⏳

**Steps**: Enter 1234 5678 9012 3456  
**Expected**: Validation error, cannot submit

### A5: Stripe - Invalid Expiry Date ⏳

**Steps**: Enter past date (01/20)  
**Expected**: Validation error shown immediately

### A6: Stripe - Invalid CVV ⏳

**Steps**: Enter 2-digit CVV: "12"  
**Expected**: Error: "CVV must be 3-4 digits"

### A7: Stripe - 3D Secure Authentication ⏳

**Steps**: Use card 4000 0027 6000 3184  
**Expected**: 3DS popup appears, complete auth, payment succeeds

### A8: Stripe - Payment Loading State ⏳

**Steps**: Submit payment, observe UI  
**Expected**: Button disabled, spinner, "Processing payment..." message

---

## B. Razorpay Payment

### B9: Razorpay - UPI Payment ⏳

**Steps**: Select Razorpay → Choose UPI → Enter VPA  
**Expected**: Razorpay popup, UPI flow, payment confirmation

### B10: Razorpay - Card Payment ⏳

**Steps**: Select Razorpay → Card option → Enter card  
**Expected**: Card processed through Razorpay

### B11: Razorpay - Netbanking ⏳

**Steps**: Select Netbanking → Choose bank  
**Expected**: Redirect to bank page (test mode)

### B12: Razorpay - Wallet Payment ⏳

**Steps**: Select wallet (Paytm, PhonePe)  
**Expected**: Wallet flow initiated

---

## C. Payment Flow

### C13: Payment Webhook Handling ⏳

**Steps**: Complete payment → Check webhook call  
**Expected**: Order status updated, user notified

### C14: Payment - Amount Validation ⏳

**Steps**: Check payment amount matches cart total  
**Expected**: Exact match, no discrepancies

### C15: Payment Receipt/Invoice ⏳

**Steps**: After successful payment  
**Expected**: Receipt downloadable, invoice generated

### C16: Multiple Payment Attempts ⏳

**Steps**: Try payment → Fails → Retry  
**Expected**: Can retry without creating duplicate order

---

## D. Edge Cases

### D17: Payment Timeout ⏳

**Steps**: Initiate payment, wait (don't complete)  
**Expected**: Timeout message, can restart

### D18: Browser Close During Payment ⏳

**Steps**: Close browser mid-payment  
**Expected**: On return, order status correct (pending/failed)

### D19: Payment Currency Display ⏳

**Steps**: Check all payment screens  
**Expected**: Consistent currency symbol throughout

### D20: Refund Scenario (Admin) ⏳

**Steps**: Admin initiates refund  
**Expected**: Refund processed, order status updated

---

**Test Cards**:

- Stripe Success: 4242 4242 4242 4242
- Stripe Decline: 4000 0000 0000 0002
- Stripe 3DS: 4000 0027 6000 3184

**Last Updated**: October 30, 2025
