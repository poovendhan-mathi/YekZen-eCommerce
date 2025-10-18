# Environment Database Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         YekZen eCommerce                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │
                    ┌────────────┴───────────┐
                    │                        │
             DEVELOPMENT                PRODUCTION
                    │                        │
                    ▼                        ▼
        ┌──────────────────────┐  ┌──────────────────────┐
        │   .env.local          │  │  .env.production     │
        │                       │  │                      │
        │ USE_EMULATOR=true     │  │ USE_EMULATOR=false   │
        └──────────┬────────────┘  └─────────┬────────────┘
                   │                          │
                   ▼                          ▼
        ┌──────────────────────┐  ┌──────────────────────┐
        │  Firebase Emulator    │  │  Firebase Cloud      │
        │  (localhost:8080)     │  │  (firestore.google) │
        │                       │  │                      │
        │  • Local data         │  │  • Cloud data        │
        │  • Fast & Free        │  │  • Persistent        │
        │  • Temp storage       │  │  • Global access     │
        │  • Dev/Test only      │  │  • Production ready  │
        └───────────────────────┘  └──────────────────────┘
```

## Data Flow

### Development Mode (Local Emulator)

```
┌─────────┐      ┌──────────────┐      ┌─────────────────┐
│ Browser │─────▶│  Next.js App │─────▶│ Firebase Emul.  │
│         │      │ (localhost:  │      │ (localhost:8080)│
│         │◀─────│     3000)    │◀─────│                 │
└─────────┘      └──────────────┘      └─────────────────┘
                                                │
                                                ▼
                                        ┌──────────────┐
                                        │ Local Disk   │
                                        │ Temp Storage │
                                        └──────────────┘
```

### Production Mode (Firebase Cloud)

```
┌─────────┐      ┌──────────────┐      ┌─────────────────┐
│ Browser │─────▶│  Next.js App │─────▶│ Firebase Cloud  │
│         │      │ (vercel.app) │      │ Firestore       │
│         │◀─────│              │◀─────│                 │
└─────────┘      └──────────────┘      └─────────────────┘
                                                │
                                                ▼
                                        ┌──────────────┐
                                        │ Cloud DB     │
                                        │ Persistent   │
                                        └──────────────┘
```

## Environment Variable Flow

```
.env.local / .env.production
         │
         ▼
NEXT_PUBLIC_USE_FIREBASE_EMULATOR
         │
         ├──────────┬──────────┐
         │          │          │
    if true    if false    if undefined
         │          │          │
         ▼          ▼          ▼
    Emulator    Cloud     Cloud (default)
  (localhost)  (Firebase)
```

## Configuration Files

```
YekZen-eCommerce/
├── .env.local                  # Dev config (USE_EMULATOR=true)
├── .env.production             # Prod config (USE_EMULATOR=false)
├── firebase.json               # Emulator ports & settings
├── firestore.rules             # Security rules (both envs)
├── firestore.indexes.json      # Database indexes
├── firebase/
│   └── config.js               # Auto-detects environment
└── scripts/
    └── seedProducts.js         # Seeds either DB based on env
```

## Command Workflow

### Development Workflow

```
1. npm install -D firebase-tools
         │
         ▼
2. firebase emulators:start
         │
         ▼
3. npm run dev (new terminal)
         │
         ▼
4. npm run seed:local
         │
         ▼
5. Open http://localhost:3000
         │
         ▼
6. View data at http://localhost:4000
```

### Production Workflow

```
1. Create Firebase project
         │
         ▼
2. Configure .env.production
         │
         ▼
3. npm run seed:prod
         │
         ▼
4. npm run build
         │
         ▼
5. npm start (or deploy)
```

## Feature Comparison

| Feature                  | Development (Emulator)  | Production (Cloud)      |
|--------------------------|-------------------------|-------------------------|
| **Data Persistence**     | ❌ Temporary            | ✅ Permanent            |
| **Cost**                 | ✅ Free                 | 💰 Pay-as-you-go        |
| **Speed**                | ⚡ Very Fast            | 🌐 Network dependent    |
| **Internet Required**    | ❌ No                   | ✅ Yes                  |
| **Setup Complexity**     | 🟢 Simple               | 🟡 Medium               |
| **Multi-device Access**  | ❌ No                   | ✅ Yes                  |
| **Debugging Tools**      | ✅ Emulator UI          | ✅ Firebase Console     |
| **Security Rules Test**  | ✅ Yes                  | ✅ Yes                  |
| **Real-time Sync**       | ✅ Local only           | ✅ Global               |

## Port Configuration

```
┌─────────────────────────────────────┐
│  Port 3000/3001  │  Next.js App     │
├──────────────────┼──────────────────┤
│  Port 4000       │  Emulator UI     │
├──────────────────┼──────────────────┤
│  Port 8080       │  Firestore       │
├──────────────────┼──────────────────┤
│  Port 9099       │  Auth Emulator   │
└─────────────────────────────────────┘
```

## Environment Detection Logic

```javascript
// firebase/config.js

const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

if (useEmulator && typeof window !== 'undefined') {
  // CLIENT-SIDE: Connect to emulator
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log('🔧 Using Local Emulator');
} else if (useEmulator) {
  // SERVER-SIDE: Emulator enabled but can't connect
  console.log('⚠️ Emulator enabled but server-side');
} else {
  // PRODUCTION: Use Firebase Cloud
  console.log('🌐 Using Firebase Cloud');
}
```

## Switching Environments

### Switch to Development (Local)

```bash
# 1. Edit .env.local
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true

# 2. Start emulator
firebase emulators:start

# 3. Start app (new terminal)
npm run dev
```

### Switch to Production (Cloud)

```bash
# 1. Edit .env.production
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false

# 2. Build and start
npm run build
npm start
```

## Quick Reference Card

```
╔═══════════════════════════════════════════════════════════╗
║                    QUICK REFERENCE                        ║
╠═══════════════════════════════════════════════════════════╣
║  Development Setup:                                       ║
║  • NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true                 ║
║  • firebase emulators:start                               ║
║  • npm run dev                                            ║
║  • npm run seed:local                                     ║
║                                                           ║
║  Production Setup:                                        ║
║  • NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false                ║
║  • npm run seed:prod                                      ║
║  • npm run build && npm start                             ║
║                                                           ║
║  Access Points:                                           ║
║  • App: http://localhost:3000                             ║
║  • Emulator UI: http://localhost:4000                     ║
║  • Production: https://your-domain.com                    ║
╚═══════════════════════════════════════════════════════════╝
```
