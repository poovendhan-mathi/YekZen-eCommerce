#!/usr/bin/env node

/**
 * Firebase Database Setup Script for YekZen eCommerce
 * This script initializes Firebase Firestore with sample data
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

// Firebase configuration (you'll need to replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "yekzen-ecommerce.firebaseapp.com",
  projectId: "yekzen-ecommerce",
  storageBucket: "yekzen-ecommerce.appspot.com",
  messagingSenderId: "your-sender-id-here",
  appId: "your-app-id-here"
};

// Sample products data
const sampleProducts = require('../mock/products.json');

// Sample categories data
const sampleCategories = [
  { name: 'Electronics', description: 'Latest gadgets and devices', count: 156 },
  { name: 'Fashion', description: 'Trendy clothing and accessories', count: 234 },
  { name: 'Home & Garden', description: 'Everything for your home', count: 89 },
  { name: 'Sports', description: 'Sports equipment and fitness gear', count: 67 },
  { name: 'Books', description: 'Wide selection of books', count: 345 },
  { name: 'Beauty', description: 'Cosmetics and personal care', count: 123 }
];

async function setupFirebaseDatabase() {
  try {
    console.log('🚀 Starting Firebase database setup...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Check if data already exists
    const productsSnapshot = await getDocs(collection(db, 'products'));
    if (!productsSnapshot.empty) {
      console.log('✅ Database already has products. Skipping initialization.');
      return;
    }
    
    console.log('📦 Adding sample products...');
    
    // Add products
    for (let i = 0; i < sampleProducts.length; i++) {
      const product = sampleProducts[i];
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`   ✓ Added product: ${product.name}`);
    }
    
    console.log('🏷️  Adding sample categories...');
    
    // Add categories
    for (let i = 0; i < sampleCategories.length; i++) {
      const category = sampleCategories[i];
      await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`   ✓ Added category: ${category.name}`);
    }
    
    console.log('✅ Firebase database setup completed successfully!');
    console.log(`   📊 ${sampleProducts.length} products added`);
    console.log(`   🏷️  ${sampleCategories.length} categories added`);
    console.log('');
    console.log('🎉 Your YekZen eCommerce database is ready!');
    
  } catch (error) {
    console.error('❌ Error setting up Firebase database:', error);
    console.log('');
    console.log('💡 Make sure you have:');
    console.log('   1. Created a Firebase project');
    console.log('   2. Enabled Firestore database');
    console.log('   3. Updated the firebaseConfig with your project details');
    console.log('   4. Set up authentication rules');
  }
}

// Instructions for manual setup
function showSetupInstructions() {
  console.log('');
  console.log('🔥 Firebase Setup Instructions:');
  console.log('');
  console.log('1. Create a Firebase project:');
  console.log('   👉 https://console.firebase.google.com/');
  console.log('');
  console.log('2. Enable Firestore Database:');
  console.log('   - Go to Firestore Database');
  console.log('   - Click "Create database"');
  console.log('   - Choose "Start in test mode" for development');
  console.log('');
  console.log('3. Get your Firebase config:');
  console.log('   - Go to Project Settings');
  console.log('   - Scroll to "Your apps"');
  console.log('   - Click "Web app" icon');
  console.log('   - Copy the firebaseConfig object');
  console.log('');
  console.log('4. Update .env.local with your Firebase credentials:');
  console.log('   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key');
  console.log('   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com');
  console.log('   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
  console.log('   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com');
  console.log('   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id');
  console.log('   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id');
  console.log('');
  console.log('5. Run this setup script again: npm run setup-db');
  console.log('');
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--instructions') || args.includes('-i')) {
    showSetupInstructions();
  } else {
    setupFirebaseDatabase();
  }
}

module.exports = { setupFirebaseDatabase, showSetupInstructions };
