# .github Directory - Documentation & Automation System

This directory contains the complete documentation and code review automation system for YekZen eCommerce.

## 📁 Directory Structure

```
.github/
├── workflows/
│   └── generate-docs.yml          # Automated documentation generation
├── actions/
│   ├── generate-readme/           # README generator action
│   │   ├── action.yml
│   │   └── index.js
│   └── generate-review/           # Code review generator action
│       ├── action.yml
│       └── index.js
├── templates/
│   ├── README.template.md         # README template with placeholders
│   └── REVIEW.template.md         # Code review template
├── scripts/
│   └── generate-docs-local.js     # Local documentation generator
├── review.md                      # Comprehensive review checklist
├── copilot-instructions.md        # AI assistant guidelines
├── DOCUMENTATION-GUIDE.md         # Usage guide
└── SETUP-COMPLETE.md              # Setup summary
```

## 🚀 Quick Start

### Use Review Prompt in Copilot Chat

```
@workspace Review my changes using .github/review.md
```

### Generate Documentation Locally

```bash
npm run docs:generate    # All docs
npm run docs:readme      # README only
npm run docs:review      # Review only
```

## 📚 Key Files

### review.md

**Comprehensive code review checklist** for use in GitHub Copilot Chat.

Covers:

- Code quality & best practices
- Security analysis
- Testing coverage
- SonarQube quality gates
- Next.js & React best practices
- Firebase integration
- Performance optimization
- Accessibility
- Documentation

**Usage:**

```
@workspace Review using .github/review.md for:
- Security vulnerabilities
- Code smells
- Test coverage
- Performance issues
```

### copilot-instructions.md

**Project-specific guidelines** for AI assistants.

Includes:

- Tech stack conventions
- Code style guidelines
- Component patterns
- Testing requirements
- Security best practices
- Common anti-patterns

### Templates

**README.template.md**

- Template for auto-generating README.md
- Placeholders: `{{COVERAGE}}`, `{{VERSION}}`, etc.
- Updated automatically on push

**REVIEW.template.md**

- Template for code review reports
- Placeholders: `{{TESTS_PASSING}}`, `{{LINT_ERRORS}}`, etc.
- Generated for every PR

### Documentation

**DOCUMENTATION-GUIDE.md**

- Complete usage guide
- Examples and tips
- Customization instructions

**SETUP-COMPLETE.md**

- Setup summary
- Features overview
- Quick reference

## 🤖 Automation

### GitHub Actions Workflow

**Triggers:**

- Push to `main` or `develop`
- Pull requests to `main`
- Manual dispatch

**Actions:**

1. **Generate README**: Updates README.md with current metrics
2. **Generate Review**: Creates comprehensive code review for PRs

### Local Generation

**Script:** `scripts/generate-docs-local.js`

**Usage:**

```bash
node .github/scripts/generate-docs-local.js [readme|review|all]
```

Or via npm:

```bash
npm run docs:generate
npm run docs:readme
npm run docs:review
```

## 💡 Usage Examples

### Pre-Commit Review

```bash
npm run docs:review
cat REVIEW.md
# Fix issues, then commit
```

### Using Copilot Chat

```
@workspace Using .github/review.md, review my staged changes:
1. Security vulnerabilities?
2. Test coverage >70%?
3. Code smells?
4. Documentation complete?
```

### Automatic on PR

- Create PR
- GitHub Actions runs automatically
- Review posted as comment
- Full report in artifacts

## 🎯 Benefits

✅ **Consistent Reviews** - Same standards for all code  
✅ **Security Checks** - Comprehensive security analysis  
✅ **Quality Gates** - SonarQube-style checks  
✅ **Time Savings** - Automated documentation and reviews  
✅ **Best Practices** - Enforced coding standards  
✅ **Easy Access** - Use via Copilot Chat with `/`

## 📖 Documentation

For detailed information, see:

- **DOCUMENTATION-GUIDE.md** - Complete usage guide
- **SETUP-COMPLETE.md** - Setup summary
- **review.md** - Review checklist
- **copilot-instructions.md** - Project guidelines

## 🔧 Customization

### Add Custom Review Criteria

Edit `review.md` to add your checks.

### Modify Templates

Edit templates in `templates/` directory.

### Adjust Thresholds

Edit action scripts in `actions/*/index.js`.

## 📞 Support

**Questions?**

- Check DOCUMENTATION-GUIDE.md
- Review SETUP-COMPLETE.md
- Contact maintainers

**Commands:**

```bash
npm run docs:generate    # Generate all docs
npm run docs:readme      # Generate README
npm run docs:review      # Generate review
npm run test:coverage    # Get coverage
npm run lint            # Check code quality
```

---

**YekZen eCommerce** | Documentation System v1.0 | October 2025
