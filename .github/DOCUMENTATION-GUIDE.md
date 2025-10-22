# 📚 Documentation System Guide

## Overview

The YekZen eCommerce project includes a comprehensive documentation automation system with:

1. **README.md** - Auto-generated project documentation
2. **REVIEW.md** - Code review reports with quality metrics
3. **GitHub Copilot Review Prompt** - Accessible via `/` in Copilot Chat
4. **GitHub Actions** - Automated documentation generation on push/PR

---

## 🚀 Quick Start

### Using the Review Prompt in Copilot Chat

**Access the Review Prompt:**

1. Open GitHub Copilot Chat (Ctrl+Cmd+I or Ctrl+Alt+I)
2. Type `@workspace /` to see available prompts
3. Reference the review prompt: `@workspace /review` or use the file directly

**Common Review Commands:**

```
# Full project review
Review my entire codebase following .github/review.md checklist

# Current changes only
Review my uncommitted and staged changes using .github/review.md

# Specific file review
Review app/products/page.js for security and best practices per .github/review.md

# Pre-commit review
Perform a pre-commit review of my staged files using .github/review.md standards

# SonarQube-style analysis
Analyze the codebase with SonarQube quality gates from .github/review.md
```

**Alternative: Direct Reference**

```
Using the comprehensive checklist in .github/review.md, review my current changes and provide:
- Security analysis
- Code quality assessment
- Testing gaps
- Performance opportunities
- Best practice violations
```

---

## 🛠️ Local Documentation Generation

### Generate All Documentation

```bash
npm run docs:generate
```

This will:

- Run tests with coverage
- Generate README.md from template
- Generate REVIEW.md for current changes
- Update all metrics

### Generate README Only

```bash
npm run docs:readme
```

Updates README.md with:

- Current test coverage
- Project version
- Git statistics
- Quality metrics

### Generate Code Review Only

```bash
npm run docs:review
```

Creates REVIEW.md with:

- Changed files analysis
- Test results
- Lint errors/warnings
- Coverage metrics
- Security scan
- Recommendations

---

## 📋 Review Prompt Features

The `.github/review.md` prompt provides:

### ✅ Comprehensive Checks

- **Code Quality**: Clean code principles, SOLID, DRY, KISS
- **Security**: Input validation, XSS, injection prevention, auth
- **Testing**: Coverage >70%, edge cases, E2E tests
- **Performance**: Bundle size, lazy loading, optimizations
- **Best Practices**: Next.js patterns, React hooks, Firebase integration
- **Accessibility**: WCAG 2.1 compliance, semantic HTML, ARIA
- **Documentation**: Code comments, JSDoc, README updates
- **SonarQube**: Bugs, vulnerabilities, code smells, duplications

### 🎯 Usage Scenarios

**1. Before Committing**

```
Review my staged changes using .github/review.md.
Focus on security issues, missing tests, and code smells.
```

**2. Before Creating PR**

```
Comprehensive review of my branch changes per .github/review.md.
Check for breaking changes, security vulnerabilities, and test coverage.
```

**3. Reviewing Someone Else's PR**

```
Review the changes in PR #123 using .github/review.md standards.
Provide constructive feedback on code quality and security.
```

**4. Refactoring Check**

```
Review my refactored code against .github/review.md checklist.
Ensure no regressions, improved maintainability, and proper tests.
```

**5. New Feature Review**

```
Review my new feature implementation using .github/review.md.
Verify tests, documentation, accessibility, and performance.
```

---

## 🤖 GitHub Actions Automation

### Automatic README Generation

Triggers on:

- Push to `main` or `develop` branches
- Pull requests to `main`

What it does:

1. Runs tests with coverage
2. Calculates metrics (coverage %, test results)
3. Generates README.md from template
4. Commits changes automatically (if on push)

### Automatic Code Review on PRs

Triggers on:

- Pull request creation/update

What it does:

1. Runs linter and collects errors/warnings
2. Runs tests and calculates coverage
3. Gets git diff stats (files changed, lines added/deleted)
4. Generates comprehensive REVIEW.md
5. Posts review as PR comment
6. Uploads full review as artifact

### Workflow Files

- `.github/workflows/generate-docs.yml` - Main workflow
- `.github/actions/generate-readme/` - README generator action
- `.github/actions/generate-review/` - Review generator action

---

## 📝 Template System

### README Template

**Location**: `.github/templates/README.template.md`

**Placeholders**:

- `{{VERSION}}` - Package version
- `{{COVERAGE}}` - Test coverage percentage
- `{{QUALITY_METRICS}}` - Detailed coverage breakdown
- `{{LIGHTHOUSE_SCORE}}` - Performance score
- `{{LAST_UPDATED}}` - Generation timestamp
- `{{PROJECT_STATUS}}` - Status badge (stable/development/alpha)
- `{{TESTS_STATUS}}` - Tests passing count
- `{{COMMIT_COUNT}}` - Total commits
- `{{CONTRIBUTOR_COUNT}}` - Number of contributors

### Review Template

**Location**: `.github/templates/REVIEW.template.md`

**Placeholders**:

- `{{TIMESTAMP}}` - Review timestamp
- `{{BRANCH}}` - Current branch
- `{{COMMIT_SHA}}` - Commit hash
- `{{FILES_CHANGED}}` - Number of files changed
- `{{LINES_ADDED}}` / `{{LINES_DELETED}}` - Code changes
- `{{COVERAGE}}` - Coverage percentage
- `{{TESTS_PASSING}}` / `{{TESTS_TOTAL}}` - Test results
- `{{LINT_ERRORS}}` / `{{LINT_WARNINGS}}` - Linting issues
- And many more...

---

## 💡 Tips & Best Practices

### For Code Reviews

**Always check before commit:**

```bash
# Generate review locally
npm run docs:review

# Review the generated REVIEW.md
cat REVIEW.md

# Fix any critical issues
# Then commit
```

**Use in Copilot Chat:**

```
Review my changes using .github/review.md:
1. Security vulnerabilities?
2. Test coverage adequate?
3. Any code smells?
4. Performance concerns?
5. Documentation complete?
```

### For Documentation

**Keep README updated:**

```bash
# After adding features or fixing bugs
npm run docs:readme

# Commit the updated README
git add README.md
git commit -m "docs: update README with latest metrics"
```

**Review workflow:**

1. Make code changes
2. Write/update tests
3. Run `npm run docs:review`
4. Fix any issues found
5. Run `npm run docs:generate`
6. Commit everything together

---

## 🔧 Customization

### Adding Custom Review Criteria

Edit `.github/review.md`:

```markdown
### 11. Your Custom Check

- **Criteria 1**: Description
- **Criteria 2**: Description
```

### Adding Template Placeholders

1. Edit template (e.g., `.github/templates/README.template.md`)
2. Add placeholder: `{{YOUR_PLACEHOLDER}}`
3. Edit action script (e.g., `.github/actions/generate-readme/index.js`)
4. Add replacement:
   ```javascript
   template = template.replace(/\{\{YOUR_PLACEHOLDER\}\}/g, yourValue);
   ```

### Modifying Quality Thresholds

Edit action scripts to change thresholds:

```javascript
// In generate-review/index.js
const coverageStatus = coverage >= 80 ? "✅" : "❌"; // Change 80 to your threshold
```

---

## 🎓 Examples

### Example 1: Pre-Commit Review

```bash
# Stage your changes
git add .

# Generate review
npm run docs:review

# Check REVIEW.md
# If all good, commit
git commit -m "feat: add product filtering"
```

### Example 2: Using Copilot for Security Review

```
@workspace Using .github/review.md, perform a security-focused review:
- Check all authentication flows in components/auth/
- Review Firebase security rules in firestore.rules
- Verify input validation in api/ routes
- Look for XSS vulnerabilities
- Check environment variable usage
```

### Example 3: Performance Review

```
@workspace Review my changes for performance issues per .github/review.md:
- Unnecessary re-renders?
- Bundle size impact?
- Database query optimization?
- Image optimization?
- Loading state handling?
```

### Example 4: Accessibility Review

```
@workspace Accessibility review using .github/review.md:
- Semantic HTML usage?
- ARIA labels present?
- Keyboard navigation working?
- Color contrast acceptable?
- Screen reader friendly?
```

---

## 📞 Support

**Questions or Issues?**

- Check `.github/review.md` for full review criteria
- Check `.github/copilot-instructions.md` for project guidelines
- Review workflow logs in GitHub Actions
- Contact maintainers for help

**Useful Commands:**

```bash
npm run docs:generate    # Generate all docs
npm run docs:readme      # Generate README only
npm run docs:review      # Generate review only
npm run test:coverage    # Run tests with coverage
npm run lint            # Check code quality
```

---

## 🎯 Summary

**For Quick Reviews:**

- Use `.github/review.md` in Copilot Chat
- Type: `Review using .github/review.md`

**For Local Reviews:**

- Run: `npm run docs:review`
- Check: `REVIEW.md`

**For Automated Reviews:**

- Create PR
- GitHub Actions runs automatically
- Check PR comments and artifacts

**Remember:**

- ✅ Always review before committing
- ✅ Maintain >70% test coverage
- ✅ Fix security issues immediately
- ✅ Keep documentation updated
- ✅ Follow project conventions

---

**Last Updated**: October 2025  
**Maintained By**: YekZen Development Team
