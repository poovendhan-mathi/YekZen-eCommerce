/**
 * Setup Test Users Script
 *
 * Creates test users in Firebase Auth for automated testing
 * Run this before running Playwright tests
 *
 * Usage:
 *   ts-node acceptance-tests/automation/scripts/setup-test-users.ts
 *   OR
 *   npm run setup-test-users
 */

import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Test users from fixtures
const testUsers = [
  {
    uid: "test-user-123",
    email: "test@yekzen.com",
    password: "Test@123456",
    displayName: "Test User",
    emailVerified: true,
  },
  {
    uid: "admin-user-123",
    email: "admin@yekzen.com",
    password: "Admin@123456",
    displayName: "Admin User",
    emailVerified: true,
  },
];

async function setupTestUsers() {
  try {
    console.log("🔧 Setting up test users in Firebase...\n");

    // Initialize Firebase Admin (for emulator or production)
    const useEmulator = process.env.USE_FIREBASE_EMULATOR !== "false";

    if (useEmulator) {
      console.log("📍 Using Firebase Emulator");
      process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
      process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
    }

    // Initialize app
    const app = initializeApp({
      projectId:
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "yekzen-ecommerce",
    });

    const auth = getAuth(app);

    // Create each test user
    for (const user of testUsers) {
      try {
        // Try to get user first
        try {
          await auth.getUserByEmail(user.email);
          console.log(`✅ User already exists: ${user.email}`);

          // Update user
          await auth.updateUser(user.uid, {
            displayName: user.displayName,
            emailVerified: user.emailVerified,
          });
          console.log(`   Updated: ${user.displayName}`);
        } catch (error: any) {
          if (error.code === "auth/user-not-found") {
            // Create new user
            await auth.createUser({
              uid: user.uid,
              email: user.email,
              password: user.password,
              displayName: user.displayName,
              emailVerified: user.emailVerified,
            });
            console.log(`✅ Created user: ${user.email}`);
            console.log(`   Name: ${user.displayName}`);
            console.log(`   Password: ${user.password}`);
          } else {
            throw error;
          }
        }
      } catch (error: any) {
        console.error(`❌ Error with ${user.email}:`, error.message);
      }
    }

    console.log("\n🎉 Test users setup complete!\n");
    console.log("📝 Test Credentials:");
    testUsers.forEach((user) => {
      console.log(`   ${user.email} / ${user.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to setup test users:", error);
    process.exit(1);
  }
}

// Run setup
setupTestUsers();
