# 🚀 YekZen eCommerce - Quick Start Guide

## Development Setup with Firebase Emulator

### Prerequisites

- Node.js 18+ installed
- Firebase CLI installed globally: `npm install -g firebase-tools`

### Quick Start (Recommended)

**Option 1: Using the startup script (macOS/Linux)**

```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Option 2: Manual startup**

```bash
# Terminal 1: Start Firebase Emulators
npm run emulator

# Terminal 2: Seed data (wait 5 seconds after emulator starts)
npm run seed

# Terminal 3: Start Next.js dev server
npm run dev
```

**Option 3: One command (requires concurrently)**

```bash
npm run start:dev
```

### Access Points

Once everything is running:

- **🌐 Next.js App**: http://localhost:3000
- **🔥 Firebase Emulator UI**: http://localhost:4000
- **📊 Firestore**: localhost:8080
- **🔐 Auth**: localhost:9099

### Test Accounts

The seed script creates two accounts for testing:

**Admin Account**

- Email: `admin@yekzen.com`
- Password: `admin123456`
- Role: Admin (access to admin dashboard)

**Regular User**

- Email: `user@yekzen.com`
- Password: `user123456`
- Role: User (standard user access)

### What Gets Seeded

- ✅ 8 Premium products with complete details
- ✅ Product images, specifications, and ratings
- ✅ 2 user accounts (admin + regular user)
- ✅ User roles and permissions

### Features Available

- 🛍️ Browse products with real-time Firestore data
- 🔍 Search and filter products
- 🛒 Shopping cart functionality
- 👤 User authentication (login/register)
- 📦 Order management
- 👨‍💼 Admin dashboard (admin@yekzen.com only)
- 💳 Payment integration (Stripe & Razorpay test mode)

### Troubleshooting

**Products not showing?**

1. Make sure emulators are running (check http://localhost:4000)
2. Run seed script: `npm run seed`
3. Check browser console for errors
4. Verify `.env.local` or `.env.development` exists with emulator config

**Emulator already running?**

```bash
# Kill processes on emulator ports
lsof -ti:4000 | xargs kill -9
lsof -ti:8080 | xargs kill -9
lsof -ti:9099 | xargs kill -9
```

**Clear emulator data?**
Stop emulators and restart. Emulator data is ephemeral by default.

### Environment Variables

The project uses `.env.development` for local development with emulator:

```bash
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXT_PUBLIC_FIREBASE_EMULATOR_HOST=localhost
NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT=8080
NEXT_PUBLIC_AUTH_EMULATOR_PORT=9099
```

### Development Workflow

1. **Start development**: `./start-dev.sh` or `npm run start:dev`
2. **Make changes**: Edit files - hot reload works
3. **Test auth**: Login with test accounts
4. **Test products**: Browse, search, add to cart
5. **Test admin**: Login as admin to see dashboard
6. **Stop**: Ctrl+C to stop all services

### NPM Scripts Reference

```bash
npm run dev              # Start Next.js dev server only
npm run emulator         # Start Firebase emulators only
npm run seed             # Seed data to emulator
npm run start:dev        # Start everything (emulator + seed + dev)
npm run build            # Build for production
npm run start            # Start production server
```

### Next Steps

1. ✅ Login with test accounts
2. ✅ Browse products
3. ✅ Add items to cart
4. ✅ Test checkout flow
5. ✅ Explore admin dashboard
6. ✅ Customize products/features

---

**Need help?** Check the Firebase Emulator UI at http://localhost:4000 for data inspection.
