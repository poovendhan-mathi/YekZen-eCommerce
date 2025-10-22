#!/usr/bin/env node

/**
 * Local Documentation Generator
 *
 * Run this script to generate README.md and REVIEW.md locally
 * Usage: node .github/scripts/generate-docs-local.js [readme|review|all]
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const mode = args[0] || "all";

console.log("📚 YekZen Documentation Generator");
console.log("================================\n");

/**
 * Generate README.md
 */
function generateReadme() {
  console.log("📖 Generating README.md...\n");

  try {
    // Set environment variables
    process.env.INPUT_TEMPLATE_PATH = ".github/templates/README.template.md";
    process.env.INPUT_OUTPUT_PATH = "README.md";

    // Run the generator
    require("../actions/generate-readme/index.js");

    console.log("\n✅ README.md generated successfully!\n");
    return true;
  } catch (error) {
    console.error("❌ Error generating README:", error.message);
    return false;
  }
}

/**
 * Generate REVIEW.md
 */
function generateReview() {
  console.log("🔍 Generating REVIEW.md...\n");

  try {
    // Run tests to get metrics
    console.log("Running tests to gather metrics...");

    let coverage = "0";
    let lintErrors = "0";
    let lintWarnings = "0";

    // Try to get coverage
    try {
      execSync("npm run test:coverage", { stdio: "pipe" });
      if (fs.existsSync("coverage/coverage-summary.json")) {
        const coverageData = JSON.parse(
          fs.readFileSync("coverage/coverage-summary.json", "utf8")
        );
        coverage = coverageData.total.statements.pct.toFixed(2);
      }
    } catch (error) {
      console.log("⚠️  Could not generate coverage data");
    }

    // Try to get lint results
    try {
      execSync("npm run lint", { stdio: "pipe" });
    } catch (error) {
      const output = error.stdout?.toString() || "";
      const errorMatch = output.match(/(\d+)\s+error/);
      const warningMatch = output.match(/(\d+)\s+warning/);

      if (errorMatch) lintErrors = errorMatch[1];
      if (warningMatch) lintWarnings = warningMatch[1];
    }

    // Get git stats
    let filesChanged = "0";
    let linesAdded = "0";
    let linesDeleted = "0";

    try {
      const diffStat = execSync("git diff --shortstat HEAD~1", {
        encoding: "utf8",
      });
      const insertionMatch = diffStat.match(/(\d+)\s+insertion/);
      const deletionMatch = diffStat.match(/(\d+)\s+deletion/);

      if (insertionMatch) linesAdded = insertionMatch[1];
      if (deletionMatch) linesDeleted = deletionMatch[1];

      const changedFiles = execSync("git diff --name-only HEAD~1", {
        encoding: "utf8",
      });
      filesChanged = changedFiles.split("\n").filter(Boolean).length.toString();
    } catch (error) {
      console.log("⚠️  Could not get git diff (using current working tree)");

      try {
        const status = execSync("git status --short", { encoding: "utf8" });
        filesChanged = status.split("\n").filter(Boolean).length.toString();
      } catch (e) {
        // Ignore
      }
    }

    // Set environment variables
    process.env.INPUT_TEMPLATE_PATH = ".github/templates/REVIEW.template.md";
    process.env.INPUT_OUTPUT_PATH = "REVIEW.md";
    process.env.INPUT_COVERAGE = coverage;
    process.env.INPUT_LINT_ERRORS = lintErrors;
    process.env.INPUT_LINT_WARNINGS = lintWarnings;
    process.env.INPUT_FILES_CHANGED = filesChanged;
    process.env.INPUT_LINES_ADDED = linesAdded;
    process.env.INPUT_LINES_DELETED = linesDeleted;

    // Run the generator
    require("../actions/generate-review/index.js");

    console.log("\n✅ REVIEW.md generated successfully!\n");
    return true;
  } catch (error) {
    console.error("❌ Error generating REVIEW:", error.message);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  let success = true;

  if (mode === "readme" || mode === "all") {
    success = generateReadme() && success;
  }

  if (mode === "review" || mode === "all") {
    success = generateReview() && success;
  }

  if (mode !== "readme" && mode !== "review" && mode !== "all") {
    console.error("❌ Invalid mode. Use: readme, review, or all");
    console.log("\nUsage:");
    console.log(
      "  node .github/scripts/generate-docs-local.js readme  # Generate README only"
    );
    console.log(
      "  node .github/scripts/generate-docs-local.js review  # Generate REVIEW only"
    );
    console.log(
      "  node .github/scripts/generate-docs-local.js all     # Generate both (default)"
    );
    process.exit(1);
  }

  if (success) {
    console.log("🎉 Documentation generation complete!\n");
    console.log("Generated files:");
    if (mode === "readme" || mode === "all") {
      console.log("  - README.md");
    }
    if (mode === "review" || mode === "all") {
      console.log("  - REVIEW.md");
    }
    console.log("\nNext steps:");
    console.log("  1. Review the generated documentation");
    console.log("  2. Make any manual adjustments if needed");
    console.log("  3. Commit the changes");
  } else {
    console.error("\n❌ Documentation generation failed");
    process.exit(1);
  }
}

// Run main
main();
