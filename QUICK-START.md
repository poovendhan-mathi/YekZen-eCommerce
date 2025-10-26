# YekZen eCommerce - Quick Start Guide

## 🚀 Starting the Application

```bash
./start-dev.sh
```

This single command will:

1. Start Firebase Emulators (Auth + Firestore)
2. Seed 60 products automatically
3. Create test user accounts
4. Start Next.js development server

## 🌐 Access Points

| Service         | URL                   |
| --------------- | --------------------- |
| **Main App**    | http://localhost:3000 |
| **Emulator UI** | http://localhost:4000 |
| **Firestore**   | localhost:8080        |
| **Auth**        | localhost:9099        |

## 👤 Test Accounts

### Admin Account

- **Email:** admin@yekzen.com
- **Password:** admin123456

### User Account

- **Email:** user@yekzen.com
- **Password:** user123456

## 💳 Test Payment Cards (Development Mode)

| Card Type      | Number              | CVV  | Expiry |
| -------------- | ------------------- | ---- | ------ |
| **Visa**       | 4111 1111 1111 1111 | 123  | 12/25  |
| **Mastercard** | 5555 5555 5555 4444 | 456  | 11/26  |
| **Amex**       | 3782 822463 10005   | 1234 | 10/27  |

## 📦 Features Implemented

✅ **Authentication**

- Firebase Auth with email/password
- Protected routes
- User profile management

✅ **Product Catalog**

- 60+ products across 10 categories
- Dynamic filtering by category
- Multiple images per product (3-4 images)
- Real-time stock updates

✅ **Shopping Cart**

- Persistent cart with localStorage
- Add/remove/update quantity
- Real-time total calculation
- Cart badge in header

✅ **Checkout Process**

- Form validation (only shows errors after field is touched)
- International phone number support
- Multiple payment options (Stripe & Razorpay)
- Real-time form validation

✅ **Payment Integration**

- Stripe payment (demo mode in development)
- Razorpay UPI payment (demo mode in development)
- Test card forms in development
- Payment success page with real order data

✅ **Developer Features**

- Firebase Emulators for offline development
- Auto-seeding of products and users
- Hot reload for Next.js
- TypeScript for type safety

## 🛠️ Useful Scripts

### Add Multiple Images to Products

```bash
node scripts/add-multiple-images.js
```

### Create Test Users

```bash
node scripts/create-test-users.js
```

### Seed Products

```bash
node scripts/seed-emulator.js
```

## 📱 Testing Workflow

1. **Start the app:** `./start-dev.sh`
2. **Browse products:** http://localhost:3000
3. **Sign in:** Use admin@yekzen.com / admin123456
4. **Add to cart:** Click on products and add to cart
5. **Checkout:** Fill form and test payment
6. **Use test cards:** Use the Visa test card number above

## 🔧 Troubleshooting

### Emulators not starting?

```bash
# Kill existing processes
pkill -f firebase
pkill -f next

# Restart
./start-dev.sh
```

### Products not showing?

```bash
# Re-seed the database
node scripts/seed-emulator.js
```

### Can't login?

```bash
# Recreate test users
node scripts/create-test-users.js
```

## 📝 Recent Fixes Applied

1. ✅ Validation errors only show after touching fields
2. ✅ International phone number support (7+ digits)
3. ✅ Payment card forms in development mode
4. ✅ Real cart data on success page
5. ✅ Multiple images per product (3-4 images)
6. ✅ Test user creation scripts

## 🎯 Next Steps

- Add product reviews and ratings
- Implement order history
- Add admin dashboard
- Enable image upload
- Add search functionality
- Implement wishlist feature

---

**Happy Testing! 🎉**
