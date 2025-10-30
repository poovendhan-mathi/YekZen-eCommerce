# 06 - Order Management Testing

**Module**: Orders  
**Total Scenarios**: 25  
**Priority**: 🟡 High

## Progress: 0/25

## A. Order Creation

### A1: Order Created After Payment ⏳

**Steps**: Complete checkout  
**Expected**: Order record in database, unique order ID

### A2: Order Confirmation Email ⏳

**Steps**: Place order  
**Expected**: Email sent to user with order details

### A3: Order Number Format ⏳

**Steps**: Check order ID  
**Expected**: Unique, sequential or UUID format

---

## B. View Orders

### B4: View All Orders - User ⏳

**Steps**: Navigate to `/orders`  
**Expected**: Lists all user's orders, newest first

### B5: Order List Display ⏳

**Expected**: Shows order ID, date, total, status, items count

### B6: Empty Orders Page ⏳

**Steps**: New user with no orders visits `/orders`  
**Expected**: "No orders yet" message, CTA to browse products

### B7: Order Card Click ⏳

**Steps**: Click order from list  
**Expected**: Navigate to order detail page

---

## C. Order Details

### C8: View Order Details ⏳

**Steps**: Click order → View `/orders/[id]`  
**Expected**: Full details: items, quantities, prices, shipping, total

### C9: Order Status Display ⏳

**Expected**: Status badge (Pending, Processing, Shipped, Delivered)

### C10: Order Timeline ⏳

**Expected**: Shows order placed → payment confirmed → shipped → delivered

### C11: Shipping Information Display ⏳

**Expected**: Delivery address, shipping method, tracking# (if available)

### C12: Download Invoice ⏳

**Steps**: Click "Download Invoice"  
**Expected**: PDF invoice generated and downloaded

---

## D. Order Status Updates

### D13: Order Status - Pending ⏳

**Expected**: Right after placement, before processing

### D14: Order Status - Processing ⏳

**Expected**: Admin accepts order, preparing shipment

### D15: Order Status - Shipped ⏳

**Expected**: Tracking number available, estimated delivery

### D16: Order Status - Delivered ⏳

**Expected**: Final status, delivery date shown

### D17: Order Status - Cancelled ⏳

**Expected**: If cancelled, shows reason, refund status

---

## E. Order Actions

### E18: Cancel Order ⏳

**Steps**: Click "Cancel Order" (if order is pending)  
**Expected**: Confirmation dialog, order cancelled, refund initiated

### E19: Cannot Cancel Shipped Order ⏳

**Steps**: Try to cancel after shipped  
**Expected**: Cancel button disabled/hidden, message explaining

### E20: Track Order ⏳

**Steps**: Click "Track Order" (if available)  
**Expected**: Shows shipping carrier tracking link

### E21: Reorder ⏳

**Steps**: Click "Reorder"  
**Expected**: Items added to cart, can checkout again

---

## F. Admin Order Management

### F22: Admin - View All Orders ⏳

**Steps**: Admin visits `/admin/orders`  
**Expected**: All orders from all users

### F23: Admin - Update Order Status ⏳

**Steps**: Admin changes status  
**Expected**: Status updated, user notified

### F24: Admin - Add Tracking Number ⏳

**Steps**: Admin enters tracking#  
**Expected**: Saved, visible to customer

### F25: Admin - Order Filters ⏳

**Steps**: Filter by status, date range  
**Expected**: Orders filtered correctly

---

**Last Updated**: October 30, 2025
