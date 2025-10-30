# 🔐 Admin Dashboard - Acceptance Test Scenarios

**Module**: Admin Dashboard  
**Total Scenarios**: 30  
**Status**: ⏳ Pending  
**Last Updated**: October 30, 2025

---

## 📋 Overview

This document contains acceptance test scenarios for the Admin Dashboard module, including product management, order management, customer management, and analytics.

---

## ✅ Test Environment Setup

### Prerequisites

- [ ] Firebase emulators running
- [ ] Test data seeded
- [ ] Admin user created
- [ ] Development server running (localhost:3000)

### Test Accounts

- **Admin**: `admin@yekzen.com` / `Admin123!@#`
- **Regular User**: `test@yekzen.com` / `Test123!@#`

---

## 🧪 Test Scenarios

### 1. Admin Authentication

#### Scenario 1.1: Admin Login Access

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/signin`
2. Enter admin credentials
3. Click "Sign In"
4. Should redirect to `/admin`

**Expected Results**:

- ✅ Admin dashboard is accessible
- ✅ Admin navigation menu is visible
- ✅ Admin role badge is shown
- ✅ No console errors

**Actual Results**:
_Document findings here_

---

#### Scenario 1.2: Non-Admin Access Restriction

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Login as regular user (`test@yekzen.com`)
2. Try to navigate to `/admin`
3. Observe behavior

**Expected Results**:

- ✅ Access is denied
- ✅ Redirected to home or error page
- ✅ "Unauthorized" message shown
- ✅ Cannot access admin routes

**Actual Results**:
_Document findings here_

---

#### Scenario 1.3: Admin Logout

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Login as admin
2. Click logout button
3. Try to access `/admin` again

**Expected Results**:

- ✅ Successfully logged out
- ✅ Redirected to signin page
- ✅ Cannot access admin routes
- ✅ Session cleared

**Actual Results**:
_Document findings here_

---

### 2. Product Management

#### Scenario 2.1: View All Products

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Login as admin
2. Navigate to `/admin/products`
3. Review product list

**Expected Results**:

- ✅ All products are displayed
- ✅ Product details visible (name, price, stock, status)
- ✅ Images load correctly
- ✅ Pagination works if many products
- ✅ Loading state shown initially

**Actual Results**:
_Document findings here_

---

#### Scenario 2.2: Add New Product

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/products`
2. Click "Add Product" button
3. Fill in product details:
   - Name: "Test Product"
   - Description: "Test Description"
   - Price: 99.99
   - Category: "Electronics"
   - Stock: 50
4. Upload product image
5. Click "Save"

**Expected Results**:

- ✅ Form validates all fields
- ✅ Image upload works
- ✅ Product is created successfully
- ✅ Success message shown
- ✅ Product appears in list
- ✅ Redirected to product list

**Actual Results**:
_Document findings here_

---

#### Scenario 2.3: Edit Existing Product

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/products`
2. Click edit on a product
3. Modify details (change price to 149.99)
4. Click "Update"

**Expected Results**:

- ✅ Form pre-fills with current data
- ✅ Changes are saved
- ✅ Success message shown
- ✅ Updated data visible in list
- ✅ Changes persist after refresh

**Actual Results**:
_Document findings here_

---

#### Scenario 2.4: Delete Product

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/products`
2. Click delete on a product
3. Confirm deletion in modal
4. Verify product is removed

**Expected Results**:

- ✅ Confirmation modal appears
- ✅ Product is deleted on confirm
- ✅ Success message shown
- ✅ Product removed from list
- ✅ Database updated

**Actual Results**:
_Document findings here_

---

#### Scenario 2.5: Cancel Product Deletion

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/products`
2. Click delete on a product
3. Click "Cancel" in modal
4. Verify product is NOT removed

**Expected Results**:

- ✅ Modal closes
- ✅ Product remains in list
- ✅ No changes made
- ✅ No error messages

**Actual Results**:
_Document findings here_

---

#### Scenario 2.6: Product Image Management

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Edit a product
2. Upload multiple images
3. Set primary image
4. Delete an image
5. Save changes

**Expected Results**:

- ✅ Multiple images can be uploaded
- ✅ Primary image can be set
- ✅ Images can be deleted
- ✅ Image preview works
- ✅ Changes are saved correctly

**Actual Results**:
_Document findings here_

---

#### Scenario 2.7: Product Stock Management

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Edit a product
2. Update stock quantity
3. Set stock to 0
4. Save changes
5. Check product listing

**Expected Results**:

- ✅ Stock updates successfully
- ✅ "Out of Stock" status shown when stock = 0
- ✅ Stock level visible on product card
- ✅ Low stock warning shown if < 10

**Actual Results**:
_Document findings here_

---

#### Scenario 2.8: Product Featured Toggle

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Edit a product
2. Toggle "Featured" checkbox
3. Save changes
4. Check homepage for featured products

**Expected Results**:

- ✅ Featured status toggles correctly
- ✅ Featured products appear on homepage
- ✅ Featured badge visible
- ✅ Status persists after refresh

**Actual Results**:
_Document findings here_

---

### 3. Order Management

#### Scenario 3.1: View All Orders

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/orders`
2. Review order list

**Expected Results**:

- ✅ All orders displayed
- ✅ Order details visible (ID, customer, total, status, date)
- ✅ Pagination works
- ✅ Loading state shown
- ✅ Orders sorted by date (newest first)

**Actual Results**:
_Document findings here_

---

#### Scenario 3.2: View Order Details

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/orders`
2. Click on an order
3. Review order details

**Expected Results**:

- ✅ Complete order information shown
- ✅ Customer details visible
- ✅ Product list with quantities and prices
- ✅ Payment information visible
- ✅ Shipping address shown
- ✅ Order timeline visible

**Actual Results**:
_Document findings here_

---

#### Scenario 3.3: Update Order Status

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. View an order with status "pending"
2. Change status to "processing"
3. Save changes
4. Verify update

**Expected Results**:

- ✅ Status dropdown works
- ✅ Status updates successfully
- ✅ Success message shown
- ✅ Customer receives notification (if implemented)
- ✅ Status badge updates in UI
- ✅ Timestamp recorded

**Actual Results**:
_Document findings here_

---

#### Scenario 3.4: Mark Order as Shipped

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. View a "processing" order
2. Change status to "shipped"
3. Add tracking number
4. Save changes

**Expected Results**:

- ✅ Tracking number field appears
- ✅ Tracking number saved
- ✅ Status updates to shipped
- ✅ Customer receives notification
- ✅ Shipping date recorded

**Actual Results**:
_Document findings here_

---

#### Scenario 3.5: Cancel Order

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. View a "pending" order
2. Click "Cancel Order"
3. Enter cancellation reason
4. Confirm cancellation

**Expected Results**:

- ✅ Confirmation modal appears
- ✅ Reason field required
- ✅ Order status changes to "cancelled"
- ✅ Customer notified
- ✅ Stock quantities restored
- ✅ Refund process initiated (if paid)

**Actual Results**:
_Document findings here_

---

#### Scenario 3.6: Filter Orders by Status

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/orders`
2. Use status filter dropdown
3. Select "pending"
4. Review filtered results

**Expected Results**:

- ✅ Only pending orders shown
- ✅ Filter works for all statuses
- ✅ Order count updates
- ✅ Filter can be cleared
- ✅ URL updates with filter

**Actual Results**:
_Document findings here_

---

#### Scenario 3.7: Search Orders

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/orders`
2. Use search field
3. Search by order ID
4. Search by customer email
5. Search by product name

**Expected Results**:

- ✅ Search works for order ID
- ✅ Search works for customer email
- ✅ Search works for product name
- ✅ Results update in real-time
- ✅ Clear search button works

**Actual Results**:
_Document findings here_

---

#### Scenario 3.8: Export Orders

**Priority**: Low  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/orders`
2. Click "Export" button
3. Select date range
4. Download file

**Expected Results**:

- ✅ Export dialog appears
- ✅ Date range can be selected
- ✅ File downloads successfully
- ✅ CSV/Excel format correct
- ✅ All data included

**Actual Results**:
_Document findings here_

---

### 4. Customer Management

#### Scenario 4.1: View All Customers

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/customers`
2. Review customer list

**Expected Results**:

- ✅ All customers displayed
- ✅ Customer details visible (name, email, join date, orders)
- ✅ Pagination works
- ✅ Loading state shown

**Actual Results**:
_Document findings here_

---

#### Scenario 4.2: View Customer Details

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Click on a customer
2. Review customer profile

**Expected Results**:

- ✅ Customer information shown
- ✅ Order history visible
- ✅ Total spent displayed
- ✅ Account status shown
- ✅ Activity timeline visible

**Actual Results**:
_Document findings here_

---

#### Scenario 4.3: Search Customers

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/customers`
2. Use search field
3. Search by email
4. Search by name

**Expected Results**:

- ✅ Search works correctly
- ✅ Results filter in real-time
- ✅ Clear search works
- ✅ No results message shown if needed

**Actual Results**:
_Document findings here_

---

### 5. Dashboard Analytics

#### Scenario 5.1: View Dashboard Overview

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin`
2. Review dashboard

**Expected Results**:

- ✅ Key metrics displayed (revenue, orders, customers)
- ✅ Charts/graphs render correctly
- ✅ Recent orders shown
- ✅ Low stock alerts visible
- ✅ Loading states shown
- ✅ Data updates automatically

**Actual Results**:
_Document findings here_

---

#### Scenario 5.2: Revenue Statistics

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin`
2. Review revenue section
3. Change date range

**Expected Results**:

- ✅ Total revenue displayed
- ✅ Revenue chart visible
- ✅ Date range filter works
- ✅ Comparison with previous period shown
- ✅ Growth percentage calculated

**Actual Results**:
_Document findings here_

---

#### Scenario 5.3: Order Statistics

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin`
2. Review orders section

**Expected Results**:

- ✅ Total orders count
- ✅ Orders by status breakdown
- ✅ Orders trend chart
- ✅ Average order value shown
- ✅ Data accurate

**Actual Results**:
_Document findings here_

---

#### Scenario 5.4: Top Products

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin`
2. Review top products section

**Expected Results**:

- ✅ Best selling products listed
- ✅ Sales count shown
- ✅ Revenue per product shown
- ✅ Product images visible
- ✅ Click to view product details

**Actual Results**:
_Document findings here_

---

#### Scenario 5.5: Low Stock Alerts

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin`
2. Review low stock section
3. Create product with stock < 10

**Expected Results**:

- ✅ Low stock products highlighted
- ✅ Alert badge shown
- ✅ Stock level displayed
- ✅ Click to edit product
- ✅ Alert dismissible

**Actual Results**:
_Document findings here_

---

### 6. Settings & Configuration

#### Scenario 6.1: Update Site Settings

**Priority**: Low  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/settings`
2. Update site name
3. Update contact email
4. Save changes

**Expected Results**:

- ✅ Settings form loads
- ✅ Current values pre-filled
- ✅ Changes saved successfully
- ✅ Success message shown
- ✅ Changes reflect on site

**Actual Results**:
_Document findings here_

---

#### Scenario 6.2: Manage Categories

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/admin/categories`
2. Add new category
3. Edit existing category
4. Delete category

**Expected Results**:

- ✅ Can add categories
- ✅ Can edit categories
- ✅ Can delete categories (if no products)
- ✅ Warning shown if category has products
- ✅ Changes save correctly

**Actual Results**:
_Document findings here_

---

### 7. Responsive Design

#### Scenario 7.1: Mobile Admin View

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Open admin dashboard on mobile
2. Navigate through sections
3. Try to edit a product

**Expected Results**:

- ✅ Mobile menu works
- ✅ Tables are responsive
- ✅ Forms are usable
- ✅ Actions accessible
- ✅ No horizontal scroll

**Actual Results**:
_Document findings here_

---

#### Scenario 7.2: Tablet Admin View

**Priority**: Low  
**Status**: ⏳ Pending

**Steps**:

1. Open admin dashboard on tablet
2. Navigate through sections

**Expected Results**:

- ✅ Layout adapts correctly
- ✅ All features accessible
- ✅ Charts render properly
- ✅ No UI issues

**Actual Results**:
_Document findings here_

---

## 📊 Test Summary

### Results Overview

- **Total Scenarios**: 30
- **Passed**: 0
- **Failed**: 0
- **Blocked**: 0
- **Pending**: 30

### Priority Breakdown

- **High Priority**: 18 scenarios
- **Medium Priority**: 10 scenarios
- **Low Priority**: 2 scenarios

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

_Add any additional observations or comments here_

---

**Tester**: _Your Name_  
**Date Completed**: _Date_  
**Sign-off**: _Signature_
