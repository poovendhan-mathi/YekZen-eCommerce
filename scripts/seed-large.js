#!/usr/bin/env node
/**
 * LARGE SEED FILE - 50+ Products across 10+ Categories
 * Run this to seed the Firebase Emulator with expanded product catalog
 */

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  connectFirestoreEmulator,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
} = require("firebase/firestore");
const {
  getAuth,
  createUserWithEmailAndPassword,
  connectAuthEmulator,
  updateProfile,
} = require("firebase/auth");

// Firebase config for emulator
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-no-project.firebaseapp.com",
  projectId: "demo-no-project",
  storageBucket: "demo-no-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Connect to emulators
connectFirestoreEmulator(db, "localhost", 8080);
connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });

console.log("🔧 Connected to Firebase Emulators");
console.log("🧹 Clearing existing data...\n");

// Clear existing products
async function clearProducts() {
  const productsRef = collection(db, "products");
  const snapshot = await getDocs(productsRef);

  for (const docSnapshot of snapshot.docs) {
    await deleteDoc(doc(db, "products", docSnapshot.id));
  }
  console.log(`✅ Cleared ${snapshot.size} existing products\n`);
}

// EXPANDED PRODUCT DATA - 50+ products across 10+ categories
const expandedProducts = [
  // AUDIO CATEGORY (8 products)
  {
    name: "Premium Wireless Headphones",
    description:
      "High-quality over-ear headphones with active noise cancellation and premium sound",
    price: 299.99,
    originalPrice: 349.99,
    category: "audio",
    brand: "AudioMax",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    rating: 4.8,
    stock: 45,
    featured: true,
    inStock: true,
  },
  {
    name: "Portable Bluetooth Speaker",
    description:
      "Waterproof portable speaker with 360° sound and 20-hour battery",
    price: 89.99,
    originalPrice: 129.99,
    category: "audio",
    brand: "SoundWave",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    rating: 4.6,
    stock: 120,
    featured: false,
    inStock: true,
  },
  {
    name: "Wireless Earbuds Pro",
    description: "True wireless earbuds with ANC and premium sound quality",
    price: 179.99,
    originalPrice: 229.99,
    category: "audio",
    brand: "AudioMax",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500",
    rating: 4.7,
    stock: 200,
    featured: true,
    inStock: true,
  },
  {
    name: "Studio Monitor Speakers",
    description: "Professional studio monitors with exceptional clarity",
    price: 499.99,
    originalPrice: 599.99,
    category: "audio",
    brand: "ProAudio",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
    rating: 4.9,
    stock: 30,
    featured: false,
    inStock: true,
  },
  {
    name: "USB Studio Microphone",
    description:
      "Professional condenser microphone for streaming and recording",
    price: 129.99,
    originalPrice: 179.99,
    category: "audio",
    brand: "ProAudio",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500",
    rating: 4.7,
    stock: 75,
    featured: false,
    inStock: true,
  },
  {
    name: "Soundbar with Subwoofer",
    description: "Premium soundbar with wireless subwoofer for immersive audio",
    price: 349.99,
    originalPrice: 449.99,
    category: "audio",
    brand: "SoundWave",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
    rating: 4.8,
    stock: 40,
    featured: false,
    inStock: true,
  },
  {
    name: "DJ Headphones Pro",
    description: "Professional DJ headphones with swivel design",
    price: 199.99,
    originalPrice: 249.99,
    category: "audio",
    brand: "AudioMax",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
    rating: 4.6,
    stock: 55,
    featured: false,
    inStock: true,
  },
  {
    name: "Vinyl Record Player",
    description: "Vintage-style turntable with modern Bluetooth connectivity",
    price: 249.99,
    originalPrice: 299.99,
    category: "audio",
    brand: "RetroSound",
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500",
    rating: 4.5,
    stock: 35,
    featured: false,
    inStock: true,
  },

  // WEARABLES CATEGORY (6 products)
  {
    name: "Smart Fitness Watch Pro",
    description: "Advanced fitness tracking with heart rate monitor and GPS",
    price: 249.99,
    originalPrice: 299.99,
    category: "wearables",
    brand: "FitTech",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    rating: 4.7,
    stock: 85,
    featured: true,
    inStock: true,
  },
  {
    name: "Smart Ring Fitness Tracker",
    description: "Sleek fitness ring with sleep and activity tracking",
    price: 299.99,
    originalPrice: 349.99,
    category: "wearables",
    brand: "RingFit",
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500",
    rating: 4.5,
    stock: 60,
    featured: false,
    inStock: true,
  },
  {
    name: "Running Watch GPS",
    description: "Lightweight GPS watch designed for runners",
    price: 179.99,
    originalPrice: 229.99,
    category: "wearables",
    brand: "RunTech",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500",
    rating: 4.6,
    stock: 90,
    featured: false,
    inStock: true,
  },
  {
    name: "Smart Glasses AR",
    description: "Augmented reality glasses with built-in display",
    price: 599.99,
    originalPrice: 799.99,
    category: "wearables",
    brand: "VisionTech",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    rating: 4.4,
    stock: 25,
    featured: false,
    inStock: true,
  },
  {
    name: "Fitness Tracker Band",
    description: "Affordable fitness band with heart rate monitoring",
    price: 79.99,
    originalPrice: 99.99,
    category: "wearables",
    brand: "FitTech",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500",
    rating: 4.3,
    stock: 150,
    featured: false,
    inStock: true,
  },
  {
    name: "Kids Smart Watch",
    description: "Kid-friendly smart watch with GPS tracking and games",
    price: 99.99,
    originalPrice: 129.99,
    category: "wearables",
    brand: "KidTech",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    rating: 4.5,
    stock: 80,
    featured: false,
    inStock: true,
  },

  // LAPTOPS CATEGORY (7 products)
  {
    name: 'Ultra-Slim Laptop 15"',
    description:
      "Lightweight laptop with powerful processor and all-day battery",
    price: 1299.99,
    originalPrice: 1499.99,
    category: "laptops",
    brand: "TechBook",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
    rating: 4.8,
    stock: 35,
    featured: true,
    inStock: true,
  },
  {
    name: 'Gaming Laptop 17" RTX',
    description: "High-performance gaming laptop with RTX graphics",
    price: 1899.99,
    originalPrice: 2299.99,
    category: "laptops",
    brand: "GameBook",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
    rating: 4.9,
    stock: 20,
    featured: true,
    inStock: true,
  },
  {
    name: 'Business Laptop 14"',
    description: "Professional laptop with security features",
    price: 999.99,
    originalPrice: 1199.99,
    category: "laptops",
    brand: "ProBook",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500",
    rating: 4.6,
    stock: 45,
    featured: false,
    inStock: true,
  },
  {
    name: "2-in-1 Convertible Laptop",
    description: "Versatile laptop that converts to tablet",
    price: 899.99,
    originalPrice: 1099.99,
    category: "laptops",
    brand: "FlexBook",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500",
    rating: 4.5,
    stock: 55,
    featured: false,
    inStock: true,
  },
  {
    name: "Student Laptop Budget",
    description: "Affordable laptop perfect for students",
    price: 499.99,
    originalPrice: 599.99,
    category: "laptops",
    brand: "EduBook",
    image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500",
    rating: 4.3,
    stock: 100,
    featured: false,
    inStock: true,
  },
  {
    name: 'Creator Laptop 15" 4K',
    description: "Content creation laptop with 4K display",
    price: 1699.99,
    originalPrice: 1999.99,
    category: "laptops",
    brand: "CreatorBook",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    rating: 4.8,
    stock: 30,
    featured: false,
    inStock: true,
  },
  {
    name: 'Ultrabook 13" Premium',
    description: "Premium ultrabook with stunning design",
    price: 1399.99,
    originalPrice: 1699.99,
    category: "laptops",
    brand: "LuxBook",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500",
    rating: 4.7,
    stock: 40,
    featured: false,
    inStock: true,
  },

  // GAMING CATEGORY (8 products)
  {
    name: "Wireless Gaming Mouse RGB",
    description: "Precision gaming mouse with customizable RGB lighting",
    price: 79.99,
    originalPrice: 99.99,
    category: "gaming",
    brand: "GameGear",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    rating: 4.6,
    stock: 150,
    featured: false,
    inStock: true,
  },
  {
    name: "Mechanical Gaming Keyboard RGB",
    description: "RGB mechanical keyboard with tactile switches",
    price: 129.99,
    originalPrice: 179.99,
    category: "gaming",
    brand: "GameGear",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
    rating: 4.8,
    stock: 95,
    featured: true,
    inStock: true,
  },
  {
    name: "VR Headset Pro",
    description: "Immersive VR experience with 4K resolution",
    price: 499.99,
    originalPrice: 599.99,
    category: "gaming",
    brand: "VRTech",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500",
    rating: 4.7,
    stock: 40,
    featured: true,
    inStock: true,
  },
  {
    name: "Gaming Desktop PC RGB",
    description: "High-end gaming PC with RTX 4080 and RGB lighting",
    price: 2499.99,
    originalPrice: 2999.99,
    category: "gaming",
    brand: "PowerPC",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500",
    rating: 4.9,
    stock: 15,
    featured: true,
    inStock: true,
  },
  {
    name: "Wireless Mechanical Keyboard Mini",
    description: "Compact 60% mechanical keyboard",
    price: 99.99,
    originalPrice: 129.99,
    category: "gaming",
    brand: "KeyMaster",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    rating: 4.5,
    stock: 80,
    featured: false,
    inStock: true,
  },
  {
    name: "Gaming Chair Ergonomic Pro",
    description: "Professional gaming chair with lumbar support",
    price: 349.99,
    originalPrice: 449.99,
    category: "gaming",
    brand: "ComfortGame",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500",
    rating: 4.7,
    stock: 50,
    featured: false,
    inStock: true,
  },
  {
    name: "Racing Wheel & Pedals Set",
    description: "Force feedback racing wheel for realistic simulation",
    price: 299.99,
    originalPrice: 399.99,
    category: "gaming",
    brand: "RaceSim",
    image: "https://images.unsplash.com/photo-1599950755346-a3e58f84ca63?w=500",
    rating: 4.6,
    stock: 35,
    featured: false,
    inStock: true,
  },
  {
    name: "RGB Gaming Headset 7.1",
    description: "Surround sound gaming headset with RGB",
    price: 89.99,
    originalPrice: 119.99,
    category: "gaming",
    brand: "GameGear",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500",
    rating: 4.5,
    stock: 110,
    featured: false,
    inStock: true,
  },

  // CAMERAS CATEGORY (6 products)
  {
    name: "4K Action Camera Pro",
    description: "Waterproof action camera with 4K 60fps recording",
    price: 399.99,
    originalPrice: 499.99,
    category: "cameras",
    brand: "ActionCam",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
    rating: 4.7,
    stock: 65,
    featured: false,
    inStock: true,
  },
  {
    name: "Mirrorless Camera 24MP",
    description: "Professional mirrorless camera with interchangeable lenses",
    price: 1299.99,
    originalPrice: 1599.99,
    category: "cameras",
    brand: "PhotoPro",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
    rating: 4.8,
    stock: 30,
    featured: true,
    inStock: true,
  },
  {
    name: "Gimbal Stabilizer 3-Axis",
    description: "Professional 3-axis gimbal for smooth video",
    price: 249.99,
    originalPrice: 329.99,
    category: "cameras",
    brand: "StableCam",
    image: "https://images.unsplash.com/photo-1591290619762-c588dc7b191b?w=500",
    rating: 4.6,
    stock: 45,
    featured: false,
    inStock: true,
  },
  {
    name: "DSLR Camera Professional",
    description: "Full-frame DSLR with 45MP sensor",
    price: 2499.99,
    originalPrice: 2999.99,
    category: "cameras",
    brand: "PhotoPro",
    image: "https://images.unsplash.com/photo-1606980395186-908bd753aa5f?w=500",
    rating: 4.9,
    stock: 20,
    featured: false,
    inStock: true,
  },
  {
    name: "Instant Camera Vintage",
    description: "Retro instant camera with modern features",
    price: 129.99,
    originalPrice: 169.99,
    category: "cameras",
    brand: "InstaPrint",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
    rating: 4.4,
    stock: 70,
    featured: false,
    inStock: true,
  },
  {
    name: "Webcam 4K Streaming",
    description: "4K webcam perfect for streaming and video calls",
    price: 149.99,
    originalPrice: 199.99,
    category: "cameras",
    brand: "StreamCam",
    image: "https://images.unsplash.com/photo-1594750085950-35913eacff5?w=500",
    rating: 4.6,
    stock: 85,
    featured: false,
    inStock: true,
  },

  // SMARTPHONES CATEGORY (6 products)
  {
    name: "Flagship Smartphone 512GB",
    description: "Latest flagship phone with premium features",
    price: 1199.99,
    originalPrice: 1399.99,
    category: "smartphones",
    brand: "PhonePlus",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    rating: 4.8,
    stock: 75,
    featured: true,
    inStock: true,
  },
  {
    name: "Wireless Charging Pad 15W",
    description: "Fast wireless charger with cooling fan",
    price: 39.99,
    originalPrice: 59.99,
    category: "smartphones",
    brand: "ChargeFast",
    image: "https://images.unsplash.com/photo-1591290619762-c588dc7b191b?w=500",
    rating: 4.5,
    stock: 200,
    featured: false,
    inStock: true,
  },
  {
    name: "Phone Case Rugged Armor",
    description: "Military-grade protection case",
    price: 29.99,
    originalPrice: 49.99,
    category: "smartphones",
    brand: "ArmorCase",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500",
    rating: 4.6,
    stock: 300,
    featured: false,
    inStock: true,
  },
  {
    name: "Power Bank 20000mAh",
    description: "High-capacity portable charger with fast charging",
    price: 49.99,
    originalPrice: 69.99,
    category: "smartphones",
    brand: "PowerUp",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
    rating: 4.7,
    stock: 150,
    featured: false,
    inStock: true,
  },
  {
    name: "Budget Smartphone 128GB",
    description: "Affordable smartphone with great features",
    price: 299.99,
    originalPrice: 399.99,
    category: "smartphones",
    brand: "ValuePhone",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
    rating: 4.3,
    stock: 120,
    featured: false,
    inStock: true,
  },
  {
    name: "Phone Gimbal Stabilizer",
    description: "Compact gimbal for smartphone videography",
    price: 89.99,
    originalPrice: 129.99,
    category: "smartphones",
    brand: "MobileCam",
    image: "https://images.unsplash.com/photo-1591290619762-c588dc7b191b?w=500",
    rating: 4.5,
    stock: 60,
    featured: false,
    inStock: true,
  },

  // SMART-HOME CATEGORY (5 products)
  {
    name: "Smart LED Light Bulbs 4-Pack",
    description: "Color-changing smart bulbs with app control",
    price: 59.99,
    originalPrice: 79.99,
    category: "smart-home",
    brand: "SmartLight",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
    rating: 4.5,
    stock: 180,
    featured: false,
    inStock: true,
  },
  {
    name: "Robot Vacuum Cleaner",
    description: "Smart robot vacuum with mapping technology",
    price: 399.99,
    originalPrice: 499.99,
    category: "smart-home",
    brand: "CleanBot",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
    rating: 4.7,
    stock: 45,
    featured: true,
    inStock: true,
  },
  {
    name: "Air Purifier HEPA Filter",
    description: "Smart air purifier with app control",
    price: 249.99,
    originalPrice: 329.99,
    category: "smart-home",
    brand: "PureAir",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500",
    rating: 4.6,
    stock: 70,
    featured: false,
    inStock: true,
  },
  {
    name: "Smart Thermostat",
    description: "Energy-saving smart thermostat with learning capability",
    price: 179.99,
    originalPrice: 229.99,
    category: "smart-home",
    brand: "HomeTech",
    image: "https://images.unsplash.com/photo-1545259742-12f0cb480c97?w=500",
    rating: 4.7,
    stock: 55,
    featured: false,
    inStock: true,
  },
  {
    name: "Video Doorbell Pro",
    description: "Smart doorbell with 2K video and two-way audio",
    price: 199.99,
    originalPrice: 249.99,
    category: "smart-home",
    brand: "SecureCam",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
    rating: 4.6,
    stock: 80,
    featured: false,
    inStock: true,
  },

  // MONITORS CATEGORY (5 products)
  {
    name: 'Ultrawide Gaming Monitor 34"',
    description: "Curved ultrawide monitor with 144Hz refresh rate",
    price: 599.99,
    originalPrice: 799.99,
    category: "monitors",
    brand: "ViewMax",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    rating: 4.8,
    stock: 35,
    featured: true,
    inStock: true,
  },
  {
    name: '4K Monitor 27" Professional',
    description: "Color-accurate 4K monitor for professionals",
    price: 499.99,
    originalPrice: 649.99,
    category: "monitors",
    brand: "ProDisplay",
    image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500",
    rating: 4.7,
    stock: 50,
    featured: false,
    inStock: true,
  },
  {
    name: 'Portable Monitor 15.6"',
    description: "USB-C portable monitor for on-the-go productivity",
    price: 179.99,
    originalPrice: 229.99,
    category: "monitors",
    brand: "PortaView",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    rating: 4.5,
    stock: 90,
    featured: false,
    inStock: true,
  },
  {
    name: 'Budget Monitor 24" FHD',
    description: "Affordable full HD monitor for everyday use",
    price: 149.99,
    originalPrice: 199.99,
    category: "monitors",
    brand: "ValueView",
    image: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=500",
    rating: 4.3,
    stock: 120,
    featured: false,
    inStock: true,
  },
  {
    name: "Dual Monitor Arm Mount",
    description: "Adjustable dual monitor mount for ergonomic setup",
    price: 89.99,
    originalPrice: 129.99,
    category: "monitors",
    brand: "MountPro",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    rating: 4.6,
    stock: 75,
    featured: false,
    inStock: true,
  },

  // ACCESSORIES CATEGORY (5 products)
  {
    name: "Laptop Stand Aluminum",
    description: "Ergonomic laptop stand with adjustable height",
    price: 49.99,
    originalPrice: 69.99,
    category: "accessories",
    brand: "ErgoPro",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    rating: 4.5,
    stock: 100,
    featured: false,
    inStock: true,
  },
  {
    name: "Cable Management Kit",
    description: "Complete cable management solution for clean desk",
    price: 24.99,
    originalPrice: 34.99,
    category: "accessories",
    brand: "OrganizePro",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500",
    rating: 4.4,
    stock: 200,
    featured: false,
    inStock: true,
  },
  {
    name: "USB Hub 7-Port",
    description: "Powered USB hub with fast charging",
    price: 39.99,
    originalPrice: 54.99,
    category: "accessories",
    brand: "HubMax",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500",
    rating: 4.6,
    stock: 150,
    featured: false,
    inStock: true,
  },
  {
    name: "Desk Pad XXL",
    description: "Large desk mat with stitched edges",
    price: 29.99,
    originalPrice: 44.99,
    category: "accessories",
    brand: "DeskPro",
    image: "https://images.unsplash.com/photo-1595853035070-59a39fe84de9?w=500",
    rating: 4.5,
    stock: 130,
    featured: false,
    inStock: true,
  },
  {
    name: "Webcam Cover Privacy Pack",
    description: "Sliding webcam covers for privacy protection",
    price: 9.99,
    originalPrice: 14.99,
    category: "accessories",
    brand: "PrivacyPro",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500",
    rating: 4.3,
    stock: 500,
    featured: false,
    inStock: true,
  },

  // COMPUTERS CATEGORY (4 products)
  {
    name: "Desktop Workstation Pro",
    description: "Professional workstation for content creation",
    price: 1999.99,
    originalPrice: 2499.99,
    category: "computers",
    brand: "WorkPro",
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
    rating: 4.8,
    stock: 25,
    featured: false,
    inStock: true,
  },
  {
    name: "Mini PC Compact",
    description: "Small form factor PC with surprising power",
    price: 599.99,
    originalPrice: 799.99,
    category: "computers",
    brand: "MiniMax",
    image: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=500",
    rating: 4.5,
    stock: 60,
    featured: false,
    inStock: true,
  },
  {
    name: 'All-in-One PC 27"',
    description: "Space-saving all-in-one computer",
    price: 1299.99,
    originalPrice: 1599.99,
    category: "computers",
    brand: "AIO Tech",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    rating: 4.6,
    stock: 40,
    featured: false,
    inStock: true,
  },
  {
    name: "Server Rack Mount",
    description: "Enterprise server for businesses",
    price: 3499.99,
    originalPrice: 4299.99,
    category: "computers",
    brand: "ServerMax",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500",
    rating: 4.7,
    stock: 15,
    featured: false,
    inStock: true,
  },
];

// Seed products
async function seedProducts() {
  console.log("📦 Seeding products...");
  const productsRef = collection(db, "products");

  let count = 0;
  for (const product of expandedProducts) {
    try {
      await addDoc(productsRef, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      count++;
      console.log(`  ✅ Added: ${product.name}`);
    } catch (error) {
      console.error(`  ❌ Failed to add ${product.name}:`, error.message);
    }
  }

  console.log(`\n✅ Successfully seeded ${count} products!\n`);
}

// Seed users
async function seedUsers() {
  console.log("👥 Creating user accounts...");

  // Wait a bit for Auth emulator to be fully ready
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const users = [
    {
      email: "admin@yekzen.com",
      password: "admin123456",
      displayName: "Admin User",
      role: "admin",
    },
    {
      email: "user@yekzen.com",
      password: "user123456",
      displayName: "Test User",
      role: "customer",
    },
  ];

  for (const user of users) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      await updateProfile(userCredential.user, {
        displayName: user.displayName,
      });
      console.log(
        `  ✅ Created ${user.role}: ${user.email} (${user.displayName})`
      );
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log(`  ℹ️  User already exists: ${user.email}`);
      } else {
        console.error(`  ❌ Error creating user ${user.email}:`, error.message);
      }
    }
  }

  console.log("\n✅ User accounts ready!\n");
}

// Main execution
async function main() {
  console.log("🚀 Starting Firebase Emulator Seed Process...\n");

  try {
    await clearProducts();
    await seedProducts();
    await seedUsers();

    console.log("============================================================");
    console.log("🎉 SEED COMPLETE!");
    console.log(
      "============================================================\n"
    );
    console.log("📝 Login Credentials:\n");
    console.log("Admin Account:");
    console.log("  Email: admin@yekzen.com");
    console.log("  Password: admin123456\n");
    console.log("User Account:");
    console.log("  Email: user@yekzen.com");
    console.log("  Password: user123456\n");
    console.log("🌐 Emulator UI: http://localhost:4000");
    console.log("🔥 Firestore: http://localhost:8080");
    console.log("🔐 Auth: http://localhost:9099\n");
    console.log(
      "============================================================\n"
    );

    console.log("📊 Summary:");
    console.log(
      `   • ${expandedProducts.length} products across 10 categories`
    );
    console.log(`   • 2 test user accounts`);
    console.log(
      `   • Categories: audio, wearables, laptops, gaming, cameras, smartphones, smart-home, monitors, accessories, computers\n`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

// Run the script
main();
