# 🎯 Quick Start Guide for Testers

**YekZen eCommerce - Acceptance Testing**  
**Last Updated**: October 30, 2025

---

## ⚡ TL;DR - Get Testing Fast

```bash
# 1. Start the app
./start-dev.sh

# 2. Open test file
# Start with acceptance-tests/01-authentication.md

# 3. Follow scenarios, mark progress
# Update ⏳ to ✅ or ❌

# 4. Report issues in test file
```

---

## 🗺️ Test Files Overview

| Priority | File                    | What It Tests                      | Est. Time |
| -------- | ----------------------- | ---------------------------------- | --------- |
| **🔥 1** | `01-authentication.md`  | Login, signup, sessions            | 2 hours   |
| **🔥 2** | `03-shopping-cart.md`   | Add/remove items, cart persistence | 1.5 hours |
| **🔥 3** | `04-checkout.md`        | Checkout flow, forms, validation   | 2 hours   |
| **🔥 4** | `05-payment.md`         | Stripe, Razorpay integration       | 1.5 hours |
| **🔥 5** | `06-orders.md`          | Order history, tracking, status    | 1.5 hours |
| 6        | `02-product-catalog.md` | Browse, filter, sort products      | 2 hours   |
| 7        | `07-user-profile.md`    | Profile editing, preferences       | 1 hour    |
| 8        | `08-admin-dashboard.md` | Admin CRUD, analytics              | 2.5 hours |
| 9        | `09-search-filters.md`  | Search, filters, sorting           | 1 hour    |
| 10       | `10-responsive.md`      | Mobile, tablet, desktop views      | 2 hours   |
| 11       | `11-performance.md`     | Load times, Lighthouse scores      | 1.5 hours |
| 12       | `12-edge-cases.md`      | Error handling, edge scenarios     | 1.5 hours |

**Total Testing Time**: ~20 hours

---

## 🚀 Setup (5 minutes)

### One-Command Start

```bash
cd /path/to/YekZen-eCommerce
./start-dev.sh
```

This automatically:

- ✅ Starts Firebase emulators
- ✅ Seeds test data
- ✅ Launches dev server

### Access Points

- **App**: http://localhost:3000
- **Firebase UI**: http://localhost:4000
- **Firestore**: localhost:8080
- **Auth**: localhost:9099

### Test Accounts

**Regular User**:

- Email: `test@yekzen.com`
- Password: `Test123!@#`

**Admin User**:

- Email: `admin@yekzen.com`
- Password: `Admin123!@#`

**Test Cards (Stripe)**:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)

---

## 📝 How to Test

### Step 1: Open Test File

```bash
# Example: Start with authentication
open acceptance-tests/01-authentication.md
```

### Step 2: Follow Scenarios

Each scenario looks like this:

```markdown
#### Scenario 1.1: User Login with Valid Credentials

**Priority**: High
**Status**: ⏳ Pending

**Steps**:

1. Navigate to `/signin`
2. Enter email: test@yekzen.com
3. Enter password: Test123!@#
4. Click "Sign In"

**Expected Results**:

- ✅ User is logged in
- ✅ Redirected to homepage
- ✅ User name shown in header

**Actual Results**:
_Document what you actually see_
```

### Step 3: Update Status

Change the status as you test:

- `⏳ Pending` → `✅ Passed` (if test passes)
- `⏳ Pending` → `❌ Failed` (if test fails)
- `⏳ Pending` → `⚠️ Blocked` (if can't test)

### Step 4: Document Results

Fill in "Actual Results" section:

```markdown
**Actual Results**:

- User logged in successfully ✅
- Redirected to homepage ✅
- Username "Test User" displayed in header ✅
- No console errors ✅

**Status**: ✅ Passed
```

OR if issues found:

```markdown
**Actual Results**:

- Login successful but redirected to /dashboard instead of homepage ⚠️
- Console error: "Warning: React key prop missing" ⚠️

**Status**: ❌ Failed
**Issue**: Incorrect redirect URL + React warning
```

---

## 🐛 Reporting Issues

### In Test File

```markdown
## 🐛 Issues Found

### Critical Issues

1. **Login redirects to wrong page**
   - Expected: /
   - Actual: /dashboard
   - Test: Scenario 1.1
   - Severity: Medium

### Minor Issues

1. **React key warning in console**
   - Location: User menu component
   - Test: Scenario 1.1
   - Severity: Low
```

### Create GitHub Issue

For critical/major issues:

1. Go to GitHub repo
2. Create new issue
3. Use template:

```markdown
**Title**: [BUG] Login redirects to wrong page

**Description**:
After successful login, user is redirected to /dashboard instead of homepage.

**Steps to Reproduce**:

1. Go to /signin
2. Enter valid credentials
3. Click "Sign In"

**Expected**: Redirect to /
**Actual**: Redirect to /dashboard

**Test Reference**: acceptance-tests/01-authentication.md - Scenario 1.1
**Priority**: Medium
**Browser**: Chrome 119
```

---

## 🎯 Testing Tips

### Do's ✅

- ✅ Test in order (follow scenario numbers)
- ✅ Clear browser cache between major modules
- ✅ Test on multiple browsers (Chrome, Firefox, Safari)
- ✅ Test on mobile/tablet (use DevTools or real devices)
- ✅ Document everything (even small issues)
- ✅ Take screenshots of bugs
- ✅ Check browser console for errors

### Don'ts ❌

- ❌ Skip High Priority tests
- ❌ Test with real payment cards
- ❌ Modify test data mid-testing
- ❌ Test in production environment
- ❌ Ignore console warnings
- ❌ Rush through scenarios

---

## 🔧 Common Issues & Solutions

### Issue: "Firebase emulator not running"

```bash
# Solution:
npm run emulator
# Wait for "All emulators ready!"
```

### Issue: "No products showing"

```bash
# Solution: Reseed database
npm run seed
```

### Issue: "Login not working"

```bash
# Solution: Check Firebase Auth emulator
# Open http://localhost:4000
# Verify test users exist
```

### Issue: "Payment fails"

```bash
# Solution: Use test cards only
# Success: 4242 4242 4242 4242
# Check Stripe test mode is enabled
```

---

## 📊 Progress Tracking

### Daily Checklist

```markdown
## Testing Session: [Date]

**Tester**: Your Name
**Time**: 9:00 AM - 12:00 PM

**Completed**:

- [x] 01-authentication.md (35/35 scenarios)
- [x] 03-shopping-cart.md (30/30 scenarios)
- [ ] 04-checkout.md (15/25 scenarios) - IN PROGRESS

**Issues Found**: 3

- 2 Medium priority
- 1 Low priority

**Next Session**:

- Complete 04-checkout.md
- Start 05-payment.md
```

### Update Main README

After completing a module, update `acceptance-tests/README.md`:

```markdown
| Module         | Total | Passed | Failed | Blocked | Progress |
| -------------- | ----- | ------ | ------ | ------- | -------- |
| Authentication | 35    | 33     | 2      | 0       | 94%      |
```

---

## 🎨 Browser Testing Matrix

Test critical flows on:

| Browser        | Desktop | Mobile | Priority |
| -------------- | ------- | ------ | -------- |
| Chrome         | ✅      | ✅     | High     |
| Firefox        | ✅      | ✅     | High     |
| Safari         | ✅      | ✅     | High     |
| Edge           | ✅      | -      | Medium   |
| Chrome Android | -       | ✅     | High     |
| Safari iOS     | -       | ✅     | High     |

---

## 📱 Device Testing

### Desktop Resolutions

- 1920x1080 (Full HD) - Standard
- 1366x768 (Laptop) - Test
- 2560x1440 (2K) - Optional

### Mobile Devices

Use DevTools or real devices:

- iPhone 12/13/14 (390x844)
- iPhone SE (375x667)
- Samsung Galaxy S21 (360x800)
- iPad (768x1024)

---

## ⏱️ Recommended Testing Schedule

### Week 1: Core Functionality (High Priority)

**Day 1-2**: Authentication (2 hours)
**Day 2-3**: Shopping Cart (1.5 hours)
**Day 3-4**: Checkout (2 hours)
**Day 4-5**: Payment (1.5 hours)
**Day 5**: Orders (1.5 hours)

### Week 2: Secondary Features

**Day 1**: Product Catalog (2 hours)
**Day 2**: User Profile (1 hour)
**Day 3-4**: Admin Dashboard (2.5 hours)
**Day 5**: Search & Filters (1 hour)

### Week 3: Quality & Edge Cases

**Day 1-2**: Responsive Design (2 hours)
**Day 3**: Performance (1.5 hours)
**Day 4**: Edge Cases (1.5 hours)
**Day 5**: Regression testing & retests

---

## 🎓 Testing Best Practices

### Before Each Session

1. Pull latest code
2. Restart dev environment
3. Clear browser cache
4. Review previous session notes

### During Testing

1. Follow scenarios exactly as written
2. Note any deviations from expected results
3. Take screenshots of issues
4. Record console errors
5. Test both happy path and error cases

### After Each Session

1. Update test file statuses
2. Create GitHub issues for bugs
3. Update progress tracker
4. Communicate findings to team
5. Plan next testing session

---

## 📞 Need Help?

### Documentation

- Main README: `/README.md`
- Development Guide: `/DEVELOPMENT-COMPLETE.md`
- Test README: `/acceptance-tests/README.md`

### Team Contacts

- Dev Team: Create GitHub issue
- QA Lead: Check team directory
- Project Manager: Check team directory

---

## ✅ Success Criteria

You're done when:

- ✅ All 280 scenarios executed
- ✅ All High Priority tests passed
- ✅ 95%+ Medium Priority tests passed
- ✅ All issues documented
- ✅ GitHub issues created for failures
- ✅ Sign-off completed in each test file

---

**Happy Testing! 🚀**

**Remember**: Quality over speed. Thorough testing saves production bugs!
