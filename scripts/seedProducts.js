// Seed script to add sample products to Firestore
// Run this with: node scripts/seedProducts.js

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} = require("firebase/firestore");

// Firebase config (ensure your .env.local has all these variables)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample products to seed
const sampleProducts = [
  {
    name: "Premium Wireless Headphones",
    description:
      "High-quality noise-canceling wireless headphones with 30-hour battery life",
    price: 299.99,
    originalPrice: 399.99,
    category: "Electronics",
    brand: "TechSound",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    inStock: true,
    stock: 45,
    rating: 4.7,
    reviews: 328,
    featured: true,
    tags: ["wireless", "audio", "electronics"],
  },
  {
    name: "Smart Fitness Watch",
    description:
      "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring",
    price: 199.99,
    originalPrice: 249.99,
    category: "Wearables",
    brand: "FitTrack",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    inStock: true,
    stock: 120,
    rating: 4.5,
    reviews: 542,
    featured: true,
    tags: ["fitness", "smartwatch", "wearable"],
  },
  {
    name: "Organic Cotton T-Shirt",
    description:
      "Comfortable and sustainable organic cotton t-shirt in multiple colors",
    price: 29.99,
    originalPrice: 39.99,
    category: "Clothing",
    brand: "EcoWear",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    inStock: true,
    stock: 200,
    rating: 4.3,
    reviews: 156,
    featured: false,
    tags: ["clothing", "organic", "sustainable"],
  },
  {
    name: "Professional Camera Lens",
    description:
      "50mm f/1.8 prime lens perfect for portraits and low-light photography",
    price: 449.99,
    originalPrice: 549.99,
    category: "Electronics",
    brand: "PhotoPro",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800",
    inStock: true,
    stock: 30,
    rating: 4.9,
    reviews: 89,
    featured: true,
    tags: ["camera", "photography", "lens"],
  },
  {
    name: "Minimalist Backpack",
    description:
      "Sleek and durable backpack with laptop compartment and water-resistant material",
    price: 79.99,
    originalPrice: 99.99,
    category: "Accessories",
    brand: "UrbanGear",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    inStock: true,
    stock: 85,
    rating: 4.6,
    reviews: 234,
    featured: false,
    tags: ["backpack", "accessories", "travel"],
  },
  {
    name: "Stainless Steel Water Bottle",
    description:
      "Insulated 32oz water bottle keeps drinks cold for 24 hours or hot for 12 hours",
    price: 34.99,
    originalPrice: 44.99,
    category: "Accessories",
    brand: "HydroLife",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    inStock: true,
    stock: 150,
    rating: 4.8,
    reviews: 412,
    featured: true,
    tags: ["water bottle", "insulated", "eco-friendly"],
  },
  {
    name: "Wireless Gaming Mouse",
    description:
      "Precision gaming mouse with customizable RGB lighting and 16000 DPI sensor",
    price: 69.99,
    originalPrice: 89.99,
    category: "Electronics",
    brand: "GameTech",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
    inStock: true,
    stock: 95,
    rating: 4.4,
    reviews: 267,
    featured: false,
    tags: ["gaming", "mouse", "wireless"],
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Extra-thick non-slip yoga mat with carrying strap, perfect for all yoga styles",
    price: 49.99,
    originalPrice: 69.99,
    category: "Sports",
    brand: "ZenFit",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
    inStock: true,
    stock: 110,
    rating: 4.7,
    reviews: 189,
    featured: true,
    tags: ["yoga", "fitness", "sports"],
  },
];

async function seedProducts() {
  console.log("🌱 Starting to seed products...");

  try {
    const productsRef = collection(db, "products");

    for (const product of sampleProducts) {
      const productWithTimestamp = {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(productsRef, productWithTimestamp);
      console.log(`✅ Added product: ${product.name} (ID: ${docRef.id})`);
    }

    console.log(`\n🎉 Successfully seeded ${sampleProducts.length} products!`);
    console.log(
      "You can now view them in your Firestore console or in your app."
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
}

// Check if Firebase config is set
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("❌ Firebase configuration is missing!");
  console.error(
    "Please make sure your .env.local file contains all required Firebase environment variables."
  );
  console.error("Required variables:");
  console.error("  - NEXT_PUBLIC_FIREBASE_API_KEY");
  console.error("  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  console.error("  - NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  console.error("  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  console.error("  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  console.error("  - NEXT_PUBLIC_FIREBASE_APP_ID");
  process.exit(1);
}

// Run the seed function
seedProducts();
