# Development vs Production Database - Quick Comparison

## 🎯 Summary

| Aspect                   | Development (Emulator)                   | Production (Firebase Cloud)               |
| ------------------------ | ---------------------------------------- | ----------------------------------------- |
| **Environment Variable** | `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` | `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false` |
| **Database Location**    | Your Computer (localhost:8080)           | Firebase Cloud                            |
| **Command to Start**     | `firebase emulators:start`               | N/A (always available)                    |
| **Seed Command**         | `npm run seed:local`                     | `npm run seed:prod`                       |
| **Data Persistence**     | Temporary (cleared when stopped)         | Permanent                                 |
| **Cost**                 | 100% Free                                | Pay for usage                             |
| **Internet Required**    | No                                       | Yes                                       |
| **Access URL**           | http://localhost:4000 (Emulator UI)      | https://console.firebase.google.com       |

## 🔧 Setup Commands

### Development (Local Database)

```bash
# 1. Install Firebase Tools
npm install -D firebase-tools

# 2. Configure .env.local
echo "NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true" >> .env.local

# 3. Start Emulator (Terminal 1)
firebase emulators:start --only firestore,auth

# 4. Start Next.js (Terminal 2)
npm run dev

# 5. Seed Database
npm run seed:local

# 6. View Data
open http://localhost:4000
```

### Production (Cloud Database)

```bash
# 1. Configure .env.production
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-prod-project
# ... other production Firebase credentials

# 2. Seed Database
npm run seed:prod

# 3. Build & Deploy
npm run build
npm start
```

## 📊 When to Use Which

### Use Development (Emulator) When:

- ✅ Building new features
- ✅ Testing functionality
- ✅ Running unit/integration tests
- ✅ Learning and experimenting
- ✅ Working offline
- ✅ Want instant data resets
- ✅ Need fast iteration

### Use Production (Cloud) When:

- ✅ Deploying to users
- ✅ Need persistent data
- ✅ Testing real-world performance
- ✅ Sharing with stakeholders
- ✅ Need multi-device access
- ✅ Ready for launch

## 🚀 My Recommendation

**Best Practice Workflow:**

1. **Always develop with local emulator** (fast, free, safe)
2. **Test thoroughly locally** before touching production
3. **Seed production once** with real data
4. **Deploy to production** only when ready

## 🎬 Quick Start (Choose One)

### Option A: Start Everything Together

```bash
# Install dependencies
npm install -D concurrently firebase-tools

# Start both emulator and Next.js
npm run dev:all
```

### Option B: Manual Control (Recommended)

```bash
# Terminal 1: Start emulator
firebase emulators:start

# Terminal 2: Start app
npm run dev
```

## 🔍 How to Verify Which Database You're Using

Check your browser console or terminal logs:

```
🔧 Connected to Firestore Emulator at localhost:8080  ← Using LOCAL
🌐 Using production Firebase                          ← Using PRODUCTION
```

## ⚠️ Important Notes

1. **Never mix environments**: Don't accidentally seed production while testing
2. **Emulator data is temporary**: It's deleted when you stop the emulator
3. **Use separate Firebase projects**: One for dev, one for production
4. **Check your .env file**: Make sure `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` is set correctly

## 📝 Checklist

### Before Developing

- [ ] `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` in `.env.local`
- [ ] Firebase emulator is running
- [ ] Local database is seeded
- [ ] Can see data at http://localhost:4000

### Before Deploying to Production

- [ ] `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false` in `.env.production`
- [ ] Production Firebase project exists
- [ ] Production database is seeded
- [ ] Tested build locally (`npm run build`)
- [ ] Security rules are deployed

## 🆘 Common Issues

**Issue**: App shows "No products found"
**Fix**:

- Development: Run `npm run seed:local`
- Production: Run `npm run seed:prod`

**Issue**: Can't connect to emulator
**Fix**: Make sure emulator is running: `firebase emulators:start`

**Issue**: Using wrong database
**Fix**: Check `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` in your `.env` file

## 🔗 Related Documentation

- [Full Setup Guide](./environment-database-setup.md)
- [Architecture Diagrams](./architecture-diagrams.md)
- [Database Setup](./database-setup.md)
