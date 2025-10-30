# 🔍 Search & Filters - Acceptance Test Scenarios

**Module**: Search & Filters  
**Total Scenarios**: 15  
**Status**: ⏳ Pending  
**Last Updated**: October 30, 2025

---

## 📋 Overview

This document contains acceptance test scenarios for the Search and Filtering functionality, including product search, advanced filters, sorting, and filter combinations.

---

## ✅ Test Environment Setup

### Prerequisites

- [ ] Firebase emulators running
- [ ] Test data seeded (diverse product catalog)
- [ ] Development server running (localhost:3000)

### Test Data Requirements

- Products in multiple categories
- Products with various price ranges
- Products with different stock levels
- Featured and non-featured products

---

## 🧪 Test Scenarios

### 1. Basic Search

#### Scenario 1.1: Search by Product Name

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to products page
2. Enter "laptop" in search box
3. Press Enter or click search

**Expected Results**:

- ✅ Results show products with "laptop" in name
- ✅ Search results update in real-time
- ✅ Result count displayed
- ✅ No irrelevant products shown
- ✅ Loading state shown during search

**Actual Results**:
_Document findings here_

---

#### Scenario 1.2: Search by Product Description

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to products page
2. Search for a word in product description (e.g., "wireless")
3. Review results

**Expected Results**:

- ✅ Products with matching descriptions shown
- ✅ Results are relevant
- ✅ Highlights or indicates match location
- ✅ Result count accurate

**Actual Results**:
_Document findings here_

---

#### Scenario 1.3: Search with No Results

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to products page
2. Search for non-existent product (e.g., "xyzabc123")
3. Review message

**Expected Results**:

- ✅ "No results found" message displayed
- ✅ Helpful suggestions provided
- ✅ Search term displayed in message
- ✅ Clear search button available
- ✅ No error in console

**Actual Results**:
_Document findings here_

---

#### Scenario 1.4: Clear Search

**Priority**: Low  
**Status**: ⏳ Pending

**Steps**:

1. Perform a search
2. Click clear/reset button
3. Verify results reset

**Expected Results**:

- ✅ Search box clears
- ✅ All products shown again
- ✅ Filters reset (if any)
- ✅ URL updates

**Actual Results**:
_Document findings here_

---

#### Scenario 1.5: Search with Special Characters

**Priority**: Low  
**Status**: ⏳ Pending

**Steps**:

1. Search with special characters: `@#$%&*`
2. Search with quotes: `"exact phrase"`
3. Review behavior

**Expected Results**:

- ✅ No errors occur
- ✅ Special characters handled gracefully
- ✅ Results show or "no results" message
- ✅ No SQL injection or security issues

**Actual Results**:
_Document findings here_

---

### 2. Category Filters

#### Scenario 2.1: Filter by Single Category

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to products page
2. Click on "Electronics" category
3. Review filtered results

**Expected Results**:

- ✅ Only electronics products shown
- ✅ Category filter highlighted/active
- ✅ Result count updates
- ✅ URL includes category parameter
- ✅ Breadcrumb shows category

**Actual Results**:
_Document findings here_

---

#### Scenario 2.2: Switch Between Categories

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Filter by "Electronics"
2. Then click "Clothing"
3. Observe transition

**Expected Results**:

- ✅ Products update to clothing
- ✅ Previous filter clears
- ✅ Smooth transition
- ✅ URL updates
- ✅ No duplicate products

**Actual Results**:
_Document findings here_

---

#### Scenario 2.3: Clear Category Filter

**Priority**: Low  
**Status**: ⏳ Pending

**Steps**:

1. Apply a category filter
2. Click "All" or clear filter
3. Verify reset

**Expected Results**:

- ✅ All products shown again
- ✅ Filter indicator removed
- ✅ URL cleaned
- ✅ Count shows all products

**Actual Results**:
_Document findings here_

---

### 3. Price Filters

#### Scenario 3.1: Filter by Price Range

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to products page
2. Use price slider or input fields
3. Set range: $50 - $200
4. Apply filter

**Expected Results**:

- ✅ Only products in range shown
- ✅ Price display accurate
- ✅ Result count updates
- ✅ Slider/inputs reflect selection
- ✅ URL includes price params

**Actual Results**:
_Document findings here_

---

#### Scenario 3.2: Minimum Price Only

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Set minimum price to $100
2. Leave maximum empty
3. Apply filter

**Expected Results**:

- ✅ Products >= $100 shown
- ✅ No upper limit applied
- ✅ Results accurate
- ✅ Filter indicator shown

**Actual Results**:
_Document findings here_

---

#### Scenario 3.3: Maximum Price Only

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Set maximum price to $50
2. Leave minimum empty
3. Apply filter

**Expected Results**:

- ✅ Products <= $50 shown
- ✅ No lower limit applied
- ✅ Results accurate
- ✅ Cheap products included

**Actual Results**:
_Document findings here_

---

### 4. Sorting

#### Scenario 4.1: Sort by Price (Low to High)

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Navigate to products page
2. Select "Price: Low to High" from sort dropdown
3. Review order

**Expected Results**:

- ✅ Products sorted by price ascending
- ✅ Cheapest product first
- ✅ Order is consistent
- ✅ URL includes sort parameter
- ✅ Sort selection persists

**Actual Results**:
_Document findings here_

---

#### Scenario 4.2: Sort by Price (High to Low)

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Select "Price: High to Low" from sort dropdown
2. Review order

**Expected Results**:

- ✅ Products sorted by price descending
- ✅ Most expensive first
- ✅ Correct ordering
- ✅ URL updates

**Actual Results**:
_Document findings here_

---

#### Scenario 4.3: Sort by Name (A-Z)

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Select "Name: A-Z" from sort dropdown
2. Review alphabetical order

**Expected Results**:

- ✅ Products sorted alphabetically
- ✅ A comes before Z
- ✅ Case-insensitive sorting
- ✅ Correct ordering

**Actual Results**:
_Document findings here_

---

#### Scenario 4.4: Sort by Newest First

**Priority**: Medium  
**Status**: ⏳ Pending

**Steps**:

1. Select "Newest" from sort dropdown
2. Review order

**Expected Results**:

- ✅ Most recent products first
- ✅ Date-based ordering correct
- ✅ Timestamp accurate
- ✅ "New" badge shown if applicable

**Actual Results**:
_Document findings here_

---

### 5. Combined Filters

#### Scenario 5.1: Search + Category Filter

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Search for "wireless"
2. Filter by "Electronics" category
3. Review results

**Expected Results**:

- ✅ Products match both criteria
- ✅ Only wireless electronics shown
- ✅ Both filters active
- ✅ Result count accurate
- ✅ Can remove filters individually

**Actual Results**:
_Document findings here_

---

#### Scenario 5.2: Category + Price + Sort

**Priority**: High  
**Status**: ⏳ Pending

**Steps**:

1. Filter by "Clothing" category
2. Set price range $20-$100
3. Sort by price low to high
4. Review combined results

**Expected Results**:

- ✅ All filters apply correctly
- ✅ Results match all criteria
- ✅ Sorting works on filtered set
- ✅ Active filters displayed
- ✅ URL contains all parameters

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

- **High Priority**: 8 scenarios
- **Medium Priority**: 6 scenarios
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

_Add any additional observations or comments here_

---

**Tester**: _Your Name_  
**Date Completed**: _Date_  
**Sign-off**: _Signature_
