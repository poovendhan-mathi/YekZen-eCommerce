# 🎯 How to Use the Review Prompt

## Quick Reference Card

### In GitHub Copilot Chat

Type one of these commands:

```
@workspace Review my changes using .github/review.md
```

```
Using the comprehensive checklist in .github/review.md, review my current changes
```

```
Review my staged files following .github/review.md standards
```

## 📋 Common Review Commands

### 1. Full Project Review

```
@workspace Review the entire project using .github/review.md.
Focus on security, code quality, and best practices.
```

### 2. Current Changes Only

```
@workspace Review my uncommitted and staged changes using .github/review.md.
Check for: security issues, code smells, missing tests, and performance problems.
```

### 3. Specific File Review

```
@workspace Review app/products/page.js using .github/review.md checklist.
Focus on: component structure, error handling, and accessibility.
```

### 4. Pre-Commit Review

```
@workspace Perform a pre-commit review of my staged changes using .github/review.md.
Verify: tests exist, coverage >70%, no security issues, documentation complete.
```

### 5. Security-Focused Review

```
@workspace Security review using .github/review.md:
- Authentication/authorization in components/auth/
- Firebase security rules in firestore.rules
- Input validation in app/api/ routes
- XSS prevention
- Environment variable usage
```

### 6. Performance Review

```
@workspace Performance review per .github/review.md:
- Bundle size impact
- Unnecessary re-renders
- Database query optimization
- Image optimization
- Loading states
```

### 7. Testing Review

```
@workspace Testing review using .github/review.md:
- Test coverage >70%?
- Edge cases covered?
- Proper mocking?
- E2E tests for critical flows?
```

### 8. SonarQube-Style Review

```
@workspace SonarQube-style analysis using .github/review.md quality gates:
Report: bugs, vulnerabilities, code smells, coverage, duplications, complexity
```

## 🛠️ Local Review Generation

### Generate Review Report

```bash
npm run docs:review
```

This creates `REVIEW.md` with:

- Changed files analysis
- Test results and coverage
- Lint errors and warnings
- Security assessment
- Recommendations

### View the Report

```bash
cat REVIEW.md
```

Or open in VS Code:

```bash
code REVIEW.md
```

## 💡 Tips for Best Results

### Be Specific

Instead of:

```
Review my code
```

Use:

```
Using .github/review.md, review app/checkout/page.js for:
1. Payment security
2. Error handling
3. Input validation
4. Test coverage
```

### Mention Context

```
@workspace I just refactored the auth system. Using .github/review.md, check for:
- Breaking changes
- Security regressions
- Test coverage maintained
- Documentation updated
```

### Ask for Prioritization

```
@workspace Review using .github/review.md and categorize issues by severity:
- Critical (must fix before commit)
- High (fix before PR)
- Medium (fix before merge)
- Low (nice to have)
```

## 🎯 Review Workflow

### Before Committing

1. Stage your changes:

   ```bash
   git add .
   ```

2. Get AI review:

   ```
   @workspace Pre-commit review using .github/review.md
   ```

3. Or generate local review:

   ```bash
   npm run docs:review
   ```

4. Fix issues

5. Commit:
   ```bash
   git commit -m "feat: your changes"
   ```

### Before Creating PR

1. Generate documentation:

   ```bash
   npm run docs:generate
   ```

2. Get comprehensive review:

   ```
   @workspace Comprehensive review using .github/review.md for PR readiness
   ```

3. Address feedback

4. Create PR

### Reviewing Others' PRs

```
@workspace Review the changes in this PR using .github/review.md.
Provide constructive feedback on code quality, security, and best practices.
```

## 📊 What Gets Checked

✅ **Code Quality** - Clean code, SOLID, DRY, KISS  
✅ **Security** - Auth, validation, XSS, injection prevention  
✅ **Testing** - Coverage >70%, edge cases, E2E tests  
✅ **Performance** - Bundle size, optimizations, database queries  
✅ **Accessibility** - WCAG 2.1, semantic HTML, ARIA  
✅ **Documentation** - Comments, JSDoc, README updates  
✅ **Best Practices** - Next.js patterns, React hooks, Firebase  
✅ **SonarQube Gates** - Bugs, vulnerabilities, code smells

## 🚨 Critical Issues Flagged

The review will immediately flag:

- ❌ Hardcoded API keys or secrets
- ❌ Security vulnerabilities (XSS, injection)
- ❌ Broken authentication/authorization
- ❌ Missing input validation
- ❌ Failing tests or broken build
- ❌ Major performance issues
- ❌ Accessibility violations

## 🎓 Example Session

```
You: @workspace Review my changes using .github/review.md

Copilot: I'll review your changes using the comprehensive checklist...

[Analyzes code]

Summary:
- 5 files changed
- Security: ✅ No issues
- Tests: ⚠️ Coverage at 65% (target 70%)
- Code Quality: ✅ Good
- Performance: ✅ No concerns

Issues Found:
1. [Medium] app/products/page.js:45
   - Missing error handling for API call
   - Recommendation: Add try-catch block

2. [Low] components/ProductCard.jsx:23
   - Consider memoizing product object
   - Recommendation: Use useMemo for expensive calculations

Recommendations:
- Add tests for error scenarios in products page
- Increase coverage to meet 70% threshold
- Consider adding loading skeleton

You: Thanks! I'll fix the error handling and add tests.
```

## 📚 Additional Resources

- **Full Checklist**: `.github/review.md`
- **Usage Guide**: `.github/DOCUMENTATION-GUIDE.md`
- **Setup Summary**: `.github/SETUP-COMPLETE.md`
- **Project Guidelines**: `.github/copilot-instructions.md`

## 🆘 Troubleshooting

**Issue**: Copilot doesn't recognize review.md
**Solution**: Reference it explicitly:

```
@workspace Using .github/review.md, review my code
```

**Issue**: Want more specific feedback
**Solution**: Be more specific in your request:

```
@workspace Review app/api/checkout/route.js for:
1. Stripe integration security
2. Error handling
3. Input validation
4. Rate limiting
```

**Issue**: Need review for specific framework
**Solution**: Mention the framework:

```
@workspace Review Next.js App Router usage in app/products/ using .github/review.md
```

## ✨ Summary

**Quick Command:**

```
@workspace Review using .github/review.md
```

**Local Generation:**

```bash
npm run docs:review
```

**What You Get:**

- Comprehensive code analysis
- Security assessment
- Quality metrics
- Actionable recommendations
- Best practice validation

**Remember:**

- Be specific in your requests
- Use before committing
- Address critical issues immediately
- Maintain >70% test coverage
- Follow project conventions

---

**Ready to use!** Just type the command in Copilot Chat or run the npm script. 🚀
