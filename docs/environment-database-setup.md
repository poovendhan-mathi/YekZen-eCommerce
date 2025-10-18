# Environment-Based Database Configuration

This guide explains how to use **local database in development** and **production database in production**.

## 🏗️ Architecture

The app now supports two database modes:

1. **Development Mode**: Uses Firebase Local Emulator
   - Data stored locally on your machine
   - No cloud costs
   - Fast development and testing
   - Data resets when emulator stops

2. **Production Mode**: Uses Firebase Cloud
   - Data stored in Firebase Cloud Firestore
   - Persistent data
   - Real-time sync across devices
   - Production-ready

## 🚀 Quick Start

### Development Setup (Local Database)

1. **Install Firebase Tools** (one-time setup):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not done already):
   ```bash
   firebase init
   # Select: Firestore, Emulators
   # Choose existing project or create new one
   ```

4. **Configure Environment**:
   
   Your `.env.local` should have:
   ```bash
   NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
   ```

5. **Start Development**:

   **Option A: Start emulator and app separately**
   ```bash
   # Terminal 1: Start Firebase Emulator
   firebase emulators:start --only firestore,auth
   
   # Terminal 2: Start Next.js app
   npm run dev
   ```

   **Option B: Start both together** (requires `concurrently` package)
   ```bash
   npm install -D concurrently
   npm run dev:all
   ```

6. **Seed Local Database**:
   ```bash
   npm run seed:local
   ```

7. **Access**:
   - App: http://localhost:3000
   - Emulator UI: http://localhost:4000
   - Firestore Emulator: http://localhost:8080
   - Auth Emulator: http://localhost:9099

### Production Setup (Cloud Database)

1. **Create Production Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project for production
   - Enable Firestore Database

2. **Configure Production Environment**:
   
   Create `.env.production`:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_production_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=prod-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=prod-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=prod-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:production
   
   # IMPORTANT: Must be false for production
   NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
   
   NODE_ENV=production
   ```

3. **Seed Production Database**:
   ```bash
   npm run seed:prod
   ```

4. **Deploy**:
   ```bash
   npm run build
   npm start
   ```

## 📁 Configuration Files

### `.env.local` (Development)
```bash
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-dev-project
# ... other dev configs
```

### `.env.production` (Production)
```bash
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-prod-project
# ... other prod configs
```

### `firebase.json`
Configures emulator ports and settings:
- Firestore Emulator: Port 8080
- Auth Emulator: Port 9099
- Emulator UI: Port 4000

### `firestore.rules`
Security rules for Firestore (applies to both local and production)

## 🔧 How It Works

### Automatic Environment Detection

The `firebase/config.js` file automatically detects the environment:

```javascript
const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

if (useEmulator) {
  // Connect to local emulator
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log('🔧 Connected to Firestore Emulator');
} else {
  // Use production Firebase
  console.log('🌐 Using production Firebase');
}
```

### Environment Variables

| Variable | Development | Production |
|----------|-------------|------------|
| `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` | `true` | `false` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | dev-project | prod-project |
| Firebase credentials | Dev credentials | Prod credentials |

## 📦 NPM Scripts

```json
{
  "dev": "next dev",                      // Start Next.js dev server
  "dev:emulator": "firebase emulators:start --only firestore,auth",  // Start emulator only
  "dev:all": "concurrently \"npm run dev:emulator\" \"npm run dev\"", // Start both
  "seed:local": "node scripts/seedProducts.js",  // Seed local database
  "seed:prod": "NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false node scripts/seedProducts.js"  // Seed production
}
```

## 🔄 Switching Between Environments

### Switch to Local (Development)
1. Set in `.env.local`:
   ```bash
   NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
   ```
2. Start emulator: `firebase emulators:start`
3. Start app: `npm run dev`

### Switch to Production
1. Set in `.env.production`:
   ```bash
   NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
   ```
2. Build: `npm run build`
3. Start: `npm start`

## 🐛 Troubleshooting

### Emulator Connection Failed
```
Error: connect ECONNREFUSED localhost:8080
```
**Solution**: Start the Firebase emulator first:
```bash
firebase emulators:start
```

### Wrong Database in Production
```
Using emulator in production
```
**Solution**: Check `.env.production`:
```bash
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false  # Must be false!
```

### Data Not Persisting in Development
**Expected Behavior**: Emulator data is temporary and cleared when stopped.

**To persist data**: Use production Firebase or export/import emulator data:
```bash
# Export data
firebase emulators:export ./emulator-data

# Import data
firebase emulators:start --import=./emulator-data
```

### Can't See Data in Emulator UI
**Solution**: Open http://localhost:4000 in your browser while emulator is running.

## 📊 Monitoring

### Development (Emulator)
- **Emulator UI**: http://localhost:4000
- View all collections, documents, and operations in real-time
- Test security rules
- Clear data with one click

### Production (Cloud)
- **Firebase Console**: https://console.firebase.google.com/
- Navigate to: Firestore Database
- View collections, query data, monitor usage

## 🔒 Security

### Development
- Emulator uses local rules from `firestore.rules`
- No authentication required for testing
- Data is local only

### Production
- Rules from `firestore.rules` are deployed to Firebase
- Authentication enforced
- Data encrypted in transit and at rest

## 🎯 Best Practices

1. **Never commit `.env.local` or `.env.production`** (already in `.gitignore`)
2. **Use separate Firebase projects** for dev and production
3. **Test with emulator** before deploying to production
4. **Seed production database** only once with real data
5. **Monitor costs** in Firebase Console for production usage
6. **Deploy security rules** after testing in emulator:
   ```bash
   firebase deploy --only firestore:rules
   ```

## 📚 Resources

- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🎉 Summary

- **Development**: `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` → Local database
- **Production**: `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false` → Cloud database
- Switch by changing environment variable
- Emulator provides fast, free development experience
- Production uses real Firebase for persistent data
