/**
 * Test Users Fixture
 *
 * Centralized test user data for authentication tests
 *
 * Location: /acceptance-tests/automation/fixtures/test-users.ts
 * Updated in: AUTOMATION-TRACKER.md
 */

export interface TestUser {
  email: string;
  password: string;
  name: string;
  role?: "user" | "admin";
}

export const testUsers = {
  /**
   * Valid regular user for testing
   */
  validUser: {
    email: "user@yekzen.com",
    password: "user123456",
    name: "Test User",
    role: "user" as const,
  },

  /**
   * Admin user for testing admin features
   */
  adminUser: {
    email: "admin@yekzen.com",
    password: "admin123456",
    name: "Admin User",
    role: "admin" as const,
  },

  /**
   * Invalid user for negative testing
   */
  invalidUser: {
    email: "invalid@example.com",
    password: "WrongPassword123",
    name: "Invalid User",
  },

  /**
   * User with weak password
   */
  weakPasswordUser: {
    email: "weak@yekzen.com",
    password: "123",
    name: "Weak Password User",
  },

  /**
   * User with invalid email format
   */
  invalidEmailUser: {
    email: "invalid-email",
    password: "ValidPass123!",
    name: "Invalid Email User",
  },

  /**
   * New user for signup testing
   */
  newUser: {
    email: "newuser@yekzen.com",
    password: "NewUser123!@#",
    name: "New User",
  },

  /**
   * User for password reset testing
   */
  resetPasswordUser: {
    email: "reset@yekzen.com",
    password: "OldPassword123!",
    name: "Reset Password User",
  },
};

/**
 * Generate random user for testing
 */
export function generateRandomUser(): TestUser {
  const timestamp = Date.now();
  return {
    email: `testuser${timestamp}@yekzen.com`,
    password: "Test123!@#",
    name: `Test User ${timestamp}`,
    role: "user",
  };
}

/**
 * Generate multiple random users
 */
export function generateRandomUsers(count: number): TestUser[] {
  return Array.from({ length: count }, () => generateRandomUser());
}

/**
 * Valid email addresses for testing
 */
export const validEmails = [
  "user@yekzen.com",
  "test.user@yekzen.com",
  "test+tag@yekzen.com",
  "test_user@yekzen.com",
];

/**
 * Invalid email addresses for testing
 */
export const invalidEmails = [
  "invalid",
  "invalid@",
  "@yekzen.com",
  "user@",
  "user @yekzen.com",
  "user@yekzen",
  "",
];

/**
 * Valid passwords for testing
 */
export const validPasswords = [
  "ValidPass123!",
  "Strong@Pass123",
  "Secure#2023",
  "Test!@#123",
];

/**
 * Weak/invalid passwords for testing
 */
export const weakPasswords = [
  "123",
  "password",
  "abc",
  "12345678",
  "Password", // missing numbers/special chars
  "password123", // missing uppercase/special chars
  "PASSWORD123", // missing lowercase/special chars
];
