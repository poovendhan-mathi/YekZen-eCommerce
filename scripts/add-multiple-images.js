// Script to add multiple images to existing products
// Run this with: node scripts/add-multiple-images.js

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} = require("firebase/firestore");

// Firebase config for emulator
const firebaseConfig = {
  projectId: "demo-no-project",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to emulator
if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  const { connectFirestoreEmulator } = require("firebase/firestore");
  connectFirestoreEmulator(db, "localhost", 8080);
}

async function addMultipleImages() {
  try {
    console.log("🔄 Fetching all products...");
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    console.log(`📦 Found ${snapshot.size} products`);

    let updated = 0;
    const updatePromises = [];

    for (const docSnap of snapshot.docs) {
      const product = docSnap.data();
      const mainImage = product.image;

      if (!mainImage) {
        console.log(`⚠️  Skipping ${product.name} - no main image`);
        continue;
      }

      // Create multiple views of the SAME product by using the same base image
      // NOTE: In production, replace these with actual different angle photos:
      // - Front view: actual front photo URL
      // - Side view: actual side photo URL
      // - Back view: actual back photo URL
      // - Detail view: actual closeup/detail photo URL
      const images = [
        mainImage, // Front view (main product image)
        mainImage, // Side view (TODO: replace with actual side angle)
        mainImage, // Back view (TODO: replace with actual back angle)
        mainImage, // Detail view (TODO: replace with actual detail shot)
      ];

      // Update product with images array
      const productRef = doc(db, "products", docSnap.id);
      updatePromises.push(
        updateDoc(productRef, {
          images: images,
          image: mainImage, // Keep main image
        })
      );

      updated++;
      console.log(`  ✅ Updated: ${product.name} (${images.length} images)`);
    }

    await Promise.all(updatePromises);

    console.log(
      `\n✅ Successfully updated ${updated} products with multiple images`
    );
    console.log("📝 Note: All images are the same (demo mode)");
    console.log(
      "💡 In production, replace with actual product photos from different angles"
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating products:", error);
    process.exit(1);
  }
}

// Run the script
addMultipleImages();
