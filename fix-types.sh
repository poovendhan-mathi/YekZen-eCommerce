#!/bin/bash

# This script will help identify the remaining TypeScript errors
echo "Running TypeScript compiler to identify remaining errors..."
npx tsc --noEmit 2>&1 | tee /tmp/ts-errors.log

# Count errors per file
echo -e "\n\nError summary by file:"
grep "^[a-zA-Z]" /tmp/ts-errors.log | cut -d'(' -f1 | sort | uniq -c | sort -rn | head -20
