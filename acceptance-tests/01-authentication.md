# 01 - Authentication & User Management Testing

**Module**: Authentication  
**Total Scenarios**: 35  
**Priority**: 🔴 Critical  
**Status**: ⏳ Pending

---

## 📊 Progress Tracker

- **Total**: 35 scenarios
- **Completed**: 0
- **Passed**: 0
- **Failed**: 0
- **Blocked**: 0

---

## 🎯 Test Scenarios

### A. User Registration (Sign Up)

#### A1: Successful Email Registration

- **Status**: ⏳
- **Priority**: Critical
- **Steps**:
  1. Navigate to `/signup`
  2. Enter valid email: `newuser@test.com`
  3. Enter valid password: `Test123!@#`
  4. Enter matching confirm password: `Test123!@#`
  5. Click "Sign Up" button
- **Expected Result**:
  - Account created successfully
  - User redirected to home page or profile
  - Welcome toast notification appears
  - User is logged in automatically
  - Email verification sent (if enabled)
- **Actual Result**: _[To be filled]_
- **Notes**: _[Any observations]_

---

#### A2: Email Validation - Invalid Format

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Navigate to `/signup`
  2. Enter invalid email: `invalidemail`
  3. Try to submit form
- **Expected Result**:
  - Error message: "Please enter a valid email address"
  - Submit button disabled OR form shows validation error
  - Red border on email field
- **Actual Result**: _[To be filled]_

---

#### A3: Email Validation - Empty Field

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Navigate to `/signup`
  2. Leave email field empty
  3. Enter password
  4. Try to submit
- **Expected Result**:
  - Error: "Email is required"
  - Cannot submit form
- **Actual Result**: _[To be filled]_

---

#### A4: Password Validation - Too Short

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Navigate to `/signup`
  2. Enter valid email
  3. Enter password: `12345` (less than 6 chars)
  4. Try to submit
- **Expected Result**:
  - Error: "Password must be at least 6 characters"
  - Submit disabled/blocked
- **Actual Result**: _[To be filled]_

---

#### A5: Password Validation - Mismatch

- **Status**: ⏳
- **Priority**: Critical
- **Steps**:
  1. Navigate to `/signup`
  2. Enter valid email
  3. Enter password: `Test123!@#`
  4. Enter confirm password: `Different123!`
  5. Try to submit
- **Expected Result**:
  - Error: "Passwords do not match"
  - Highlight both password fields
  - Cannot submit
- **Actual Result**: _[To be filled]_

---

#### A6: Duplicate Email Registration

- **Status**: ⏳
- **Priority**: Critical
- **Steps**:
  1. Register with email: `test@yekzen.com`
  2. Sign out
  3. Try to register again with same email
- **Expected Result**:
  - Error: "Email already in use" or similar
  - User not created
  - Suggest login instead
- **Actual Result**: _[To be filled]_

---

#### A7: Social Login - Google (If Implemented)

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Navigate to `/signup`
  2. Click "Sign up with Google"
  3. Complete Google OAuth flow
- **Expected Result**:
  - Google popup appears
  - After authorization, user account created
  - Redirected to home page
  - User logged in
- **Actual Result**: _[To be filled]_
- **Notes**: Requires Google account for testing

---

#### A8: Form Accessibility - Keyboard Navigation

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Navigate to `/signup`
  2. Use Tab key to navigate through form
  3. Fill fields using keyboard only
  4. Submit with Enter key
- **Expected Result**:
  - All fields focusable in logical order
  - Focus indicators visible
  - Can submit with Enter
  - Screen reader compatible
- **Actual Result**: _[To be filled]_

---

### B. User Login (Sign In)

#### B1: Successful Login with Valid Credentials

- **Status**: ⏳
- **Priority**: Critical
- **Steps**:
  1. Navigate to `/signin`
  2. Enter email: `test@yekzen.com`
  3. Enter password: `Test123!@#`
  4. Click "Sign In"
- **Expected Result**:
  - Login successful
  - Redirected to intended page or home
  - User menu shows logged-in state
  - Toast: "Welcome back!"
- **Actual Result**: _[To be filled]_

---

#### B2: Login with Wrong Password

- **Status**: ⏳
- **Priority**: Critical
- **Steps**:
  1. Navigate to `/signin`
  2. Enter correct email
  3. Enter wrong password: `WrongPassword123`
  4. Click "Sign In"
- **Expected Result**:
  - Error: "Invalid email or password"
  - User remains on login page
  - Password field cleared
  - No account lockout on first attempt
- **Actual Result**: _[To be filled]_

---

#### B3: Login with Non-Existent Email

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Navigate to `/signin`
  2. Enter email that doesn't exist: `nonexistent@test.com`
  3. Enter any password
  4. Click "Sign In"
- **Expected Result**:
  - Error: "Invalid email or password" (don't reveal which)
  - Stay on login page
- **Actual Result**: _[To be filled]_

---

#### B4: Login with Empty Fields

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Navigate to `/signin`
  2. Leave email and password empty
  3. Click "Sign In"
- **Expected Result**:
  - Validation errors show for both fields
  - Cannot submit
- **Actual Result**: _[To be filled]_

---

#### B5: Remember Me Functionality (If Implemented)

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Login with "Remember Me" checked
  2. Close browser completely
  3. Reopen and visit site
- **Expected Result**:
  - User still logged in
  - Session persists
- **Actual Result**: _[To be filled]_

---

#### B6: Social Login - Google Sign In

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Navigate to `/signin`
  2. Click "Sign in with Google"
  3. Select Google account
- **Expected Result**:
  - Google OAuth flow completes
  - User logged in
  - Redirected appropriately
- **Actual Result**: _[To be filled]_

---

#### B7: Login Redirect - Return to Intended Page

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. While logged out, try to access `/profile`
  2. System redirects to `/signin`
  3. Login successfully
- **Expected Result**:
  - After login, redirected to `/profile` (original destination)
  - Not just homepage
- **Actual Result**: _[To be filled]_

---

#### B8: Login Loading State

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Navigate to `/signin`
  2. Enter credentials
  3. Click "Sign In"
  4. Observe UI during authentication
- **Expected Result**:
  - Loading spinner appears
  - Button shows "Signing in..." or disabled
  - Cannot resubmit while loading
- **Actual Result**: _[To be filled]_

---

### C. User Logout

#### C1: Successful Logout

- **Status**: ⏳
- **Priority**: Critical
- **Steps**:
  1. Login as test user
  2. Click user menu
  3. Click "Logout" or "Sign Out"
- **Expected Result**:
  - User logged out
  - Redirected to home page or login
  - User menu changes to "Sign In"
  - Cart data persists (localStorage)
  - Toast: "Logged out successfully"
- **Actual Result**: _[To be filled]_

---

#### C2: Logout from Multiple Tabs

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Login in Tab 1
  2. Open Tab 2 (same site, same user)
  3. Logout from Tab 1
  4. Check Tab 2
- **Expected Result**:
  - Both tabs show logged out state
  - Session cleared everywhere
- **Actual Result**: _[To be filled]_

---

#### C3: Access Protected Route After Logout

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Login
  2. Navigate to `/profile`
  3. Logout
  4. Try to access `/profile` again
- **Expected Result**:
  - Redirected to `/signin`
  - Cannot access protected content
- **Actual Result**: _[To be filled]_

---

### D. Password Reset (If Implemented)

#### D1: Request Password Reset - Valid Email

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Navigate to `/signin`
  2. Click "Forgot Password?"
  3. Enter registered email: `test@yekzen.com`
  4. Submit
- **Expected Result**:
  - Success message: "Password reset email sent"
  - Email received (check inbox)
  - Can click reset link in email
- **Actual Result**: _[To be filled]_

---

#### D2: Password Reset - Invalid Email

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Navigate to forgot password page
  2. Enter non-existent email
  3. Submit
- **Expected Result**:
  - Generic message (don't reveal if email exists)
  - "If email exists, reset link sent"
- **Actual Result**: _[To be filled]_

---

#### D3: Complete Password Reset Flow

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Request password reset
  2. Click link in email
  3. Enter new password
  4. Confirm new password
  5. Submit
  6. Try to login with new password
- **Expected Result**:
  - Password updated successfully
  - Can login with new password
  - Old password no longer works
  - Redirected to login page
- **Actual Result**: _[To be filled]_

---

### E. Session Management

#### E1: Session Timeout (If Implemented)

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Login
  2. Wait for session timeout (e.g., 30 mins)
  3. Try to perform action
- **Expected Result**:
  - Session expired message
  - Redirected to login
  - Can re-login
- **Actual Result**: _[To be filled]_

---

#### E2: Session Persistence After Page Reload

- **Status**: ⏳
- **Priority**: Critical
- **Steps**:
  1. Login successfully
  2. Reload the page (F5)
  3. Check login status
- **Expected Result**:
  - User still logged in
  - Session persists
  - No re-login required
- **Actual Result**: _[To be filled]_

---

#### E3: Concurrent Login Sessions

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Login on Desktop
  2. Login on Mobile (same account)
  3. Check if both stay logged in
- **Expected Result**:
  - Both devices remain logged in OR
  - Desktop logs out (if single session only)
  - Behavior documented
- **Actual Result**: _[To be filled]_

---

### F. Account Security

#### F1: Prevent SQL Injection in Login

- **Status**: ⏳
- **Priority**: Critical
- **Steps**:
  1. Navigate to `/signin`
  2. Enter SQL injection attempt in email: `' OR '1'='1`
  3. Enter password
  4. Submit
- **Expected Result**:
  - Login fails safely
  - No error exposing database
  - Treated as invalid email
- **Actual Result**: _[To be filled]_

---

#### F2: XSS Prevention in Registration

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Navigate to `/signup`
  2. Enter email with script: `<script>alert('XSS')</script>@test.com`
  3. Try to register
- **Expected Result**:
  - Input sanitized
  - No script execution
  - Validation error if invalid format
- **Actual Result**: _[To be filled]_

---

#### F3: Password Not Exposed in Browser DevTools

- **Status**: ⏳
- **Priority**: High
- **Steps**:
  1. Open DevTools Network tab
  2. Login
  3. Check request payload
- **Expected Result**:
  - Password sent over HTTPS
  - Not visible in plain text in logs
  - Request body encrypted
- **Actual Result**: _[To be filled]_

---

### G. User Interface & UX

#### G1: Error Message Visibility

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Trigger various errors (wrong password, etc.)
  2. Check error display
- **Expected Result**:
  - Errors clearly visible
  - Red color or warning icon
  - Positioned near relevant field
  - Accessible to screen readers
- **Actual Result**: _[To be filled]_

---

#### G2: Form Auto-Complete Support

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Start typing in login form
  2. Check browser auto-complete
- **Expected Result**:
  - Browsers suggest saved credentials
  - autocomplete attributes set correctly
  - Email and password recognized
- **Actual Result**: _[To be filled]_

---

#### G3: Password Visibility Toggle

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Navigate to login/signup
  2. Enter password
  3. Click eye icon (if exists)
- **Expected Result**:
  - Password visible as plain text
  - Icon changes to "hide"
  - Click again to hide
- **Actual Result**: _[To be filled]_

---

#### G4: Mobile Responsiveness - Login Form

- **Status**: ⏳
- **Priority**: Medium
- **Steps**:
  1. Open `/signin` on mobile device (or DevTools mobile view)
  2. Test form interaction
- **Expected Result**:
  - Form fits screen width
  - Fields easy to tap
  - No horizontal scroll
  - Keyboard doesn't cover inputs
- **Actual Result**: _[To be filled]_

---

#### G5: Loading States During Authentication

- **Status**: ⏳
- **Priority**: Low
- **Steps**:
  1. Slow down network (DevTools throttling)
  2. Try to login
  3. Observe UI
- **Expected Result**:
  - Spinner or loading indicator
  - Button disabled
  - Clear feedback to user
- **Actual Result**: _[To be filled]_

---

## 🐛 Issues Found

| Issue # | Test ID | Description     | Severity | Status |
| ------- | ------- | --------------- | -------- | ------ |
| -       | -       | _No issues yet_ | -        | -      |

---

## 📝 Notes

- Test with both Email/Password and Social OAuth
- Verify Firebase Auth integration
- Check error handling for network issues
- Test on multiple browsers (Chrome, Firefox, Safari)
- Verify accessibility (WCAG 2.1 AA)

---

**Last Updated**: October 30, 2025  
**Tested By**: _[Your name]_  
**Environment**: Development
