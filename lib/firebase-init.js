// Firebase Database Initialization Script
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD8KxG7qN_VU2JyFf5B1u8H3wJ7M9_4LmE",
  authDomain: "yekzen-ecommerce.firebaseapp.com",
  projectId: "yekzen-ecommerce",
  storageBucket: "yekzen-ecommerce.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const sampleProducts = [
  {
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
    ],
    category: "Electronics",
    brand: "AudioTech",
    rating: 4.5,
    reviews: 1234,
    inStock: true,
    stockCount: 25,
    features: ["Noise Cancellation", "40hr Battery", "Wireless Charging", "Premium Sound"],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      "Battery Life": "40 hours",
      "Connectivity": "Bluetooth 5.0"
    }
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking watch with GPS, heart rate monitoring, and smart notifications.",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500"
    ],
    category: "Wearables",
    brand: "FitTech",
    rating: 4.3,
    reviews: 892,
    inStock: true,
    stockCount: 15,
    features: ["GPS Tracking", "Heart Rate Monitor", "Sleep Tracking", "Water Resistant"],
    specifications: {
      "Display": "1.4\" AMOLED",
      "Battery Life": "7 days",
      "Water Resistance": "5ATM",
      "Sensors": "GPS, Heart Rate, Accelerometer"
    }
  },
  {
    name: "Professional Camera",
    description: "High-end mirrorless camera perfect for professional photography and videography.",
    price: 1299.99,
    originalPrice: 1499.99,
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500",
    images: [
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500"
    ],
    category: "Cameras",
    brand: "PhotoPro",
    rating: 4.8,
    reviews: 567,
    inStock: true,
    stockCount: 8,
    features: ["24MP Sensor", "4K Video", "Weather Sealed", "In-Body Stabilization"],
    specifications: {
      "Sensor": "24.2MP APS-C",
      "Video": "4K UHD at 30fps",
      "ISO Range": "100-25600",
      "Mount": "E-mount"
    }
  },
  {
    name: "Gaming Mechanical Keyboard",
    description: "RGB mechanical gaming keyboard with customizable switches and premium build quality.",
    price: 149.99,
    originalPrice: 179.99,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500",
    images: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500",
      "https://images.unsplash.com/photo-1595225476474-87563907c72e?w=500"
    ],
    category: "Gaming",
    brand: "GameTech",
    rating: 4.6,
    reviews: 2134,
    inStock: true,
    stockCount: 32,
    features: ["RGB Backlight", "Mechanical Switches", "Anti-Ghosting", "Customizable Macros"],
    specifications: {
      "Switch Type": "Cherry MX Blue",
      "Backlight": "RGB LED",
      "Layout": "Full Size (104 keys)",
      "Connection": "USB-C"
    }
  },
  {
    name: "Wireless Bluetooth Speaker",
    description: "Portable Bluetooth speaker with 360-degree sound and water resistance.",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500"
    ],
    category: "Audio",
    brand: "SoundWave",
    rating: 4.4,
    reviews: 1567,
    inStock: true,
    stockCount: 45,
    features: ["360° Sound", "Water Resistant", "12hr Battery", "Voice Assistant"],
    specifications: {
      "Output Power": "20W",
      "Battery Life": "12 hours",
      "Water Rating": "IPX7",
      "Connectivity": "Bluetooth 5.0"
    }
  },
  {
    name: "Ultrawide Monitor",
    description: "34-inch ultrawide curved monitor perfect for gaming and productivity.",
    price: 449.99,
    originalPrice: 549.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=500"
    ],
    category: "Computers",
    brand: "DisplayTech",
    rating: 4.7,
    reviews: 789,
    inStock: false,
    stockCount: 0,
    features: ["34\" Ultrawide", "Curved Display", "144Hz Refresh", "HDR Support"],
    specifications: {
      "Size": "34 inches",
      "Resolution": "3440 x 1440",
      "Refresh Rate": "144Hz",
      "Panel Type": "VA"
    }
  }
];

const categories = [
  {
    name: "Electronics",
    description: "Latest gadgets and electronic devices",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
    count: 156
  },
  {
    name: "Fashion",
    description: "Trendy clothing and accessories",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    count: 234
  },
  {
    name: "Gaming",
    description: "Gaming equipment and accessories",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    count: 89
  },
  {
    name: "Audio",
    description: "Premium audio equipment",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    count: 67
  },
  {
    name: "Cameras",
    description: "Photography and video equipment",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400",
    count: 45
  },
  {
    name: "Computers",
    description: "Computers and accessories",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    count: 78
  }
];

async function initializeDatabase() {
  console.log('Initializing Firebase database...');
  
  try {
    // Check if products already exist
    const productsSnapshot = await getDocs(collection(db, 'products'));
    if (!productsSnapshot.empty) {
      console.log('Database already has products. Skipping initialization.');
      return;
    }

    // Add products
    console.log('Adding sample products...');
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Add categories
    console.log('Adding categories...');
    for (const category of categories) {
      await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export { initializeDatabase, db, auth };
