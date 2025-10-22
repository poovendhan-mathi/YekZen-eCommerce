# Code Review Prompt

Review the current changes in this codebase with a comprehensive analysis covering:

## 🎯 What to Review

Analyze all changed files in the current branch/working tree and provide detailed feedback on:

### 1. Code Quality & Best Practices

- **Clean Code Principles**: DRY, SOLID, KISS
- **Code Smells**: Identify duplicated code, long methods, large classes
- **Naming Conventions**: Variables, functions, components follow project standards
- **Component Structure**: Proper React patterns (hooks, composition, props validation)
- **Error Handling**: Try-catch blocks, error boundaries, graceful degradation
- **Performance**: Unnecessary re-renders, heavy computations, memory leaks
- **Maintainability**: Code readability, documentation, modularity

### 2. Security Analysis

- **Input Validation**: All user inputs properly validated and sanitized
- **Authentication/Authorization**: Proper access controls, protected routes
- **Environment Variables**: No hardcoded secrets, proper .env usage
- **XSS Prevention**: Proper escaping, dangerouslySetInnerHTML usage
- **SQL/NoSQL Injection**: Safe database queries (Firestore)
- **CSRF Protection**: Proper token usage in forms
- **Dependencies**: No known vulnerabilities (check package.json)
- **API Security**: Rate limiting, CORS configuration, secure endpoints
- **Firebase Security Rules**: Proper Firestore and Storage rules

### 3. Testing Coverage

- **Test Existence**: All new features have corresponding tests
- **Test Quality**: Meaningful test cases, edge cases covered
- **Coverage Metrics**: Maintain >70% coverage (statements/branches/functions/lines)
- **Test Structure**: Proper describe/it blocks, clear test names
- **Mocking**: Dependencies properly mocked
- **E2E Tests**: Critical user flows tested with Playwright

### 4. SonarQube Quality Gates

- **Bugs**: Zero bugs in new code
- **Vulnerabilities**: Zero security vulnerabilities
- **Code Smells**: Minimize code smells (target: A rating)
- **Coverage**: Maintain test coverage above 70%
- **Duplications**: Keep code duplication below 3%
- **Maintainability**: Technical debt ratio below 5%
- **Reliability**: Code reliability rating A or B
- **Security**: Security rating A or B
- **Complexity**: Cyclomatic complexity reasonable (< 15 per function)

### 5. Next.js & React Best Practices

- **Server vs Client Components**: Proper use of 'use client' directive
- **Data Fetching**: Async server components, proper caching strategies
- **Image Optimization**: Using Next.js Image component
- **Routing**: App Router conventions followed
- **Metadata**: Proper SEO optimization with metadata API
- **Loading States**: Loading.js, error.js, not-found.js properly implemented
- **Streaming**: Suspense boundaries for progressive rendering
- **Code Splitting**: Dynamic imports for heavy components

### 6. Firebase Integration

- **Firestore Queries**: Optimized queries, proper indexing
- **Authentication**: Secure auth flow, token management
- **Security Rules**: Proper read/write rules in firestore.rules
- **Error Handling**: Firebase errors properly caught and handled
- **Offline Support**: Proper offline data handling
- **Real-time Updates**: Efficient use of onSnapshot
- **Batch Operations**: Using batch writes where appropriate

### 7. Styling & UI

- **Tailwind CSS**: Proper utility class usage, no inline styles
- **Responsive Design**: Mobile-first approach, works on all devices
- **Accessibility (a11y)**: Semantic HTML, ARIA labels, keyboard navigation
- **Framer Motion**: Smooth animations, proper variants
- **Dark Mode**: Support if applicable
- **Loading Indicators**: User feedback for async operations
- **Error States**: Proper error UI with recovery options

### 8. Performance Optimization

- **Bundle Size**: Keep bundle size reasonable
- **Lazy Loading**: Images, components loaded efficiently
- **Memoization**: useMemo, useCallback used appropriately
- **Virtual Scrolling**: For long lists
- **Web Vitals**: LCP, FID, CLS optimization
- **Caching**: Proper use of Next.js caching (fetch, revalidate)
- **Database Queries**: Minimize reads, use pagination

### 9. Documentation

- **Code Comments**: Complex logic explained (why, not what)
- **JSDoc**: Functions have proper type hints
- **README**: Updated with new features/changes
- **API Documentation**: Endpoints documented
- **Component Props**: PropTypes or TypeScript definitions
- **Architecture Decisions**: Documented in docs/ folder

### 10. Git & Project Structure

- **Commit Messages**: Clear, descriptive, follow conventions
- **Branch Naming**: Follows conventions (feature/, bugfix/, hotfix/)
- **File Organization**: Files in correct directories
- **Naming Conventions**: Files follow project standards
- **No Debug Code**: No console.log, debugger statements
- **No Commented Code**: Remove dead code
- **Dependencies**: Only necessary packages added

## 📋 Review Checklist

For each changed file, verify:

- [ ] **Functionality**: Code works as intended
- [ ] **Tests**: Adequate test coverage (>70%)
- [ ] **Security**: No vulnerabilities or security risks
- [ ] **Performance**: No performance regressions
- [ ] **Best Practices**: Follows project conventions
- [ ] **Documentation**: Complex logic documented
- [ ] **Accessibility**: UI is accessible
- [ ] **Error Handling**: Errors handled gracefully
- [ ] **Type Safety**: JSDoc or proper validation
- [ ] **No Code Smells**: Clean, maintainable code

## 🚨 Critical Issues to Flag

Immediately flag these as blockers:

- ❌ Hardcoded API keys, secrets, or credentials
- ❌ SQL/NoSQL injection vulnerabilities
- ❌ XSS vulnerabilities
- ❌ Broken authentication/authorization
- ❌ Missing input validation on user data
- ❌ Failing tests or broken build
- ❌ Critical security vulnerabilities
- ❌ Major performance issues (>5s load time)
- ❌ Accessibility violations (WCAG 2.1 Level A)
- ❌ Unhandled promise rejections

## 📊 Output Format

Provide review in this structure:

### 🎯 Summary

- **Files Changed**: [number]
- **Lines Added/Deleted**: [+X / -Y]
- **Overall Assessment**: [Excellent/Good/Needs Work/Blocked]
- **Merge Ready**: [Yes/No]

### ✅ Strengths

- List well-implemented aspects
- Highlight good practices followed

### ⚠️ Issues Found

For each issue:

- **Severity**: [Critical/High/Medium/Low]
- **File**: [filename:line]
- **Issue**: [description]
- **Recommendation**: [how to fix]
- **Example**: [code snippet if applicable]

### 🔒 Security Findings

- List security concerns with severity
- Provide remediation steps

### 🧪 Testing Gaps

- Missing test cases
- Areas needing more coverage
- Edge cases not handled

### 🚀 Performance Opportunities

- Potential optimizations
- Bundle size improvements
- Database query optimizations

### 📚 Documentation Needs

- Missing documentation
- Unclear code sections
- API documentation gaps

### ✨ Recommendations

1. **High Priority**: Must be fixed before merge
2. **Medium Priority**: Should be fixed soon
3. **Low Priority**: Nice to have improvements

### 🎓 Learning Opportunities

- Patterns used well
- Areas for improvement
- Suggested resources

## 💡 Example Usage

To use this prompt:

1. **Full Project Review**:

   ```
   Review the entire project following the comprehensive checklist above.
   Focus on security, best practices, and SonarQube quality gates.
   ```

2. **Current Changes Review**:

   ```
   Review only my uncommitted changes and staged files.
   Provide specific feedback on code quality and potential issues.
   ```

3. **Specific File Review**:

   ```
   Review [filename] for security vulnerabilities, code smells,
   and adherence to Next.js/React best practices.
   ```

4. **Pre-Commit Review**:

   ```
   Perform a pre-commit review of my staged changes.
   Check for: security issues, missing tests, code smells,
   performance issues, and documentation gaps.
   ```

5. **SonarQube-Style Review**:
   ```
   Analyze the codebase with SonarQube quality standards.
   Report bugs, vulnerabilities, code smells, coverage, and duplications.
   Provide a quality gate status (Pass/Fail).
   ```

## 🛠️ Integration with Tools

This review should complement:

- **ESLint**: Static code analysis
- **Jest**: Test coverage reports
- **Playwright**: E2E test results
- **Lighthouse**: Performance metrics
- **SonarQube**: Quality gate analysis
- **GitHub Actions**: CI/CD pipeline results

## 📖 Project-Specific Context

**YekZen eCommerce Platform**:

- **Language**: JavaScript (NOT TypeScript)
- **Framework**: Next.js 14.2.0 (App Router)
- **Backend**: Firebase (Firestore + Auth)
- **Styling**: Tailwind CSS + Framer Motion
- **Testing**: Jest + React Testing Library + Playwright
- **Payments**: Stripe + Razorpay
- **Coverage Target**: 70% (statements/branches/functions/lines)

**Key Files**:

- `app/`: Next.js pages (App Router)
- `components/`: Reusable React components
- `contexts/`: React Context providers
- `firebase/`: Firebase configuration & services
- `__tests__/`: Jest test suites

**Important Rules**:

- ❌ No TypeScript syntax
- ✅ Use App Router patterns
- ✅ Tailwind for styling
- ✅ Framer Motion for animations
- ✅ Firebase emulator for development
- ✅ 70% test coverage minimum
- ✅ Proper error handling everywhere
- ✅ Accessibility standards (WCAG 2.1)

---

**To use this prompt**: Type `/` in GitHub Copilot Chat and select this review prompt, or reference it with `@review` if configured.
