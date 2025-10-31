# Test Automation Setup

This directory contains automation scripts for setting up test data and users for Playwright E2E tests.

## Prerequisites

1. **Firebase Emulator** must be running:

   ```bash
   npm run emulator
   ```

2. **Environment Variables** (optional):
   - `USE_FIREBASE_EMULATOR` - Set to `false` to use production (default: uses emulator)
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID (default: `yekzen-ecommerce`)

## Setup Test Users

This script creates test users in Firebase Auth for automated testing.

### Usage

```bash
# Run the script
npm run setup-test-users
```

### What it does

Creates the following test users:

1. **Regular User**

   - Email: `test@yekzen.com`
   - Password: `Test@123456`
   - UID: `test-user-123`

2. **Admin User**
   - Email: `admin@yekzen.com`
   - Password: `Admin@123456`
   - UID: `admin-user-123`

### Troubleshooting

**Error: "Could not load the default credentials"**

- This means the script is trying to connect to production Firebase
- Make sure the Firebase emulator is running: `npm run emulator`
- Or explicitly set: `USE_FIREBASE_EMULATOR=true npm run setup-test-users`

**Error: "ECONNREFUSED localhost:9099"**

- The Firebase Auth emulator is not running
- Start it with: `npm run emulator`

**Users already exist**

- The script will update existing users instead of creating new ones
- This is expected behavior and safe to ignore

## Running E2E Tests

After setting up test users:

```bash
# Run all tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test acceptance-tests/automation/tests/01-authentication.spec.ts
```

## Files Structure

```
acceptance-tests/automation/
├── README.md                  # This file
├── fixtures/
│   └── test-users.json       # Test user credentials
├── scripts/
│   └── setup-test-users.ts   # User creation script
└── tests/
    └── *.spec.ts             # Playwright test files
```
