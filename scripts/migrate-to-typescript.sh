#!/bin/bash

# YekZen eCommerce - TypeScript Migration Script
# Converts JavaScript files to TypeScript while preserving functionality

echo "🔄 Starting TypeScript Migration..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Rename .js files to .tsx in app directory
echo "${BLUE}Step 1: Migrating app directory...${NC}"
find app -name "*.js" -type f | while read file; do
    newfile="${file%.js}.tsx"
    if [ ! -f "$newfile" ]; then
        echo "  Renaming: $file → $newfile"
        mv "$file" "$newfile"
    fi
done

# Step 2: Rename .jsx files to .tsx in components directory
echo ""
echo "${BLUE}Step 2: Migrating components directory...${NC}"
find components -name "*.jsx" -type f | while read file; do
    newfile="${file%.jsx}.tsx"
    if [ ! -f "$newfile" ]; then
        echo "  Renaming: $file → $newfile"
        mv "$file" "$newfile"
    fi
done

# Step 3: Rename .js files to .ts in contexts directory
echo ""
echo "${BLUE}Step 3: Migrating contexts directory...${NC}"
find contexts -name "*.js" -type f | while read file; do
    newfile="${file%.js}.tsx"
    if [ ! -f "$newfile" ]; then
        echo "  Renaming: $file → $newfile"
        mv "$file" "$newfile"
    fi
done

# Step 4: Rename .js files to .ts in services directory
echo ""
echo "${BLUE}Step 4: Migrating services directory...${NC}"
find services -name "*.js" -type f | while read file; do
    newfile="${file%.js}.ts"
    if [ ! -f "$newfile" ]; then
        echo "  Renaming: $file → $newfile"
        mv "$file" "$newfile"
    fi
done

# Step 5: Rename .js files to .ts in firebase directory
echo ""
echo "${BLUE}Step 5: Migrating firebase directory...${NC}"
find firebase -name "*.js" -type f | while read file; do
    newfile="${file%.js}.ts"
    if [ ! -f "$newfile" ]; then
        echo "  Renaming: $file → $newfile"
        mv "$file" "$newfile"
    fi
done

echo ""
echo "${GREEN}✅ File migration complete!${NC}"
echo ""
echo "${YELLOW}⚠️  Next steps:${NC}"
echo "1. Run: npx tsc --noEmit  (to check for type errors)"
echo "2. Fix type errors in migrated files"
echo "3. Run: npm run dev  (to test the application)"
echo "4. Remove old .jsx files if everything works"
echo ""
echo "${BLUE}Note: You may need to add type annotations to fix errors${NC}"
