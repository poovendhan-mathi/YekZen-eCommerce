# Scripts

This folder contains utility scripts for the YekZen eCommerce application.

## Available Scripts

### `seedProducts.js`

Seeds the Firestore database with sample products.

**Usage:**

```bash
node scripts/seedProducts.js
```

**Prerequisites:**

- Firebase project set up
- Firestore enabled
- Environment variables configured in `.env.local`

**What it does:**

- Adds 8 sample products to Firestore
- Each product includes: name, price, images, ratings, stock info
- Creates `products` collection if it doesn't exist
- Adds timestamps automatically

**Expected Output:**

```
🌱 Starting to seed products...
✅ Added product: Premium Wireless Headphones (ID: abc123...)
✅ Added product: Smart Fitness Watch (ID: def456...)
...
🎉 Successfully seeded 8 products!
```

## Adding More Scripts

Place any utility scripts in this folder:

- Database migrations
- Data export/import
- Batch updates
- Analytics scripts
- etc.
