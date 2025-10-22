#!/bin/bash

# YekZen eCommerce - Test Coverage Script
# Runs tests with coverage and generates comprehensive reports

echo "🧪 YekZen eCommerce - Running Tests with Coverage"
echo "=================================================="

# Clean previous coverage
echo "🧹 Cleaning previous coverage reports..."
rm -rf coverage

# Run tests with coverage
echo "🚀 Running Jest tests with coverage..."
npm run test:coverage

# Check if tests passed
if [ $? -eq 0 ]; then
  echo "✅ All tests passed!"
  
  # Display coverage summary
  echo ""
  echo "📊 Coverage Summary:"
  echo "==================="
  
  if [ -f coverage/coverage-summary.json ]; then
    node -e "
      const summary = require('./coverage/coverage-summary.json');
      const total = summary.total;
      console.log('Statements: ' + total.statements.pct + '%');
      console.log('Branches:   ' + total.branches.pct + '%');
      console.log('Functions:  ' + total.functions.pct + '%');
      console.log('Lines:      ' + total.lines.pct + '%');
    "
  fi
  
  echo ""
  echo "📁 Coverage reports generated:"
  echo "  - HTML Report: coverage/lcov-report/index.html"
  echo "  - LCOV Report: coverage/lcov.info"
  echo "  - JSON Summary: coverage/coverage-summary.json"
  echo ""
  echo "💡 Open the HTML report in your browser:"
  echo "   open coverage/lcov-report/index.html"
  
else
  echo "❌ Tests failed!"
  exit 1
fi
