# YekZen eCommerce Platform

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](./coverage)
[![Coverage](https://img.shields.io/badge/coverage-{{COVERAGE}}%25-{{COVERAGE_COLOR}})](./coverage/lcov-report/index.html)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.17.0-brightgreen)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.0-black)](https://nextjs.org)

> Modern, feature-rich eCommerce platform built with Next.js 14, Firebase, and Framer Motion

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/poovendhan-mathi/YekZen-eCommerce.git
cd YekZen-eCommerce

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Start development server with Firebase emulators
./start-dev.sh

# Or start separately
npm run dev          # Start Next.js dev server
npm run emulator     # Start Firebase emulators
npm run seed         # Seed sample data
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Customer Features

- 🛍️ **Product Browsing** - Browse 26+ products across 7 categories
- 🔍 **Advanced Search** - Real-time search with gradient UI
- 🛒 **Shopping Cart** - Add/remove items with quantity management
- 💳 **Multiple Payments** - Stripe and Razorpay integration
- 👤 **User Profiles** - Account management with order history
- ⭐ **Product Reviews** - Rate and review products
- 📱 **Responsive Design** - Mobile-first design approach
- 🎨 **Smooth Animations** - Framer Motion powered interactions

### Admin Features

- 📊 **Admin Dashboard** - Comprehensive analytics
- 📦 **Product Management** - CRUD operations for products
- 🏷️ **Category Management** - Organize products efficiently
- 📈 **Order Management** - Track and process orders
- 👥 **User Management** - View and manage customers

### Technical Features

- ⚡ **Server-Side Rendering** - Next.js 14 App Router
- 🔥 **Firebase Backend** - Firestore + Authentication
- 🧪 **Comprehensive Testing** - Jest + React Testing Library + Playwright
- 📊 **Code Coverage** - SonarQube-compatible reports
- 🔒 **Security** - Environment-based configuration
- 🎯 **TypeScript Ready** - Type-safe development
- 🚀 **Performance Optimized** - Image optimization, lazy loading

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 14.2.0](https://nextjs.org) - React framework with SSR
- **UI Library**: [React 18.2.0](https://react.dev) - Component-based UI
- **Styling**: [Tailwind CSS 3.x](https://tailwindcss.com) - Utility-first CSS
- **Animations**: [Framer Motion 10.16.4](https://www.framer.com/motion/) - Motion library
- **Icons**: [Hero Icons 2.0](https://heroicons.com) - Beautiful SVG icons
- **Components**: [@headlessui/react](https://headlessui.com) - Unstyled components

### Backend

- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) - NoSQL cloud database
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth) - User authentication
- **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage) - File storage

### Payments

- **Stripe**: International payments
- **Razorpay**: Indian payments

### Development Tools

- **Testing**: Jest, React Testing Library, Playwright
- **Linting**: ESLint + Next.js config
- **Formatting**: Prettier (recommended)
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Coverage**: lcov, html, json-summary

## 📁 Project Structure

```
YekZen-eCommerce/
├── .github/                    # GitHub configuration
│   ├── templates/             # Documentation templates
│   ├── workflows/             # CI/CD workflows
│   └── actions/               # Custom GitHub actions
├── app/                       # Next.js App Router pages
│   ├── page.js               # Home page
│   ├── products/             # Product pages
│   ├── checkout/             # Checkout flow
│   ├── admin/                # Admin dashboard
│   └── api/                  # API routes
├── components/               # React components
│   ├── layout/              # Layout components (Header, Footer)
│   ├── cards/               # Card components (ProductCard)
│   ├── auth/                # Authentication components
│   ├── ui/                  # UI components (Button, Input, Animations)
│   ├── product/             # Product-related components
│   └── user/                # User-related components
├── contexts/                # React Context providers
│   ├── AuthContext.js       # Authentication state
│   └── CartContext.js       # Shopping cart state
├── firebase/                # Firebase configuration
│   ├── config.js           # Firebase initialization
│   └── productsService.js  # Product CRUD operations
├── lib/                    # Utility libraries
├── services/               # Service layers
├── scripts/                # Build and setup scripts
│   ├── seed-emulator.js   # Seed Firebase emulator
│   └── setup-database.js  # Database setup
├── __tests__/              # Test suites
├── docs/                   # Documentation
├── coverage/               # Test coverage reports
└── public/                 # Static assets

## Key Files

- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `firebase.json` - Firebase configuration
- `jest.config.js` - Jest testing configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.env.local` - Environment variables (not in git)
```

## 🔧 Development

### Prerequisites

- Node.js >= 18.17.0
- npm or yarn
- Firebase CLI (for emulators)
- Git

### Environment Setup

1. **Copy environment template**:

   ```bash
   cp .env.example .env.local
   ```

2. **Configure Firebase**:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
   ```

3. **Configure Payment Gateways**:
   ```env
   STRIPE_SECRET_KEY=your_stripe_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

### Development Commands

```bash
# Start development server with all services
./start-dev.sh

# Individual commands
npm run dev              # Start Next.js (localhost:3000)
npm run emulator         # Start Firebase emulators
npm run seed             # Seed sample data (26 products)

# Database operations
npm run setup-db         # Setup database
npm run seed:local       # Seed local environment
npm run seed:prod        # Seed production (careful!)

# Build and production
npm run build            # Create production build
npm start                # Start production server
npm run lint             # Run ESLint
```

### Firebase Emulator UI

Access Firebase emulators at [http://localhost:4000](http://localhost:4000)

- **Firestore**: localhost:8080
- **Authentication**: localhost:9099

### Default Credentials

**Admin Account**:

- Email: admin@yekzen.com
- Password: admin123456

**Test User**:

- Email: user@yekzen.com
- Password: user123456

## 🧪 Testing

### Test Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e
npm run test:e2e:ui        # With Playwright UI

# Run specific test
npm test Header.test.js
```

### Test Coverage

Current coverage: **{{COVERAGE}}%**

Coverage reports available at: `coverage/lcov-report/index.html`

```bash
# View coverage report
npm run test:coverage
open coverage/lcov-report/index.html
```

### Test Suites

- ✅ **Component Tests** - Header, ProductCard, Buttons, Animations
- ✅ **Context Tests** - Auth, Cart state management
- ✅ **Service Tests** - Firebase CRUD operations
- ✅ **Integration Tests** - User flows
- ⏳ **E2E Tests** - Playwright end-to-end tests

### Coverage Thresholds

```javascript
{
  statements: 70%,
  branches: 60%,
  functions: 70%,
  lines: 70%
}
```

## 📊 Code Quality

### Quality Tools

- **ESLint**: Code linting
- **Jest**: Unit testing with coverage
- **Playwright**: E2E testing
- **SonarQube**: Code analysis (coverage reports compatible)

### Quality Metrics

{{QUALITY_METRICS}}

### Best Practices

- ✅ Component-based architecture
- ✅ Server-side rendering
- ✅ Type-safe with prop validation
- ✅ Responsive design
- ✅ Accessibility compliant
- ✅ Performance optimized
- ✅ Security best practices
- ✅ Comprehensive testing

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Manual Deployment

```bash
# Build application
npm run build

# Test production build locally
npm start

# Deploy to your hosting provider
```

### Environment Variables

Make sure to set these in your deployment platform:

- All Firebase configuration variables
- Payment gateway keys (Stripe, Razorpay)
- `NODE_ENV=production`
- `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false`

### Database Setup

1. Create Firebase project
2. Enable Firestore and Authentication
3. Configure security rules
4. Seed initial data:
   ```bash
   NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false npm run seed:prod
   ```

## 📈 Performance

- **Lighthouse Score**: {{LIGHTHOUSE_SCORE}}
- **First Contentful Paint**: {{FCP}}
- **Time to Interactive**: {{TTI}}
- **Core Web Vitals**: {{WEB_VITALS}}

## 🔒 Security

### Security Features

- Environment-based configuration
- Firebase security rules
- Authentication required for admin routes
- API routes with authentication
- Input validation and sanitization
- XSS protection
- CSRF protection

### Security Checklist

- ✅ Environment variables properly configured
- ✅ Firebase security rules in place
- ✅ No sensitive data in git
- ✅ API keys properly secured
- ✅ Authentication on protected routes
- ✅ Input validation
- ✅ Regular dependency updates

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm test`
5. **Check coverage**: `npm run test:coverage`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Development Guidelines

- Write tests for new features
- Maintain code coverage above 70%
- Follow existing code style
- Update documentation
- Add comments for complex logic
- Keep commits atomic and descriptive

## 📝 Documentation

- [Development Guide](./DEVELOPMENT.md) - Detailed development instructions
- [Environment Setup](./ENVIRONMENT-SETUP.md) - Environment configuration
- [Testing Guide](./docs/TESTING-GUIDE.md) - Testing documentation
- [API Documentation](./docs/API.md) - API reference
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute

## 🐛 Troubleshooting

### Common Issues

**Issue**: Products not displaying

```bash
# Solution: Restart emulator and reseed
firebase emulators:start --only firestore,auth
node scripts/seed-emulator.js
```

**Issue**: Tests failing

```bash
# Solution: Clear cache and reinstall
npm test -- --clearCache
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Build errors

```bash
# Solution: Clear Next.js cache
rm -rf .next
npm run build
```

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/poovendhan-mathi/YekZen-eCommerce/issues)
- **Discussions**: [GitHub Discussions](https://github.com/poovendhan-mathi/YekZen-eCommerce/discussions)
- **Email**: support@yekzen.com

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Poovendhan Mathi** - _Initial work_ - [@poovendhan-mathi](https://github.com/poovendhan-mathi)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase team for the backend infrastructure
- Framer Motion for smooth animations
- All contributors and supporters

---

**Built with ❤️ using Next.js, Firebase, and Framer Motion**

**Last Updated**: {{LAST_UPDATED}}
**Version**: {{VERSION}}
**Status**: {{PROJECT_STATUS}}
