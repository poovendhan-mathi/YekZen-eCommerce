# 03 - Shopping Cart Testing

**Module**: Shopping Cart  
**Total Scenarios**: 30  
**Priority**: 🔴 Critical  
**Status**: ⏳ Pending

## 📊 Progress: 0/30 completed

## 🎯 Test Scenarios

### A. Add to Cart

#### A1: Add Product to Empty Cart ⏳
**Steps**: Navigate to product → Click "Add to Cart"  
**Expected**: Product added, cart badge shows "1", toast notification, cart icon updates  

#### A2: Add Same Product Multiple Times ⏳
**Steps**: Add product → Add same product again  
**Expected**: Quantity increases to 2, not duplicate entry  

#### A3: Add Different Products ⏳
**Steps**: Add product A → Add product B  
**Expected**: Cart has 2 items, correct products shown  

#### A4: Add Out-of-Stock Product ⏳
**Steps**: Try to add product with stock=0  
**Expected**: Button disabled, cannot add, "Out of Stock" message  

####A5: Add Product - Maximum Quantity ⏳
**Steps**: Add product quantity > available stock  
**Expected**: Limited to available stock, warning message  

#### A6: Quick Add from Product Grid ⏳
**Steps**: Click "Add to Cart" from product list (not detail page)  
**Expected**: Added without navigation, stays on list page  

#### A7: Cart Persistence - Logged Out ⏳
**Steps**: Add products → Logout → Check cart  
**Expected**: Cart preserved in localStorage, items persist  

#### A8: Cart Persistence - Page Refresh ⏳
**Steps**: Add products → Refresh page (F5)  
**Expected**: Cart items still present after reload  

---

### B. View Cart

#### B1: Open Cart Drawer/Page ⏳
**Steps**: Click cart icon in header  
**Expected**: Cart opens, shows all items, subtotal displayed  

#### B2: Cart Item Display ⏳
**Steps**: View cart with items  
**Expected**: Shows image, name, price, quantity, subtotal per item  

#### B3: Empty Cart Message ⏳
**Steps**: View cart with no items  
**Expected**: "Your cart is empty", CTA to browse products  

#### B4: Cart Count Badge ⏳
**Steps**: Add 3 different products  
**Expected**: Badge shows "3" (number of unique items)  

#### B5: Cart Total Calculation ⏳
**Steps**: Add items, check total  
**Expected**: Correct sum: (price × quantity) for all items  

---

### C. Update Cart

#### C1: Increase Quantity ⏳
**Steps**: Click "+" or increase quantity  
**Expected**: Quantity increases, subtotal updates, total recalculates  

#### C2: Decrease Quantity ⏳
**Steps**: Click "-" to decrease  
**Expected**: Quantity decreases, prices update  

#### C3: Decrease to Zero ⏳
**Steps**: Decrease quantity to 0  
**Expected**: Item removed from cart OR shows confirmation  

#### C4: Manual Quantity Input ⏳
**Steps**: Type quantity directly (e.g., "5")  
**Expected**: Quantity updates, validates max stock  

#### C5: Update Quantity - Exceeds Stock ⏳
**Steps**: Try to set quantity > available stock  
**Expected**: Limited to max available, error message shown  

---

### D. Remove from Cart

#### D1: Remove Single Item ⏳
**Steps**: Click "Remove" or trash icon  
**Expected**: Item removed, total updates, confirmation (optional)  

#### D2: Remove Last Item ⏳
**Steps**: Remove only item in cart  
**Expected**: Empty cart state, badge disappears  

#### D3: Clear Entire Cart ⏳
**Steps**: Click "Clear Cart" button  
**Expected**: All items removed, confirmation dialog, empty state  

---

### E. Cart Interactions

#### E1: Continue Shopping ⏳
**Steps**: In cart, click "Continue Shopping"  
**Expected**: Returns to products page, cart preserved  

#### E2: Proceed to Checkout ⏳
**Steps**: Click "Checkout" or "Proceed"  
**Expected**: Navigates to `/checkout`, cart items passed  

#### E3: Cart on Mobile ⏳
**Steps**: View cart on mobile device  
**Expected**: Responsive layout, easy to update/remove  

#### E4: Cart Animations ⏳
**Steps**: Add/remove items, observe animations  
**Expected**: Smooth transitions, visual feedback  

---

### F. Edge Cases

#### F1: Add 20+ Different Products ⏳
**Steps**: Add many products to cart  
**Expected**: All shown, scrollable, performance good  

#### F2: Product Price Changes While in Cart ⏳
**Steps**: Add product → Admin changes price → Refresh  
**Expected**: Shows updated price OR old price preserved (document behavior)  

#### F3: Product Deleted While in Cart ⏳
**Steps**: Add product → Delete from admin → View cart  
**Expected**: Handles gracefully, shows "unavailable" or removes item  

#### F4: Concurrent Cart Updates (Multiple Tabs) ⏳
**Steps**: Open 2 tabs → Add items in both  
**Expected**: Cart syncs across tabs OR last update wins  

#### F5: Cart Data Integrity ⏳
**Steps**: Inspect localStorage cart data  
**Expected**: Valid JSON, no corruption, product IDs match database  

---

## 🐛 Issues Found

| Issue # | Test | Description | Status |
|---------|------|-------------|--------|
| - | - | - | - |

**Last Updated**: October 30, 2025
