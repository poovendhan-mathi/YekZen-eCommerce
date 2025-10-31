/**
 * Migration Script: Update Existing Products
 *
 * This script updates all existing products to:
 * 1. Convert single image to images array
 * 2. Initialize rating distribution
 * 3. Set reviewCount to 0
 * 4. Remove admin-set ratings (will be calculated from reviews)
 *
 * Run with: npm run migrate-products
 */

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  connectFirestoreEmulator,
} = require("firebase/firestore");

// Check if we're using emulator
const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR !== "false";

console.log("Environment:", {
  useEmulator,
  NODE_ENV: process.env.NODE_ENV,
});

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: useEmulator
    ? "demo-no-project"
    : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to emulator if needed
if (useEmulator) {
  try {
    connectFirestoreEmulator(db, "localhost", 8080);
    console.log("🔧 Connected to Firestore Emulator (localhost:8080)");
  } catch (error) {
    if (error.message.includes("already been called")) {
      console.log("✅ Already connected to emulator");
    } else {
      console.error("❌ Failed to connect to emulator:", error.message);
    }
  }
}

/**
 * Default product images for different categories
 */
const defaultImages = {
  Electronics: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
    "https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?w=800",
  ],
  Clothing: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800",
  ],
  Books: [
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
  ],
  Home: [
    "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
  ],
  Sports: [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
  ],
};

async function migrateProducts() {
  try {
    console.log("\n📦 Starting Product Migration...\n");

    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    console.log(`Found ${snapshot.size} products to migrate\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const docSnap of snapshot.docs) {
      try {
        const product = docSnap.data();
        const productRef = doc(db, "products", docSnap.id);

        // Prepare images array
        let images = [];

        if (product.images && Array.isArray(product.images)) {
          // Already has images array
          if (typeof product.images[0] === "string") {
            // Convert string array to ProductImage array
            images = product.images.map((url, index) => ({
              url,
              alt: `${product.name} - Image ${index + 1}`,
              order: index,
              type: "url",
            }));
          } else {
            // Already in correct format
            images = product.images;
          }
        } else if (product.image) {
          // Has single image, convert to array
          images = [
            {
              url: product.image,
              alt: `${product.name} - Main Image`,
              order: 0,
              type: "url",
            },
          ];

          // Add additional default images based on category
          const categoryImages =
            defaultImages[product.category] || defaultImages.Electronics;
          categoryImages.slice(0, 2).forEach((url, index) => {
            images.push({
              url,
              alt: `${product.name} - Image ${index + 2}`,
              order: index + 1,
              type: "url",
            });
          });
        } else {
          // No image at all, use defaults
          const categoryImages =
            defaultImages[product.category] || defaultImages.Electronics;
          images = categoryImages.slice(0, 3).map((url, index) => ({
            url,
            alt: `${product.name} - Image ${index + 1}`,
            order: index,
            type: "url",
          }));
        }

        // Update product document
        await updateDoc(productRef, {
          images,
          reviewCount: product.reviewCount || 0,
          rating: product.rating || 0, // Keep existing rating or set to 0
          ratingDistribution: product.ratingDistribution || {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          },
          updatedAt: new Date(),
        });

        console.log(`✅ Migrated: ${product.name} (${images.length} images)`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error migrating ${docSnap.id}:`, error.message);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`🎉 Migration Complete!`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log("=".repeat(60) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateProducts();
