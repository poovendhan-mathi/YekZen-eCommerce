// Script to create test users in Firebase Auth Emulator
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  connectAuthEmulator,
} = require("firebase/auth");

// Firebase config for emulator
const firebaseConfig = {
  projectId: "demo-no-project",
  apiKey: "demo-api-key",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Connect to Auth emulator
connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });

const testUsers = [
  {
    email: "admin@yekzen.com",
    password: "admin123456",
    role: "admin",
  },
  {
    email: "user@yekzen.com",
    password: "user123456",
    role: "user",
  },
  {
    email: "test@test.com",
    password: "test123456",
    role: "user",
  },
];

async function createTestUsers() {
  console.log("👥 Creating test users in Firebase Auth Emulator...\n");

  for (const user of testUsers) {
    try {
      await createUserWithEmailAndPassword(auth, user.email, user.password);
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log(`ℹ️  User already exists: ${user.email}`);
      } else {
        console.error(`❌ Error creating ${user.email}:`, error.message);
      }
    }
  }

  console.log("\n✅ Test users setup complete!\n");
  console.log("📝 Login Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin: admin@yekzen.com / admin123456");
  console.log("User:  user@yekzen.com / user123456");
  console.log("Test:  test@test.com / test123456");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  process.exit(0);
}

createTestUsers().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
