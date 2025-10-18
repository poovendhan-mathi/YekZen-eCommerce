# Adding Real Products to Database

This guide explains how to add actual products to your Firestore database and display them in the YekZen eCommerce app.

## ✅ What's Been Done

1. **Created Firestore Service** (`/firebase/productsService.js`)

   - Functions for CRUD operations: `addProduct`, `getAllProducts`, `getProductById`, etc.
   - Search and filter capabilities
   - Category-based queries

2. **Created Seed Script** (`/scripts/seedProducts.js`)

   - Pre-configured with 8 sample products
   - Includes electronics, clothing, accessories, and sports items
   - Each product has realistic data (name, price, images, ratings, etc.)

3. **Updated Products Page** (`/app/products/page.js`)
   - Now fetches products from Firestore instead of mock data
   - Real-time loading states
   - Error handling
   - Search and filter functionality integrated with Firestore

## 🔧 Setup Instructions

### Step 1: Configure Firebase

Make sure your `.env.local` file has all Firebase configuration variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**To get these values:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings > General
4. Scroll to "Your apps" section
5. Click the web app icon (</>)
6. Copy the config values to your `.env.local`

### Step 2: Enable Firestore

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to you
5. Click "Enable"

### Step 3: Seed the Database

Run the seed script to add sample products:

```bash
npm run seed
```

Or manually:

```bash
node scripts/seedProducts.js
```

You should see output like:

```
🌱 Starting to seed products...
✅ Added product: Premium Wireless Headphones (ID: abc123...)
✅ Added product: Smart Fitness Watch (ID: def456...)
...
🎉 Successfully seeded 8 products!
```

### Step 4: Verify in Firebase Console

1. Go to Firebase Console > Firestore Database
2. You should see a `products` collection
3. Click to view the 8 seeded products

### Step 5: Run the App

```bash
npm run dev
```

Visit `http://localhost:3000/products` to see your real products!

## 📝 Product Data Structure

Each product in Firestore has the following structure:

```javascript
{
  name: "Product Name",
  description: "Product description",
  price: 299.99,
  originalPrice: 399.99,        // For showing discounts
  category: "Electronics",       // Used for filtering
  brand: "Brand Name",
  image: "https://...",          // Product image URL
  inStock: true,
  stock: 45,                     // Quantity available
  rating: 4.7,                   // Average rating (0-5)
  reviews: 328,                  // Number of reviews
  featured: true,                // Show on homepage
  tags: ["wireless", "audio"],   // For search
  createdAt: Timestamp,          // Auto-generated
  updatedAt: Timestamp           // Auto-generated
}
```

## 🎯 Features

### Current Features

- ✅ Fetch all products from Firestore
- ✅ Filter by category
- ✅ Search products by name
- ✅ Loading states with skeleton screens
- ✅ Error handling
- ✅ Responsive grid layout

### Available Functions

```javascript
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getFilteredProducts,
} from "../firebase/productsService";

// Examples:
const products = await getAllProducts();
const electronics = await getProductsByCategory("Electronics");
const featured = await getFeaturedProducts();
const results = await searchProducts("headphones");
```

## 🚀 Adding More Products

### Method 1: Via Script (Recommended for Bulk)

1. Edit `/scripts/seedProducts.js`
2. Add more products to the `sampleProducts` array
3. Run `node scripts/seedProducts.js`

### Method 2: Via Firebase Console

1. Go to Firestore Database
2. Click on `products` collection
3. Click "Add document"
4. Fill in the product fields
5. Click "Save"

### Method 3: Via Code

```javascript
import { addProduct } from "../firebase/productsService";

const newProduct = {
  name: "New Product",
  price: 99.99,
  // ... other fields
};

await addProduct(newProduct);
```

## 🛠 Troubleshooting

### Products Not Loading

- Check Firebase config in `.env.local`
- Verify Firestore is enabled in Firebase Console
- Check browser console for errors
- Ensure products collection exists and has data

### Permission Denied

- In Firebase Console, go to Firestore > Rules
- For development, use these rules (⚠️ not for production):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Images Not Loading

- Make sure image URLs are accessible
- Consider using Firebase Storage for images
- Or use a CDN like Cloudinary or imgix

## 📦 Next Steps

1. **Add Product Management Admin Panel**

   - Create, edit, delete products via UI
   - Bulk import/export

2. **Add Product Reviews**

   - User-generated ratings and reviews
   - Review moderation

3. **Add Inventory Management**

   - Track stock levels
   - Low stock alerts
   - Auto-update on orders

4. **Add Product Variants**

   - Sizes, colors, etc.
   - Different prices per variant

5. **Add Image Upload**
   - Firebase Storage integration
   - Multiple images per product
   - Image optimization

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**Need Help?** Check the Firebase Console logs or browser console for detailed error messages.
