#!/bin/bash

# YekZen eCommerce Development Startup Script
# This script starts the Firebase emulator, seeds data, and runs the Next.js app

echo "🚀 Starting YekZen eCommerce Development Environment..."
echo ""

# Check if firebase-tools is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:9099 | xargs kill -9 2>/dev/null || true

echo ""
echo "📦 Step 1/3: Starting Firebase Emulators..."
firebase emulators:start --only firestore,auth &
EMULATOR_PID=$!

# Wait for emulators to be ready
echo "⏳ Waiting for emulators to start..."
sleep 10

echo ""
echo "🌱 Step 2/3: Seeding data (60 products + users + images)..."
node scripts/seed-large.js
sleep 2
node scripts/add-multiple-images.js

echo ""
echo "🎨 Step 3/3: Starting Next.js development server..."
sleep 2
npm run dev &
NEXTJS_PID=$!

echo ""
echo "✅ Development environment is ready!"
echo ""
echo "📍 Access Points:"
echo "   • Next.js App:     http://localhost:3000"
echo "   • Emulator UI:     http://localhost:4000"
echo "   • Firestore:       localhost:8080"
echo "   • Auth:            localhost:9099"
echo ""
echo "👤 Test Accounts:"
echo "   • Admin: admin@yekzen.com / admin123456"
echo "   • User:  user@yekzen.com / user123456"
echo ""
echo "💳 Dummy Payment Cards (for testing):"
echo "   • Visa:       4111 1111 1111 1111 | CVV: 123 | Exp: 12/25"
echo "   • Mastercard: 5555 5555 5555 4444 | CVV: 456 | Exp: 11/26"
echo "   • Amex:       3782 822463 10005   | CVV: 1234 | Exp: 10/27"
echo ""
echo "⌨️  Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Shutting down...'; kill $EMULATOR_PID $NEXTJS_PID 2>/dev/null; exit" INT
wait
