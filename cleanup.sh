#!/bin/bash

# YekZen eCommerce Project Cleanup Script
# This script removes all unnecessary files and keeps the project clean

echo "🧹 Starting YekZen eCommerce Project Cleanup..."
echo ""

# Navigate to project root
cd "$(dirname "$0")"

# Count files before cleanup
BEFORE_COUNT=$(find . -type f | wc -l)

echo "📊 Files before cleanup: $BEFORE_COUNT"
echo ""

# ============================================
# 1. Remove duplicate summary/status files
# ============================================
echo "🗑️  Removing duplicate summary files..."

rm -f ALL-ISSUES-COMPLETE.md
rm -f ALL-ISSUES-FIXED.md
rm -f BUG-FIXES-VERIFIED.md
rm -f COMPLETE-FIX-SUMMARY.md
rm -f COMPLETE-FIXES-SUMMARY.md
rm -f COMPREHENSIVE-FIXES.md
rm -f FINAL-FIXES.md
rm -f FINAL-TEST-REPORT.md
rm -f FIXES-COMPLETE.md
rm -f FIXES-IN-PROGRESS.md
rm -f FIXES-SESSION-1.md
rm -f FIXES-SUMMARY.md
rm -f IMPLEMENTATION-COMPLETE.md
rm -f INVOICE-FIX-COMPLETE.md
rm -f QUICK-FIX-SUMMARY.md
rm -f REVIEW-INTEGRATION-COMPLETE.md
rm -f REVIEW.md
rm -f TEST-FIXES-COMPLETE.md
rm -f TEST-RESULTS-SESSION-1.md
rm -f TESTING-CHECKLIST.md
rm -f TESTING-GUIDE-COMPLETE.md
rm -f TYPESCRIPT_FIX_STATUS.md
rm -f TYPESCRIPT-MIGRATION-COMPLETE.md
rm -f TYPESCRIPT-TESTS-COMPLETE.md

echo "✅ Removed duplicate summary files"

# ============================================
# 2. Remove temporary development files
# ============================================
echo "🗑️  Removing temporary development files..."

rm -f fix-remaining-types.md
rm -f fix-types.sh
rm -f package-test.json
rm -f requirements.txt
rm -f firestore-debug.log
rm -f tsconfig.tsbuildinfo

echo "✅ Removed temporary development files"

# ============================================
# 3. Remove backup files
# ============================================
echo "🗑️  Removing backup files..."

find . -name "*.backup" -type f -delete
find . -name "*.old" -type f -delete
find . -name "*.bak" -type f -delete
find . -name "*.tmp" -type f -delete

echo "✅ Removed backup files"

# ============================================
# 4. Clean build artifacts
# ============================================
echo "🗑️  Cleaning build artifacts..."

# Remove tsconfig build info
rm -f tsconfig.tsbuildinfo

# Remove coverage reports (keep directory for future tests)
rm -rf coverage/lcov-report
rm -f coverage/lcov.info
rm -f coverage/coverage-summary.json

echo "✅ Cleaned build artifacts"

# ============================================
# 5. Remove debug logs
# ============================================
echo "🗑️  Removing debug logs..."

find . -name "*.log" -type f -not -path "./node_modules/*" -not -path "./.next/*" -delete
find . -name "npm-debug.log*" -type f -delete
find . -name "yarn-debug.log*" -type f -delete
find . -name "yarn-error.log*" -type f -delete

echo "✅ Removed debug logs"

# ============================================
# Summary
# ============================================
echo ""
echo "✨ Cleanup Complete!"
echo ""

# Count files after cleanup
AFTER_COUNT=$(find . -type f | wc -l)
REMOVED=$((BEFORE_COUNT - AFTER_COUNT))

echo "📊 Files before:  $BEFORE_COUNT"
echo "📊 Files after:   $AFTER_COUNT"
echo "📊 Files removed: $REMOVED"
echo ""

echo "📝 Keeping essential files:"
echo "  ✓ README.md - Project documentation"
echo "  ✓ QUICK-START.md - Quick start guide"
echo "  ✓ DEVELOPMENT-COMPLETE.md - Development summary"
echo "  ✓ docs/ - All documentation"
echo "  ✓ All source code (.ts, .tsx, .js, .jsx)"
echo "  ✓ Configuration files"
echo ""

echo "🎉 Project is now clean and production-ready!"
