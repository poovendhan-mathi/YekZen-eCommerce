# 🚀 Quick Start: Local vs Production Database

## TL;DR

- **Development (Local Database)**: Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` in `.env.local`
- **Production (Cloud Database)**: Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false` in `.env.production`

## 📋 Setup Steps

### 1. Install Dependencies

```bash
npm install --save-dev concurrently firebase-tools
```

### 2. Configure Development (Local Database)

Edit your `.env.local`:

```bash
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXT_PUBLIC_FIREBASE_EMULATOR_HOST=localhost
NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT=8080
NEXT_PUBLIC_AUTH_EMULATOR_PORT=9099
```

### 3. Start Development with Local Database

**Option A: Manual (Two Terminals)**

Terminal 1 - Start Firebase Emulator:
```bash
firebase emulators:start --only firestore,auth
```

Terminal 2 - Start Next.js:
```bash
npm run dev
```

**Option B: Automatic (One Command)**

```bash
npm run dev:all
```

This runs both the emulator and Next.js together.

### 4. Seed Local Database

```bash
npm run seed:local
```

### 5. View Your Local Data

- **App**: http://localhost:3000
- **Emulator UI**: http://localhost:4000 (view database data here)

## 🌐 Production Setup

### 1. Create `.env.production`

```bash
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=prod-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=prod-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=prod-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc
```

### 2. Seed Production Database

```bash
npm run seed:prod
```

### 3. Build and Deploy

```bash
npm run build
npm start
```

## 🎯 How It Works

The app automatically detects which database to use based on `NEXT_PUBLIC_USE_FIREBASE_EMULATOR`:

- `true` → Uses local Firebase Emulator (dev)
- `false` → Uses Firebase Cloud (production)

## 🔧 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js only |
| `npm run dev:emulator` | Start Firebase Emulator only |
| `npm run dev:all` | Start both emulator + Next.js |
| `npm run seed:local` | Seed local database |
| `npm run seed:prod` | Seed production database |

## 📁 Important Files

- `.env.local` → Development config (local database)
- `.env.production` → Production config (cloud database)
- `firebase.json` → Emulator configuration
- `firestore.rules` → Database security rules

## ✅ Checklist

### Development Setup
- [ ] Install: `npm install -D concurrently firebase-tools`
- [ ] Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` in `.env.local`
- [ ] Run: `firebase emulators:start`
- [ ] Run: `npm run dev`
- [ ] Seed: `npm run seed:local`
- [ ] Visit: http://localhost:4000 (emulator UI)

### Production Setup
- [ ] Create Firebase production project
- [ ] Create `.env.production` with production credentials
- [ ] Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false`
- [ ] Seed: `npm run seed:prod`
- [ ] Build: `npm run build`
- [ ] Deploy: `npm start`

## 🐛 Troubleshooting

**Problem**: "Error: connect ECONNREFUSED localhost:8080"
**Solution**: Start Firebase emulator first: `firebase emulators:start`

**Problem**: Using wrong database
**Solution**: Check environment variable `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` in your `.env` file

**Problem**: Can't install firebase-tools
**Solution**: 
```bash
# Install globally instead
npm install -g firebase-tools

# Or use npx
npx firebase emulators:start
```

## 📚 More Info

See detailed documentation: `/docs/environment-database-setup.md`
