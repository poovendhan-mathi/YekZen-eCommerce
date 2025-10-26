// Goal: Setup Firebase App, Firestore, and Auth for YekZen
// Supports both production Firebase and local Firebase Emulator
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Check if we're using Firebase Emulator
const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // Use demo project ID for emulator, production ID otherwise
  projectId: useEmulator
    ? "demo-no-project"
    : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("🔧 Firebase Config:", {
  projectId: firebaseConfig.projectId,
  useEmulator,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Track if emulator connection has been established (prevent multiple connections)
let emulatorConnected = false;

if (useEmulator && typeof window !== "undefined" && !emulatorConnected) {
  const firestorePort =
    process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || "8080";
  const authPort = process.env.NEXT_PUBLIC_AUTH_EMULATOR_PORT || "9099";
  const emulatorHost =
    process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || "localhost";

  try {
    // Connect Firestore to emulator
    connectFirestoreEmulator(db, emulatorHost, parseInt(firestorePort));
    console.log(
      `🔧 Connected to Firestore Emulator at ${emulatorHost}:${firestorePort}`
    );

    // Connect Auth to emulator
    connectAuthEmulator(auth, `http://${emulatorHost}:${authPort}`, {
      disableWarnings: true,
    });
    console.log(`🔧 Connected to Auth Emulator at ${emulatorHost}:${authPort}`);

    emulatorConnected = true;
  } catch (error) {
    // Ignore errors if already connected
    if (
      error instanceof Error &&
      error.message.includes("already been called")
    ) {
      console.log("✅ Emulator already connected");
      emulatorConnected = true;
    } else {
      console.error("Error connecting to Firebase Emulator:", error);
    }
  }
} else if (useEmulator) {
  console.log("⚠️ Firebase Emulator is enabled but running on server-side");
} else {
  console.log("🌐 Using production Firebase");
}

export default app;
