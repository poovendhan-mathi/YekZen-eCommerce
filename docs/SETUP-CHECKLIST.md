# ✅ Environment Setup Checklist

Use this checklist to get started with your development environment.

## 📋 Development Setup Checklist

### Initial Setup (One-time)

- [ ] **Install Firebase Tools**

  ```bash
  npm install -g firebase-tools
  ```

  _Alternative_: `npm install --save-dev firebase-tools`

- [ ] **Login to Firebase**

  ```bash
  firebase login
  ```

- [ ] **Verify Configuration**
  - [ ] Check `.env.local` exists
  - [ ] Verify `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`
  - [ ] Verify emulator ports are set (8080, 9099, 4000)

### Daily Development Workflow

- [ ] **Terminal 1: Start Firebase Emulator**

  ```bash
  firebase emulators:start --only firestore,auth
  ```

  ✅ Look for: `All emulators ready!`

- [ ] **Terminal 2: Start Next.js**

  ```bash
  npm run dev
  ```

  ✅ Look for: `Ready in Xms`

- [ ] **Seed Local Database** (first time or after reset)

  ```bash
  npm run seed:local
  ```

  ✅ Look for: `🎉 Successfully seeded 8 products!`

- [ ] **Access the Application**
  - [ ] App: http://localhost:3000
  - [ ] Emulator UI: http://localhost:4000
  - [ ] Products page: http://localhost:3000/products

### Verification

- [ ] **Check Browser Console**

  - [ ] Should see: `🔧 Connected to Firestore Emulator at localhost:8080`
  - [ ] Should NOT see: `🌐 Using production Firebase`

- [ ] **View Emulator UI** (http://localhost:4000)

  - [ ] Can see `products` collection
  - [ ] Products collection has 8 documents
  - [ ] Each product has correct fields (name, price, image, etc.)

- [ ] **Test Products Page**
  - [ ] Visit http://localhost:3000/products
  - [ ] Should see 8 products displayed
  - [ ] Products have images, names, prices
  - [ ] Can filter by category
  - [ ] Can search products

## 🌐 Production Setup Checklist

### One-Time Production Setup

- [ ] **Create Production Firebase Project**

  - [ ] Go to https://console.firebase.google.com/
  - [ ] Create new project (separate from dev)
  - [ ] Note the project ID

- [ ] **Enable Firestore**

  - [ ] In Firebase Console → Firestore Database
  - [ ] Click "Create Database"
  - [ ] Choose "Start in production mode"
  - [ ] Select region closest to your users

- [ ] **Get Production Credentials**

  - [ ] Firebase Console → Project Settings → General
  - [ ] Scroll to "Your apps" → Web app
  - [ ] Copy all config values

- [ ] **Create .env.production File**

  ```bash
  NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
  NEXT_PUBLIC_FIREBASE_API_KEY=your_production_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=prod-project.firebaseapp.com
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=prod-project-id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=prod-project.appspot.com
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
  NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123
  NODE_ENV=production
  ```

- [ ] **Seed Production Database**

  ```bash
  npm run seed:prod
  ```

  ✅ Look for: `🎉 Successfully seeded 8 products!`

- [ ] **Verify in Firebase Console**
  - [ ] Go to Firestore Database
  - [ ] See `products` collection
  - [ ] See 8 product documents

### Pre-Deployment Checklist

- [ ] **Environment Check**

  - [ ] `.env.production` has `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false`
  - [ ] All production Firebase credentials are set
  - [ ] Payment keys are production keys (not test)

- [ ] **Build Test**

  ```bash
  npm run build
  ```

  ✅ No build errors

- [ ] **Local Production Test**

  ```bash
  npm start
  ```

  - [ ] App starts successfully
  - [ ] Console shows: `🌐 Using production Firebase`
  - [ ] Products load from production database

- [ ] **Deploy Security Rules**
  ```bash
  firebase deploy --only firestore:rules
  ```

## 🔄 Switching Between Environments

### Switch to Development (Local)

- [ ] Edit `.env.local`:
  ```bash
  NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
  ```
- [ ] Restart Next.js: `npm run dev`
- [ ] Start emulator: `firebase emulators:start`
- [ ] Seed: `npm run seed:local`

### Switch to Production (Cloud)

- [ ] Edit `.env.production`:
  ```bash
  NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
  ```
- [ ] Build: `npm run build`
- [ ] Start: `npm start`

## 🐛 Troubleshooting Checklist

### Can't Connect to Emulator

- [ ] Emulator is running (`firebase emulators:start`)
- [ ] No port conflicts (check ports 8080, 9099, 4000)
- [ ] `.env.local` has correct emulator settings
- [ ] Restart Next.js after starting emulator

### No Products Showing

- [ ] Database is seeded (`npm run seed:local` or `npm run seed:prod`)
- [ ] Check browser console for errors
- [ ] View emulator UI (http://localhost:4000) to verify data
- [ ] Check network tab for failed requests

### Wrong Database Being Used

- [ ] Check `.env.local` or `.env.production`
- [ ] Verify `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` value
- [ ] Check browser console for connection message
- [ ] Restart Next.js after changing env vars

### Build Errors

- [ ] Run `npm install` to ensure all dependencies
- [ ] Check for TypeScript errors: `npm run lint`
- [ ] Verify all imports are correct
- [ ] Check Firebase config is valid

## 📊 Quick Status Check

Run this to verify your current setup:

```bash
echo "Environment Variables:"
grep "NEXT_PUBLIC_USE_FIREBASE_EMULATOR" .env.local
echo ""
echo "Firebase Tools Installed:"
firebase --version
echo ""
echo "Node Version:"
node --version
echo ""
echo "NPM Version:"
npm --version
```

## 🎯 Success Criteria

You've successfully set up the environment when:

✅ Development:

- Emulator UI shows data at http://localhost:4000
- App shows products at http://localhost:3000/products
- Console shows: "Connected to Firestore Emulator"

✅ Production:

- Firebase Console shows products collection
- Build completes without errors
- Console shows: "Using production Firebase"
- Products load from cloud database

## 📚 Next Steps After Setup

Once everything is checked:

1. [ ] Read [ENVIRONMENT-SETUP.md](../ENVIRONMENT-SETUP.md)
2. [ ] Explore [architecture-diagrams.md](./architecture-diagrams.md)
3. [ ] Start building features!
4. [ ] Test locally with emulator
5. [ ] Deploy to production when ready

---

**Need Help?** Check the troubleshooting sections in the documentation files.
