# YekZen eCommerce - Test Coverage Guide

## Overview

This project uses Jest for unit and integration testing with comprehensive coverage reporting.

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

### Run E2E tests (Playwright)

```bash
npm run test:e2e
```

## Coverage Reports

After running `npm run test:coverage`, you'll find coverage reports in:

- **HTML Report**: `coverage/lcov-report/index.html` (open in browser)
- **Terminal Summary**: Displayed after test execution
- **JSON Summary**: `coverage/coverage-summary.json`
- **LCOV**: `coverage/lcov.info` (for CI/CD integration)

## Coverage Thresholds

The project maintains these minimum coverage thresholds:

- **Statements**: 70%
- **Branches**: 60%
- **Functions**: 70%
- **Lines**: 70%

## Test Structure

### Unit Tests

Located in `__tests__/` directory:

- Component tests
- Context tests
- Service tests
- Utility tests

### Test Files

- `Header.test.js` - Header component tests
- `AuthContext.test.js` - Authentication context tests
- `CartContext.test.js` - Shopping cart context tests
- `productsService.test.js` - Product service tests

## What's Tested

### Header Component

✅ Rendering (logo, navigation, search, cart)
✅ Authentication (sign in/out, profile dropdown)
✅ Admin features (admin badge, admin links)
✅ Search functionality
✅ Cart badge display
✅ Mobile menu
✅ Logout flow

### Auth Context

✅ Sign in/sign up/sign out
✅ Error handling
✅ Auth state management
✅ Toast notifications
✅ Provider usage

### Cart Context

✅ Add/remove items
✅ Update quantities
✅ Calculate totals
✅ LocalStorage persistence
✅ Clear cart

### Products Service

✅ Fetch all products
✅ Fetch by ID/category
✅ Search products
✅ Featured products
✅ CRUD operations
✅ Error handling

## CI/CD Integration

### SonarQube Integration

The coverage reports can be integrated with SonarQube or similar tools:

1. **LCOV Format**: `coverage/lcov.info`
2. **JSON Format**: `coverage/coverage-summary.json`

### Example SonarQube Configuration

Add to `sonar-project.properties`:

```properties
sonar.projectKey=yekzen-ecommerce
sonar.projectName=YekZen eCommerce
sonar.sources=app,components,contexts,firebase,lib,services
sonar.tests=__tests__
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.testExecutionReportPaths=coverage/test-report.xml
sonar.coverage.exclusions=**/*.test.js,**/*.spec.js,**/node_modules/**
```

### GitHub Actions Example

```yaml
name: Test Coverage

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run test:coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Writing New Tests

### Component Test Example

```javascript
import { render, screen } from "@testing-library/react";
import MyComponent from "../components/MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Context Test Example

```javascript
import { renderHook, act } from "@testing-library/react";
import { MyProvider, useMyContext } from "../contexts/MyContext";

describe("MyContext", () => {
  it("should provide context values", () => {
    const wrapper = ({ children }) => <MyProvider>{children}</MyProvider>;
    const { result } = renderHook(() => useMyContext(), { wrapper });

    expect(result.current).toHaveProperty("value");
  });
});
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Mock External Dependencies**: Mock Firebase, APIs, etc.
3. **Clear Test Names**: Use descriptive test names
4. **Arrange-Act-Assert**: Follow the AAA pattern
5. **Coverage Goals**: Aim for >70% coverage
6. **Test User Behavior**: Test what users do, not implementation details

## Troubleshooting

### Tests Failing?

- Check mock implementations
- Verify async operations use `waitFor`
- Ensure cleanup in `afterEach`

### Coverage Too Low?

- Add tests for uncovered branches
- Test error scenarios
- Test edge cases

### Slow Tests?

- Use `jest --runInBand` to debug
- Check for unnecessary async waits
- Mock expensive operations

## Additional Tools

### Viewing Coverage in VS Code

Install the **Coverage Gutters** extension to see coverage inline in your editor.

### Continuous Monitoring

Consider integrating with:

- Codecov
- Coveralls
- SonarCloud
- Code Climate

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
