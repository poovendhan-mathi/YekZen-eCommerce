# 🔍 Code Review Prompt - YekZen eCommerce

> **AI Review Directive**: Analyze the codebase comprehensively and provide actionable feedback with specific examples, severity ratings, and optimization opportunities.

---

## 🎯 Review Scope

Analyze all changed files in the current branch/working tree and provide detailed feedback on:

### 1. 🏗️ Code Quality & Architecture

- **Clean Code Principles**: DRY, SOLID, KISS adherence
- **Code Smells**: Duplicated code, long methods/functions, god objects
- **Naming Conventions**: Variables, functions, components, files follow TypeScript/React standards
- **Component Structure**: Proper React patterns (hooks, composition, type safety)
- **Error Handling**: Try-catch blocks, error boundaries, graceful degradation
- **Performance**: Unnecessary re-renders, heavy computations, memory leaks
- **Maintainability**: Code readability, modularity, single responsibility

### 2. 🔒 Security Analysis

- **Input Validation**: All user inputs validated and sanitized (Zod schemas)
- **Authentication/Authorization**: Protected routes, role-based access
- **Environment Variables**: No hardcoded secrets, proper .env.local usage
- **XSS Prevention**: Proper escaping, avoid dangerouslySetInnerHTML
- **Injection Attacks**: Safe Firestore queries, parameterized operations
- **CSRF Protection**: Proper token usage in forms
- **Dependencies**: No known vulnerabilities (run `npm audit`)
- **API Security**: Rate limiting, CORS, secure endpoints
- **Firebase Rules**: Proper security rules in firestore.rules

### 3. 🧪 Testing & Coverage

- **Test Existence**: All new features have tests (Vitest + RTL)
- **Test Quality**: Meaningful test cases, edge cases, error scenarios
- **Coverage Metrics**: >70% (statements/branches/functions/lines)
- **Test Structure**: Clear describe/it blocks, descriptive names
- **Mocking**: Dependencies properly mocked
- **E2E Tests**: Critical user flows tested (Playwright)
- **Integration Tests**: Component integration verified

### 4. 📊 Quality Gates (SonarQube Standards)

- **Bugs**: Zero bugs in new code
- **Vulnerabilities**: Zero security vulnerabilities
- **Code Smells**: Minimize (target: A rating)
- **Coverage**: >70% test coverage
- **Duplications**: <3% code duplication
- **Maintainability**: Technical debt ratio <5%
- **Reliability**: Code reliability A or B
- **Security**: Security rating A or B
- **Complexity**: Cyclomatic complexity <15 per function

### 5. ⚛️ Next.js 15 & React 19 Best Practices

- **TypeScript**: Strict mode enabled, proper type definitions
- **Server vs Client**: Correct 'use client' directive usage
- **Data Fetching**: Async server components, proper caching (revalidate)
- **Image Optimization**: Using Next.js Image component
- **Routing**: App Router conventions (route groups, layouts)
- **Metadata**: SEO optimization with metadata API
- **Loading/Error States**: loading.tsx, error.tsx, not-found.tsx
- **Streaming**: Suspense boundaries for progressive rendering
- **Code Splitting**: Dynamic imports for heavy components

### 6. 🔥 Firebase Integration

- **Firestore Queries**: Optimized queries, proper indexing
- **Authentication**: Secure auth flow, token refresh
- **Security Rules**: Validated read/write rules
- **Error Handling**: Firebase errors caught and user-friendly
- **Offline Support**: Proper offline data handling
- **Real-time Updates**: Efficient onSnapshot usage
- **Batch Operations**: Batch writes for multiple updates

### 7. 🎨 Styling & UI/UX

- **Tailwind CSS 4.x**: Proper utility classes, no inline styles
- **Responsive Design**: Mobile-first, works on all breakpoints
- **Accessibility (a11y)**: WCAG 2.1 Level AA compliance
  - Semantic HTML
  - ARIA labels
  - Keyboard navigation
  - Screen reader support
- **Framer Motion 11.x**: Smooth animations, proper variants
- **Dark Mode**: Support if applicable
- **Loading Indicators**: User feedback during async operations
- **Error States**: Clear error messages with recovery options

### 8. ⚡ Performance Optimization

- **Bundle Size**: Reasonable bundle size, code splitting
- **Lazy Loading**: Images and components loaded efficiently
- **Memoization**: useMemo, useCallback, React.memo used appropriately
- **Virtual Scrolling**: For long lists (>100 items)
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Caching**: Next.js caching strategies (fetch, revalidate)
- **Database**: Minimize Firestore reads, use pagination

### 9. 📚 Documentation

- **Code Comments**: Complex logic explained (why, not what)
- **TypeScript**: Proper interfaces and type definitions
- **README**: Updated with new features
- **API Documentation**: Endpoints documented
- **Component Props**: TypeScript interfaces for props
- **Architecture Decisions**: Documented in docs/ folder

### 10. 🗂️ Git & Project Structure

- **Commit Messages**: Clear, descriptive, conventional commits
- **Branch Naming**: feature/, bugfix/, hotfix/ conventions
- **File Organization**: Correct directories, proper naming
- **No Debug Code**: No console.log, debugger statements
- **No Dead Code**: Remove commented code
- **Dependencies**: Only necessary packages

---

## 📋 Review Checklist

For each changed file, verify:

- [ ] **Functionality**: Code works as intended
- [ ] **TypeScript**: Proper type definitions, no `any` types
- [ ] **Tests**: Adequate coverage (>70%)
- [ ] **Security**: No vulnerabilities
- [ ] **Performance**: No regressions
- [ ] **Best Practices**: Follows project conventions
- [ ] **Documentation**: Complex logic documented
- [ ] **Accessibility**: UI is accessible
- [ ] **Error Handling**: Errors handled gracefully
- [ ] **No Code Smells**: Clean, maintainable

---

## 🚨 Critical Issues (Blockers)

Flag immediately:

- ❌ Hardcoded API keys, secrets, or credentials
- ❌ SQL/NoSQL injection vulnerabilities
- ❌ XSS vulnerabilities
- ❌ Broken authentication/authorization
- ❌ Missing input validation on user data
- ❌ Failing tests or broken build
- ❌ Critical security vulnerabilities (high/critical CVEs)
- ❌ Major performance issues (>5s load time)
- ❌ Accessibility violations (WCAG 2.1 Level A)
- ❌ Unhandled promise rejections
- ❌ TypeScript errors in strict mode

---

## 📊 Output Format

### 🎯 Executive Summary

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 CODE REVIEW REPORT - YekZen eCommerce                   │
├─────────────────────────────────────────────────────────────┤
│ Files Changed:        [number]                              │
│ Lines Added:          +[X]                                  │
│ Lines Deleted:        -[Y]                                  │
│ Net Change:           [+/-Z]                                │
├─────────────────────────────────────────────────────────────┤
│ Overall Assessment:   [🌟 Excellent/✅ Good/⚠️ Needs Work/❌ Blocked] │
│ Merge Ready:          [✅ Yes / ❌ No]                       │
│ Manual Review:        [Required / Optional]                 │
├─────────────────────────────────────────────────────────────┤
│ Test Coverage:        [XX.XX]%  [✅ Pass / ❌ Fail]         │
│ Security Score:       [A/B/C/D/F]                          │
│ Code Quality:         [A/B/C/D/F]                          │
│ Performance:          [🚀 Excellent/✅ Good/⚠️ Fair/❌ Poor] │
└─────────────────────────────────────────────────────────────┘
```

### ✅ Strengths

List well-implemented aspects:

- ✅ [Specific strength with file reference]
- ✅ [Good practice followed with example]
- ✅ [Highlight of quality code]

### ⚠️ Issues Found

For each issue provide:

````
┌─ Issue #[N] ────────────────────────────────────────
│ Severity:  [🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low]
│ Category:  [Security/Performance/Quality/Testing]
│ File:      [path/to/file.tsx:line]
│
│ Issue:
│   [Clear description of the problem]
│
│ Impact:
│   [What could go wrong if not fixed]
│
│ Recommendation:
│   [Specific steps to fix]
│
│ Code Example:
│   ❌ Bad:
│   ```typescript
│   [problematic code]
│   ```
│
│   ✅ Good:
│   ```typescript
│   [corrected code]
│   ```
└───────────────────────────────────────────────────────
````

### 🔒 Security Findings

```
Security Audit Results:
├─ 🔴 Critical:  [count] issues
├─ 🟠 High:      [count] issues
├─ 🟡 Medium:    [count] issues
└─ 🟢 Low:       [count] issues

Details:
[List each security issue with remediation]
```

### 🧪 Testing Analysis

```
Coverage Report:
├─ Statements:   [XX.XX]% [target: >70%]
├─ Branches:     [XX.XX]% [target: >60%]
├─ Functions:    [XX.XX]% [target: >70%]
└─ Lines:        [XX.XX]% [target: >70%]

Missing Tests:
├─ [Component/Function without tests]
├─ [Edge case not covered]
└─ [Integration test needed]

Recommendations:
- Add tests for: [specific areas]
- Cover edge cases: [specific scenarios]
- Add E2E tests for: [user flows]
```

### 🚀 Performance Analysis

```
Performance Opportunities:
├─ Bundle Size:       [XX KB] [✅ Optimal / ⚠️ Large / ❌ Too Large]
├─ Core Web Vitals:
│  ├─ LCP:            [X.Xs] [target: <2.5s]
│  ├─ FID:            [XXXms] [target: <100ms]
│  └─ CLS:            [0.XX] [target: <0.1]
├─ Database Queries:  [count] Firestore reads
└─ Optimization Tips:
    - [Specific optimization #1]
    - [Specific optimization #2]
```

### 📚 Documentation Gaps

- [ ] Missing JSDoc for: [function/component]
- [ ] Unclear logic in: [file:line]
- [ ] API endpoint not documented: [route]
- [ ] README outdated: [section]

---

## ✨ Recommendations

### 🔴 High Priority (Must fix before merge)

1. [Critical issue that blocks merge]
2. [Security vulnerability to address]
3. [Failing tests to fix]

### 🟡 Medium Priority (Should fix soon)

1. [Code quality improvement]
2. [Performance optimization]
3. [Missing test coverage]

### 🟢 Low Priority (Nice to have)

1. [Documentation enhancement]
2. [Refactoring opportunity]
3. [Code style improvement]

---

## 🎓 Learning Opportunities

**Patterns Used Well:**

- ✅ [Good pattern identified]
- ✅ [Best practice followed]

**Areas for Improvement:**

- 📚 [Learning resource for improvement #1]
- 📚 [Learning resource for improvement #2]

**Suggested Resources:**

- 📖 [Link to relevant documentation]
- 📖 [Tutorial or guide]

---

## 🛠️ Integration with Tools

This review complements:

- **ESLint**: Run `pnpm lint` for static analysis
- **TypeScript**: Run `pnpm type-check` for type errors
- **Vitest**: Run `pnpm test:coverage` for coverage
- **Playwright**: Run `pnpm test:e2e` for E2E tests
- **npm audit**: Check for dependency vulnerabilities

---

## 📖 Project Context

**YekZen eCommerce Platform:**

- **Language**: TypeScript 5.x (strict mode)
- **Framework**: Next.js 15.x (App Router)
- **Backend**: Firebase 11.x (Firestore + Auth)
- **Styling**: Tailwind CSS 4.x + Framer Motion 11.x
- **Testing**: Vitest + React Testing Library + Playwright
- **Payments**: Stripe 17.x + Razorpay 2.x
- **Coverage Target**: 70%

**Project Structure:**

- `app/`: Next.js 15 App Router pages
- `components/`: Reusable TypeScript components
- `contexts/`: React Context providers
- `lib/`: Utility libraries and helpers
- `types/`: TypeScript type definitions
- `services/`: Business logic & API services

**Critical Rules:**

- ✅ Always use TypeScript with strict mode
- ✅ Follow Next.js 15 App Router patterns
- ✅ Use Tailwind CSS 4.x for styling
- ✅ Maintain >70% test coverage
- ✅ Proper error handling everywhere
- ✅ WCAG 2.1 accessibility standards
- ❌ No hardcoded secrets or API keys
- ❌ No console.log in production code
- ❌ No `any` types unless absolutely necessary

**Documentation References:**

- See [.github/copilot-instructions.md](../.github/copilot-instructions.md) for full guidelines
- See [docs/TESTING-GUIDE.md](../../docs/TESTING-GUIDE.md) for testing practices
- See [docs/architecture-diagrams.md](../../docs/architecture-diagrams.md) for architecture

---

## 💡 How to Use This Prompt

### Full Project Review

```
Review the entire project following the comprehensive checklist above.
Focus on security, TypeScript types, and SonarQube quality gates.
Generate a detailed report with specific file references.
```

### Pre-Commit Review

```
Perform a pre-commit review of my staged changes.
Check for: security issues, missing tests, TypeScript errors,
performance issues, and documentation gaps.
Provide actionable recommendations with code examples.
```

### Specific File Review

```
Review [filename] for:
- Security vulnerabilities
- Code smells and anti-patterns
- TypeScript type safety
- Next.js 15 best practices
- Performance optimizations
```

### Security Audit

```
Perform a security-focused review:
- Authentication/authorization flows
- Input validation and sanitization
- Environment variable usage
- Firebase security rules
- Dependency vulnerabilities
Generate a security report with severity ratings.
```

---

**Last Updated**: January 2025  
**Review Template Version**: 2.0.0

---

**Last Updated**: January 2025  
**Review Template Version**: 2.0.0

---

## 🎯 Quick Commands for Copilot

Use these in GitHub Copilot Chat:

```
@workspace Use .github/prompts/review.prompt.md to review my changes
```

```
Review my staged files using .github/prompts/review.prompt.md
Generate a detailed report with specific recommendations
```

```
Security audit using .github/prompts/review.prompt.md
Focus on authentication, input validation, and Firebase rules
```
