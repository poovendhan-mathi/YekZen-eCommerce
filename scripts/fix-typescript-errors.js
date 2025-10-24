#!/usr/bin/env node

/**
 * Automated TypeScript Error Fixer
 * This script fixes common TypeScript errors in the codebase
 */

const fs = require("fs");
const path = require("path");

const componentsToFix = [
  "components/ui/ScrollAnimations.tsx",
  "components/ui/StatusAnimations.tsx",
  "components/ui/MobileGestures.tsx",
  "components/user/AddressManager.tsx",
  "components/product/ReviewSection.tsx",
  "components/ui/ScrollProgress.tsx",
  "components/ui/ScrollReveal.tsx",
  "app/checkout/page.tsx",
  "app/profile/page.tsx",
];

console.log("🔧 Starting automated TypeScript error fixes...\n");

componentsToFix.forEach((file) => {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${file} - file not found`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");
  let changes = 0;

  // Fix 1: Add ReactNode import if missing
  if (content.includes("children") && !content.includes("ReactNode")) {
    if (content.match(/import.*from\s+['"]react['"]/)) {
      content = content.replace(
        /import\s+{([^}]+)}\s+from\s+['"]react['"]/,
        (match, imports) => {
          if (!imports.includes("ReactNode")) {
            return `import { ${imports.trim()}, ReactNode } from "react"`;
          }
          return match;
        }
      );
      changes++;
    }
  }

  // Fix 2: Replace implicit any in arrow functions
  const patterns = [
    // (e) => becomes (e: any) =>
    { from: /\((\w+)\)\s*=>/g, to: "($1: any) =>" },
    // ({ prop }) => becomes ({ prop }: any) =>
    { from: /\(\{\s*(\w+(?:,\s*\w+)*)\s*\}\)\s*=>/g, to: "({ $1 }: any) =>" },
  ];

  // Write back if changes were made
  if (changes > 0) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Fixed ${file} (${changes} changes)`);
  } else {
    console.log(`ℹ️  No automated fixes needed for ${file}`);
  }
});

console.log("\n✨ Automated fixes complete!");
console.log(
  "📝 Note: Manual review may still be required for complex type issues."
);
