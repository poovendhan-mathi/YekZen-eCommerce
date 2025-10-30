# 02 - Product Catalog Testing

**Module**: Product Catalog  
**Total Scenarios**: 40  
**Priority**: 🟡 High  
**Status**: ⏳ Pending

---

## 📊 Progress Tracker

- **Total**: 40 scenarios
- **Completed**: 0
- **Passed**: 0
- **Failed**: 0

---

## 🎯 Test Scenarios

### A. Product Listing Page

#### A1: Load All Products Successfully

- **Status**: ⏳
- **Priority**: Critical
- **Steps**:
  1. Navigate to `/products`
  2. Wait for page to load
- **Expected Result**:
  - All products displayed in grid
  - Product cards show: image, name, price
  - Loading spinner shown initially
  - No console errors
  - Responsive grid layout
- **Actual Result**: _[To be filled]_

---

#### A2: Product Grid Layout - Desktop

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Open `/products` on desktop (>1024px)
  2. Observe layout
- **Expected Result**:
  - 3-4 products per row
  - Proper spacing between cards
  - Images load correctly
  - Grid responsive to window size
- **Actual Result**: _[To be filled]_

---

#### A3: Product Grid Layout - Mobile

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Open `/products` on mobile (<768px)
  2. Check layout
- **Expected Result**:
  - 1-2 products per row
  - Cards stack vertically
  - Easy to scroll
  - No horizontal overflow
- **Actual Result**: _[To be filled]_

---

#### A4: Product Image Loading

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Navigate to `/products`
  2. Observe image loading
  3. Check Network tab for image requests
- **Expected Result**:
  - Images load progressively
  - Placeholder shown while loading
  - Optimized image sizes (Next.js Image)
  - No broken images
  - Alt text present
- **Actual Result**: _[To be filled]_

---

#### A5: Product Card - Hover Effects

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Navigate to `/products`
  2. Hover over product cards
- **Expected Result**:
  - Smooth hover animation
  - Card elevation/shadow changes
  - "View Details" or similar appears
  - Cursor changes to pointer
- **Actual Result**: _[To be filled]_

---

#### A6: Featured Products Display

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Navigate to home page `/`
  2. Check featured products section
- **Expected Result**:
  - Featured products highlighted
  - Different styling from regular products
  - "Featured" badge visible
  - Links to product detail page
- **Actual Result**: _[To be filled]_

---

#### A7: Empty State - No Products

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Clear all products from database (emulator)
  2. Navigate to `/products`
- **Expected Result**:
  - Empty state message: "No products available"
  - Helpful icon or illustration
  - CTA to add products (admin) or check back later
  - No error thrown
- **Actual Result**: _[To be filled]_

---

#### A8: Product Count Display

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Navigate to `/products`
  2. Check if total count shown
- **Expected Result**:
  - "Showing X products" or similar
  - Count updates with filters
  - Accurate count
- **Actual Result**: _[To be filled]_

---

### B. Product Details Page

#### B1: View Product Details

- **Status**: ⏳
- **Priority**: Critical
- **Steps**:
  1. Navigate to `/products`
  2. Click on any product card
  3. Should navigate to `/products/[id]`
- **Expected Result**:
  - Product detail page loads
  - Shows: name, price, description, images
  - "Add to Cart" button visible
  - Stock status shown
  - Back/breadcrumb navigation
- **Actual Result**: _[To be filled]_

---

#### B2: Product Image Gallery

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Open product detail page
  2. If multiple images exist, check gallery
- **Expected Result**:
  - Main image displayed large
  - Thumbnails shown below/side
  - Click thumbnail to change main image
  - Smooth transition
  - Zoom feature (optional)
- **Actual Result**: _[To be filled]_

---

#### B3: Product Description Formatting

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Open product with long description
  2. Check formatting
- **Expected Result**:
  - Line breaks preserved
  - Bullet points if any
  - Readable font size
  - Max width for readability
- **Actual Result**: _[To be filled]_

---

#### B4: Stock Status - In Stock

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. View product with stock > 0
  2. Check stock indicator
- **Expected Result**:
  - "In Stock" badge (green)
  - Available quantity shown (optional)
  - "Add to Cart" button enabled
- **Actual Result**: _[To be filled]_

---

#### B5: Stock Status - Out of Stock

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. View product with stock = 0
  2. Check UI changes
- **Expected Result**:
  - "Out of Stock" badge (red/gray)
  - "Add to Cart" button disabled
  - "Notify me" option (optional)
  - Clear visual indication
- **Actual Result**: _[To be filled]_

---

#### B6: Product Price Display

- **Status**: ⏳
- **Priority**: Critical
- **Steps**:
  1. View various products
  2. Check price formatting
- **Expected Result**:
  - Currency symbol shown ($, ₹, etc.)
  - Decimal places consistent (2 digits)
  - Large, readable font
  - Discounted price shown if applicable
- **Actual Result**: _[To be filled]_

---

#### B7: Product Category Display

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Open product detail page
  2. Look for category info
- **Expected Result**:
  - Category name displayed
  - Click category to see similar products
  - Breadcrumb shows category path
- **Actual Result**: _[To be filled]_

---

#### B8: Share Product (If Implemented)

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Open product detail
  2. Click share button/icon
- **Expected Result**:
  - Share modal opens
  - Social media options (FB, Twitter, WhatsApp)
  - Copy link option
  - Working share URLs
- **Actual Result**: _[To be filled]_

---

### C. Product Search

#### C1: Search by Product Name

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Navigate to `/products`
  2. Enter product name in search: "Laptop"
  3. Press Enter or click search icon
- **Expected Result**:
  - Results filtered to matching products
  - Only "Laptop" related products shown
  - Count updates
  - "No results" if none found
- **Actual Result**: _[To be filled]_

---

#### C2: Search - Partial Match

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Search for partial term: "Lap"
  2. Check results
- **Expected Result**:
  - Shows "Laptop", "Lap desk", etc.
  - Case-insensitive search
  - Results update as typing (debounced)
- **Actual Result**: _[To be filled]_

---

#### C3: Search - No Results Found

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Search for non-existent product: "XYZ123"
  2. Check display
- **Expected Result**:
  - "No products found for 'XYZ123'"
  - Suggestion to try different keywords
  - Clear search button to reset
  - No error thrown
- **Actual Result**: _[To be filled]_

---

#### C4: Search - Clear Search

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Perform a search
  2. Click "X" or clear button in search box
- **Expected Result**:
  - Search input cleared
  - All products shown again
  - Filter reset
- **Actual Result**: _[To be filled]_

---

#### C5: Search Persistence Across Navigation

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Search for "Phone"
  2. Click a product
  3. Go back to products page
- **Expected Result**:
  - Search term persists OR clears (document behavior)
  - User-friendly experience
- **Actual Result**: _[To be filled]_

---

### D. Product Filtering

#### D1: Filter by Category

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Navigate to `/products`
  2. Select category filter: "Electronics"
  3. Observe results
- **Expected Result**:
  - Only electronics products shown
  - Count updates
  - Filter highlighted as active
  - Can clear filter
- **Actual Result**: _[To be filled]_

---

#### D2: Filter by Price Range

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Use price range slider/inputs
  2. Set min: $100, max: $500
  3. Apply filter
- **Expected Result**:
  - Only products in range shown
  - Slider updates visually
  - Count reflects filtered results
- **Actual Result**: _[To be filled]_

---

#### D3: Multiple Filters Combined

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Select category: "Electronics"
  2. Set price range: $100-$500
  3. Search: "Laptop"
- **Expected Result**:
  - All filters applied together (AND logic)
  - Results match all criteria
  - Can remove individual filters
- **Actual Result**: _[To be filled]_

---

#### D4: Clear All Filters

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Apply multiple filters
  2. Click "Clear All" or reset button
- **Expected Result**:
  - All filters removed
  - All products shown
  - Filter UI reset to defaults
- **Actual Result**: _[To be filled]_

---

#### D5: Filter by Availability (In Stock Only)

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Toggle "In Stock Only" checkbox
  2. Observe results
- **Expected Result**:
  - Only available products shown
  - Out of stock products hidden
  - Toggle clearly indicates state
- **Actual Result**: _[To be filled]_

---

### E. Product Sorting

#### E1: Sort by Price - Low to High

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Navigate to `/products`
  2. Select sort: "Price: Low to High"
- **Expected Result**:
  - Products reordered
  - Cheapest product first
  - Sort persists while browsing
- **Actual Result**: _[To be filled]_

---

#### E2: Sort by Price - High to Low

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Select sort: "Price: High to Low"
  2. Check order
- **Expected Result**:
  - Most expensive first
  - Correct ordering
- **Actual Result**: _[To be filled]_

---

#### E3: Sort by Name (A-Z)

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Select sort: "Name: A-Z"
  2. Verify order
- **Expected Result**:
  - Alphabetical order
  - Case-insensitive sorting
- **Actual Result**: _[To be filled]_

---

#### E4: Sort by Newest First

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Select sort: "Newest First"
  2. Check order
- **Expected Result**:
  - Recently added products first
  - Based on createdAt timestamp
- **Actual Result**: _[To be filled]_

---

### F. Pagination (If Implemented)

#### F1: Navigate to Next Page

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. If >12 products, check pagination
  2. Click "Next" or page 2
- **Expected Result**:
  - Next set of products loads
  - Page number updates
  - Smooth transition
  - URL updates (optional)
- **Actual Result**: _[To be filled]_

---

#### F2: Navigate to Previous Page

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Go to page 2
  2. Click "Previous" or page 1
- **Expected Result**:
  - Previous products shown
  - Page indicator updates
- **Actual Result**: _[To be filled]_

---

#### F3: Items Per Page Selection

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Change items per page: 12, 24, 48
  2. Check results
- **Expected Result**:
  - Grid updates with selected count
  - Pagination recalculates
- **Actual Result**: _[To be filled]_

---

### G. Performance & Edge Cases

#### G1: Load 100+ Products

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Seed database with 100+ products
  2. Navigate to `/products`
  3. Check performance
- **Expected Result**:
  - Page loads in <3 seconds
  - Smooth scrolling
  - Pagination or infinite scroll
  - No lag
- **Actual Result**: _[To be filled]_

---

#### G2: Product with Missing Image

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Create product with no image
  2. View in product list
- **Expected Result**:
  - Placeholder image shown
  - No broken image icon
  - Product still clickable
- **Actual Result**: _[To be filled]_

---

#### G3: Product with Very Long Name

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Create product with 100+ char name
  2. View in grid and detail
- **Expected Result**:
  - Name truncated in grid with "..."
  - Full name in detail page
  - No layout breaking
- **Actual Result**: _[To be filled]_

---

#### G4: Product with $0 Price

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Create product with price = 0
  2. View product
- **Expected Result**:
  - Shows "$0.00" or "Free"
  - Can add to cart
  - Checkout handles correctly
- **Actual Result**: _[To be filled]_

---

#### G5: Rapid Filter Changes

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Quickly change multiple filters
  2. Observe UI behavior
- **Expected Result**:
  - Debounced requests
  - No race conditions
  - Latest filter applied
  - Loading state shown
- **Actual Result**: _[To be filled]_

---

## 🐛 Issues Found

| Issue # | Test ID | Description     | Severity | Status |
| ------- | ------- | --------------- | -------- | ------ |
| -       | -       | _No issues yet_ | -        | -      |

---

**Last Updated**: October 30, 2025  
**Tested By**: _[Your name]_
