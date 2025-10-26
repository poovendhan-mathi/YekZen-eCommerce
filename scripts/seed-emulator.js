#!/usr/bin/env node
/**
 * Seed Firebase Emulator with Products and Users
 * This script populates the Firebase emulator with sample data for development
 */

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  connectFirestoreEmulator,
  serverTimestamp,
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

// Sample products with enhanced data - 25 products across 7 categories
const sampleProducts = [
  // AUDIO CATEGORY (4 products)
  {
    name: "Premium Wireless Headphones",
    description:
      "Experience studio-quality sound with active noise cancellation, 30-hour battery life, and premium comfort padding. Perfect for music lovers and professionals.",
    price: 299.99,
    originalPrice: 399.99,
    category: "audio",
    brand: "TechSound Pro",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800",
    ],
    inStock: true,
    stock: 45,
    rating: 4.7,
    reviews: 328,
    featured: true,
    tags: ["wireless", "audio", "electronics", "premium"],
    specifications: {
      battery: "30 hours",
      connectivity: "Bluetooth 5.0",
      weight: "250g",
      colors: ["Black", "Silver", "Navy Blue"],
    },
  },
  {
    name: "Smart Fitness Watch Pro",
    description:
      "Advanced fitness tracking with heart rate monitoring, GPS, sleep tracking, and 50+ workout modes. Water-resistant up to 50m.",
    price: 199.99,
    originalPrice: 249.99,
    category: "wearables",
    brand: "FitTech",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
    ],
    inStock: true,
    stock: 78,
    rating: 4.5,
    reviews: 256,
    featured: true,
    tags: ["smartwatch", "fitness", "wearables", "health"],
    specifications: {
      display: "1.4 inch AMOLED",
      battery: "14 days",
      waterResistance: "50m",
      sensors: ["Heart Rate", "GPS", "SpO2", "Accelerometer"],
    },
  },
  {
    name: 'Ultra-Slim Laptop 15"',
    description:
      "Powerful performance meets portability. Intel i7 processor, 16GB RAM, 512GB SSD, stunning 4K display, and all-day battery life.",
    price: 1299.99,
    originalPrice: 1599.99,
    category: "computers",
    brand: "TechPro",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800",
    ],
    inStock: true,
    stock: 23,
    rating: 4.8,
    reviews: 412,
    featured: true,
    tags: ["laptop", "computer", "productivity", "premium"],
    specifications: {
      processor: "Intel Core i7 12th Gen",
      ram: "16GB DDR4",
      storage: "512GB NVMe SSD",
      display: '15.6" 4K UHD',
      weight: "1.6kg",
    },
  },
  {
    name: "Wireless Gaming Mouse RGB",
    description:
      "Professional-grade gaming mouse with 16,000 DPI sensor, customizable RGB lighting, and ultra-fast wireless connectivity.",
    price: 89.99,
    originalPrice: 119.99,
    category: "gaming",
    brand: "GameForce",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800",
    ],
    inStock: true,
    stock: 156,
    rating: 4.6,
    reviews: 892,
    featured: false,
    tags: ["gaming", "mouse", "wireless", "rgb"],
    specifications: {
      dpi: "16,000",
      buttons: "8 programmable",
      battery: "70 hours",
      connectivity: "2.4GHz Wireless",
    },
  },
  {
    name: "4K Action Camera Pro",
    description:
      "Capture your adventures in stunning 4K 60fps. Waterproof up to 30m, electronic stabilization, and voice control.",
    price: 349.99,
    originalPrice: 449.99,
    category: "cameras",
    brand: "ActionVision",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
      "https://images.unsplash.com/photo-1606933248010-ef7e815e4308?w=800",
    ],
    inStock: true,
    stock: 34,
    rating: 4.7,
    reviews: 543,
    featured: true,
    tags: ["camera", "action", "4k", "waterproof"],
    specifications: {
      video: "4K 60fps",
      waterproof: "30m",
      stabilization: "Electronic Image Stabilization",
      battery: "2 hours 4K recording",
    },
  },
  {
    name: "Mechanical Gaming Keyboard RGB",
    description:
      "Premium mechanical switches, per-key RGB lighting, aircraft-grade aluminum frame, and programmable macro keys.",
    price: 149.99,
    originalPrice: 199.99,
    category: "gaming",
    brand: "GameForce",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    ],
    inStock: true,
    stock: 67,
    rating: 4.8,
    reviews: 1024,
    featured: false,
    tags: ["gaming", "keyboard", "mechanical", "rgb"],
    specifications: {
      switches: "Cherry MX Red",
      backlight: "Per-Key RGB",
      connection: "USB-C",
      keys: "104 + 6 Macro Keys",
    },
  },
  {
    name: "Portable Bluetooth Speaker",
    description:
      "360-degree premium sound, 24-hour battery, waterproof design, and deep bass radiators. Perfect for any occasion.",
    price: 79.99,
    originalPrice: 99.99,
    category: "audio",
    brand: "SoundWave",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800",
    ],
    inStock: true,
    stock: 123,
    rating: 4.5,
    reviews: 678,
    featured: false,
    tags: ["speaker", "bluetooth", "portable", "audio"],
    specifications: {
      battery: "24 hours",
      waterproof: "IPX7",
      connectivity: "Bluetooth 5.0",
      output: "20W",
    },
  },
  {
    name: "Wireless Earbuds Pro",
    description:
      "True wireless earbuds with active noise cancellation, transparency mode, and wireless charging case. Up to 30 hours total battery.",
    price: 179.99,
    originalPrice: 229.99,
    category: "audio",
    brand: "TechSound Pro",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
      "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800",
    ],
    inStock: true,
    stock: 89,
    rating: 4.6,
    reviews: 456,
    featured: true,
    tags: ["earbuds", "wireless", "audio", "anc"],
    specifications: {
      battery: "8h + 22h case",
      anc: "Active Noise Cancellation",
      waterResistance: "IPX4",
      connectivity: "Bluetooth 5.2",
    },
  },
  {
    name: "Studio Monitor Speakers",
    description:
      "Professional-grade studio monitors with flat frequency response, 5-inch woofer, and premium components for accurate sound reproduction.",
    price: 449.99,
    originalPrice: 599.99,
    category: "audio",
    brand: "AudioPro",
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800",
    images: ["https://images.unsplash.com/photo-1545127398-14699f92334b?w=800"],
    inStock: true,
    stock: 28,
    rating: 4.9,
    reviews: 187,
    featured: false,
    tags: ["speaker", "audio", "studio", "professional"],
    specifications: {
      power: "75W",
      frequency: "45Hz - 20kHz",
      inputs: "XLR, TRS, RCA",
      size: "5 inch woofer",
    },
  },
  // WEARABLES CATEGORY (3 products)
  {
    name: "Smart Ring Fitness Tracker",
    description:
      "Ultra-lightweight smart ring with sleep tracking, heart rate monitoring, and 7-day battery life. Waterproof design.",
    price: 299.99,
    originalPrice: 349.99,
    category: "wearables",
    brand: "HealthTech",
    image: "https://images.unsplash.com/photo-1617625802912-cde586faf331?w=800",
    images: [
      "https://images.unsplash.com/photo-1617625802912-cde586faf331?w=800",
    ],
    inStock: true,
    stock: 52,
    rating: 4.4,
    reviews: 234,
    featured: false,
    tags: ["wearable", "fitness", "health", "smart ring"],
    specifications: {
      battery: "7 days",
      waterproof: "5ATM",
      sensors: ["Heart Rate", "SpO2", "Temperature"],
      weight: "4g",
    },
  },
  {
    name: "VR Headset Pro",
    description:
      "Immersive virtual reality headset with 4K per eye display, inside-out tracking, and expansive game library. No PC required.",
    price: 499.99,
    originalPrice: 649.99,
    category: "wearables",
    brand: "VisionTech",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800",
    images: [
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800",
    ],
    inStock: true,
    stock: 34,
    rating: 4.8,
    reviews: 512,
    featured: true,
    tags: ["vr", "gaming", "wearable", "virtual reality"],
    specifications: {
      display: "4K per eye",
      refresh: "120Hz",
      storage: "256GB",
      battery: "2-3 hours",
    },
  },
  // COMPUTERS CATEGORY (4 products)
  {
    name: "Gaming Desktop PC RGB",
    description:
      "High-performance gaming PC with RTX 4070, Intel i7 13th gen, 32GB RAM, 1TB NVMe SSD. RGB lighting and liquid cooling.",
    price: 1799.99,
    originalPrice: 2199.99,
    category: "computers",
    brand: "GameForce",
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
    images: [
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
    ],
    inStock: true,
    stock: 15,
    rating: 4.9,
    reviews: 289,
    featured: true,
    tags: ["gaming", "desktop", "pc", "rgb"],
    specifications: {
      cpu: "Intel i7 13700K",
      gpu: "RTX 4070",
      ram: "32GB DDR5",
      storage: "1TB NVMe + 2TB HDD",
    },
  },
  {
    name: 'Ultrawide Gaming Monitor 34"',
    description:
      "34-inch curved ultrawide monitor with 144Hz refresh rate, 1ms response time, and stunning WQHD resolution. Perfect for gaming and productivity.",
    price: 549.99,
    originalPrice: 699.99,
    category: "computers",
    brand: "DisplayMax",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    ],
    inStock: true,
    stock: 42,
    rating: 4.7,
    reviews: 376,
    featured: false,
    tags: ["monitor", "gaming", "ultrawide", "curved"],
    specifications: {
      size: "34 inch",
      resolution: "3440x1440 WQHD",
      refresh: "144Hz",
      panel: "VA Curved",
    },
  },
  {
    name: "Wireless Mechanical Keyboard Mini",
    description:
      "Compact 65% mechanical keyboard with hot-swappable switches, RGB backlighting, and wireless connectivity. Premium aluminum build.",
    price: 129.99,
    originalPrice: 169.99,
    category: "computers",
    brand: "KeyMaster",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800",
    images: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800",
    ],
    inStock: true,
    stock: 88,
    rating: 4.6,
    reviews: 445,
    featured: false,
    tags: ["keyboard", "mechanical", "wireless", "compact"],
    specifications: {
      layout: "65%",
      switches: "Hot-swappable",
      connection: "Bluetooth 5.1 + USB-C",
      battery: "30 days",
    },
  },
  // GAMING CATEGORY (4 products)
  {
    name: "Gaming Chair Ergonomic Pro",
    description:
      "Premium ergonomic gaming chair with lumbar support, 4D armrests, memory foam padding, and 180-degree recline. Built to last.",
    price: 349.99,
    originalPrice: 449.99,
    category: "gaming",
    brand: "ComfortGame",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800",
    images: [
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800",
    ],
    inStock: true,
    stock: 31,
    rating: 4.8,
    reviews: 623,
    featured: true,
    tags: ["gaming", "chair", "ergonomic", "furniture"],
    specifications: {
      material: "PU Leather + Memory Foam",
      recline: "90-180 degrees",
      weight: "Up to 150kg",
      warranty: "3 years",
    },
  },
  {
    name: "Racing Wheel & Pedals Set",
    description:
      "Force feedback racing wheel with realistic pedals, gear shifter, and 900-degree rotation. Compatible with PC, PS5, and Xbox.",
    price: 399.99,
    originalPrice: 499.99,
    category: "gaming",
    brand: "SimRacing Pro",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800",
    images: ["https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800"],
    inStock: true,
    stock: 19,
    rating: 4.7,
    reviews: 198,
    featured: false,
    tags: ["gaming", "racing", "wheel", "simulator"],
    specifications: {
      rotation: "900 degrees",
      forceFeedback: "Yes",
      pedals: "3-pedal set",
      compatibility: "PC, PS5, Xbox Series X/S",
    },
  },
  {
    name: "RGB Gaming Headset 7.1",
    description:
      "Immersive 7.1 surround sound gaming headset with noise-canceling mic, plush ear cushions, and customizable RGB lighting.",
    price: 89.99,
    originalPrice: 119.99,
    category: "gaming",
    brand: "SoundGamer",
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=800",
    images: [
      "https://images.unsplash.com/photo-1599669454699-248893623440?w=800",
    ],
    inStock: true,
    stock: 112,
    rating: 4.5,
    reviews: 756,
    featured: false,
    tags: ["gaming", "headset", "audio", "rgb"],
    specifications: {
      sound: "7.1 Surround",
      mic: "Noise-canceling",
      connection: "USB + 3.5mm",
      lighting: "RGB",
    },
  },
  // CAMERAS CATEGORY (3 products)
  {
    name: "Mirrorless Camera 24MP",
    description:
      "Professional mirrorless camera with 24MP sensor, 4K video, in-body stabilization, and dual SD card slots. Perfect for creators.",
    price: 1499.99,
    originalPrice: 1799.99,
    category: "cameras",
    brand: "PhotoPro",
    image: "https://images.unsplash.com/photo-1606980707923-bf87a72a9d34?w=800",
    images: [
      "https://images.unsplash.com/photo-1606980707923-bf87a72a9d34?w=800",
    ],
    inStock: true,
    stock: 22,
    rating: 4.9,
    reviews: 334,
    featured: true,
    tags: ["camera", "photography", "mirrorless", "4k"],
    specifications: {
      sensor: "24MP Full Frame",
      video: "4K 60fps",
      stabilization: "5-axis IBIS",
      iso: "100-51200",
    },
  },
  {
    name: "Gimbal Stabilizer 3-Axis",
    description:
      "Professional 3-axis gimbal for smartphones and action cameras. Smooth cinematic footage with intuitive controls and 12-hour battery.",
    price: 129.99,
    originalPrice: 179.99,
    category: "cameras",
    brand: "StabiliTech",
    image: "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800",
    images: [
      "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800",
    ],
    inStock: true,
    stock: 47,
    rating: 4.6,
    reviews: 287,
    featured: false,
    tags: ["gimbal", "stabilizer", "camera", "video"],
    specifications: {
      axes: "3-axis",
      payload: "Up to 300g",
      battery: "12 hours",
      modes: "Pan Follow, Lock, FPV",
    },
  },
  // SMARTPHONES CATEGORY (4 products)
  {
    name: "Flagship Smartphone 512GB",
    description:
      'Latest flagship smartphone with 6.7" AMOLED display, 108MP camera, 5G, and all-day battery. Premium glass and metal design.',
    price: 999.99,
    originalPrice: 1199.99,
    category: "smartphones",
    brand: "TechMobile",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    ],
    inStock: true,
    stock: 67,
    rating: 4.8,
    reviews: 1024,
    featured: true,
    tags: ["smartphone", "5g", "flagship", "mobile"],
    specifications: {
      display: '6.7" AMOLED 120Hz',
      camera: "108MP + 12MP + 10MP",
      storage: "512GB",
      battery: "5000mAh",
    },
  },
  {
    name: "Wireless Charging Pad 15W",
    description:
      "Fast wireless charging pad with 15W output, LED indicator, and non-slip surface. Compatible with all Qi-enabled devices.",
    price: 29.99,
    originalPrice: 39.99,
    category: "smartphones",
    brand: "ChargeMax",
    image: "https://images.unsplash.com/photo-1591290619762-c588f5c58501?w=800",
    images: [
      "https://images.unsplash.com/photo-1591290619762-c588f5c58501?w=800",
    ],
    inStock: true,
    stock: 203,
    rating: 4.4,
    reviews: 834,
    featured: false,
    tags: ["wireless", "charging", "accessory", "qi"],
    specifications: {
      output: "15W",
      compatibility: "Qi-enabled devices",
      safety: "Overcharge protection",
      cable: "USB-C included",
    },
  },
  {
    name: "Phone Case Rugged Armor",
    description:
      "Military-grade drop protection phone case with raised edges, textured grip, and precise cutouts. Available for all major phones.",
    price: 24.99,
    originalPrice: 34.99,
    category: "smartphones",
    brand: "ArmorTech",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800",
    images: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800",
    ],
    inStock: true,
    stock: 342,
    rating: 4.5,
    reviews: 1523,
    featured: false,
    tags: ["case", "protection", "accessory", "rugged"],
    specifications: {
      protection: "Military-grade MIL-STD 810G",
      material: "TPU + PC",
      features: "Raised edges, Textured grip",
      colors: ["Black", "Blue", "Red"],
    },
  },
  {
    name: "Power Bank 20000mAh",
    description:
      "High-capacity power bank with 20000mAh, 65W PD fast charging, 3 output ports, and LED display. Charge laptops and phones.",
    price: 49.99,
    originalPrice: 69.99,
    category: "smartphones",
    brand: "PowerPlus",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800",
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800",
    ],
    inStock: true,
    stock: 128,
    rating: 4.7,
    reviews: 945,
    featured: false,
    tags: ["powerbank", "battery", "charging", "portable"],
    specifications: {
      capacity: "20000mAh",
      output: "65W PD",
      ports: "2x USB-C, 1x USB-A",
      display: "LED battery indicator",
    },
  },
  // HOME CATEGORY (3 products)
  {
    name: "Smart LED Light Bulbs 4-Pack",
    description:
      "WiFi smart bulbs with 16 million colors, voice control, scheduling, and music sync. Works with Alexa and Google Home.",
    price: 39.99,
    originalPrice: 59.99,
    category: "home",
    brand: "SmartHome",
    image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=800",
    images: ["https://images.unsplash.com/photo-1550985616-10810253b84d?w=800"],
    inStock: true,
    stock: 156,
    rating: 4.6,
    reviews: 678,
    featured: false,
    tags: ["smart home", "lighting", "wifi", "alexa"],
    specifications: {
      colors: "16 million",
      brightness: "800 lumens",
      connectivity: "WiFi 2.4GHz",
      compatibility: "Alexa, Google Home, Siri",
    },
  },
  {
    name: "Robot Vacuum Cleaner",
    description:
      "Smart robot vacuum with mapping, app control, 2000Pa suction, and auto-recharge. Perfect for hardwood and carpet.",
    price: 249.99,
    originalPrice: 349.99,
    category: "home",
    brand: "CleanBot",
    image: "https://images.unsplash.com/photo-1558317374-067fb948a845?w=800",
    images: ["https://images.unsplash.com/photo-1558317374-067fb948a845?w=800"],
    inStock: true,
    stock: 38,
    rating: 4.5,
    reviews: 512,
    featured: true,
    tags: ["robot", "vacuum", "smart home", "cleaning"],
    specifications: {
      suction: "2000Pa",
      battery: "120 minutes",
      dustbin: "600ml",
      mapping: "Smart navigation",
    },
  },
  {
    name: "Air Purifier HEPA Filter",
    description:
      "True HEPA air purifier removes 99.97% of particles, covers 500 sq ft, quiet operation, and smart sensor. Perfect for allergies.",
    price: 179.99,
    originalPrice: 229.99,
    category: "home",
    brand: "AirPure",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800",
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800",
    ],
    inStock: true,
    stock: 54,
    rating: 4.7,
    reviews: 423,
    featured: false,
    tags: ["air purifier", "hepa", "home", "health"],
    specifications: {
      filter: "True HEPA",
      coverage: "500 sq ft",
      noise: "24-50 dB",
      sensors: "Air quality sensor",
    },
  },
];

// User accounts to create
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
    role: "user",
  },
];

async function seedProducts() {
  console.log("\n📦 Seeding products...");
  const productsRef = collection(db, "products");

  for (const product of sampleProducts) {
    try {
      await addDoc(productsRef, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`  ✅ Added: ${product.name}`);
    } catch (error) {
      console.error(`  ❌ Failed to add ${product.name}:`, error.message);
    }
  }

  console.log(`\n✅ Successfully seeded ${sampleProducts.length} products!`);
}

async function seedUsers() {
  console.log("\n👥 Creating user accounts...");

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

      // Store additional user data in Firestore
      const usersRef = collection(db, "users");
      await addDoc(usersRef, {
        uid: userCredential.user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: serverTimestamp(),
      });

      console.log(
        `  ✅ Created ${user.role}: ${user.email} (${user.displayName})`
      );
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        console.log(`  ℹ️  User already exists: ${user.email}`);
      } else {
        console.error(`  ❌ Failed to create ${user.email}:`, error.message);
      }
    }
  }

  console.log("\n✅ User accounts ready!");
}

async function seedAll() {
  console.log("🚀 Starting Firebase Emulator Seed Process...\n");

  try {
    await seedProducts();
    await seedUsers();

    console.log("\n" + "=".repeat(60));
    console.log("🎉 SEED COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📝 Login Credentials:");
    console.log("\nAdmin Account:");
    console.log("  Email: admin@yekzen.com");
    console.log("  Password: admin123456");
    console.log("\nUser Account:");
    console.log("  Email: user@yekzen.com");
    console.log("  Password: user123456");
    console.log("\n🌐 Emulator UI: http://localhost:4000");
    console.log("🔥 Firestore: http://localhost:8080");
    console.log("🔐 Auth: http://localhost:9099");
    console.log("\n" + "=".repeat(60) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  }
}

// Run the seed
seedAll();
