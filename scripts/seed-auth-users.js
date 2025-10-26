// Script to seed test users into Firebase Auth Emulator
// Run this with: node scripts/seed-auth-users.js

const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  connectAuthEmulator,
  updateProfile,
} = require("firebase/auth");

// Firebase config for emulator
const firebaseConfig = {
  projectId: "demo-no-project",
  apiKey: "demo-api-key",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Connect to emulator
connectAuthEmulator(auth, "http://localhost:9099", {
  disableWarnings: true,
});

// Test users to create
const testUsers = [
  {
    email: "test@example.com",
    password: "test123",
    displayName: "Test User",
  },
  {
    email: "admin@yekzen.com",
    password: "admin123",
    displayName: "Admin User",
  },
  {
    email: "user@yekzen.com",
    password: "user123",
    displayName: "Regular User",
  },
  {
    email: "demo@demo.com",
    password: "demo123",
    displayName: "Demo User",
  },
];

async function seedAuthUsers() {
  console.log("🔄 Creating test users in Firebase Auth Emulator...\n");

  let created = 0;
  let errors = 0;

  for (const userData of testUsers) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: userData.displayName,
      });

      console.log(`✅ Created user: ${userData.email}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   Name: ${userData.displayName}\n`);
      created++;
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log(`⚠️  User already exists: ${userData.email}\n`);
      } else {
        console.error(
          `❌ Error creating ${userData.email}:`,
          error.message,
          "\n"
        );
        errors++;
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Successfully created ${created} test users`);
  if (errors > 0) {
    console.log(`❌ Failed to create ${errors} users`);
  }
  console.log("=".repeat(50));
  console.log("\n📝 Test Credentials:\n");
  testUsers.forEach((user) => {
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log("");
  });
  console.log("=".repeat(50));
  console.log("\n🎉 You can now login with any of these credentials!");
  console.log("💡 Go to http://localhost:3000/signin to test\n");

  process.exit(0);
}

// Run the script
seedAuthUsers().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
