# 🚀 YekZen eCommerce - Deployment Guide

## 📋 Deployment Overview

This guide covers the complete deployment process for YekZen eCommerce application, including staging and production environments.

---

## 🌐 Deployment Architecture

### Infrastructure Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│   localhost     │    │ Vercel Preview  │    │ Vercel + Domain │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └─────────── GitHub Repository ──────────────────┘
                                │
                    ┌─────────────────┐
                    │ Firebase Project│
                    │ Auth + Firestore│
                    └─────────────────┘
```

### Technology Stack for Deployment

- **Frontend Hosting**: Vercel (Free tier)
- **Backend/Database**: Firebase (Free tier)
- **Authentication**: Firebase Auth
- **Payments**: Stripe + Razorpay (Test mode)
- **Domain**: Custom domain (optional)
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + Firebase Console

---

## 🏗️ Phase 1: Environment Setup

### 1.1 Firebase Project Setup

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Project name: `yekzen-ecommerce`
4. Enable Google Analytics (optional)
5. Choose default account

#### Enable Firebase Services

```bash
# Authentication
- Go to Authentication > Sign-in method
- Enable Email/Password
- Enable Google Sign-in (optional)

# Firestore Database
- Go to Firestore Database
- Create database in production mode
- Choose location (us-central1 recommended)

# Storage (for product images)
- Go to Storage
- Get started with default rules
```

#### Get Firebase Configuration

```javascript
// Copy from Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "yekzen-ecommerce.firebaseapp.com",
  projectId: "yekzen-ecommerce",
  storageBucket: "yekzen-ecommerce.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};
```

### 1.2 Payment Provider Setup

#### Stripe Configuration

```bash
# 1. Create Stripe account at https://stripe.com
# 2. Get API keys from Dashboard > API keys

# Test Mode Keys (for development/staging)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Live Mode Keys (for production)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

#### Razorpay Configuration

```bash
# 1. Create Razorpay account at https://razorpay.com
# 2. Get API keys from Dashboard > Settings > API Keys

# Test Mode Keys
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=test_secret_...

# Live Mode Keys
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=live_secret_...
```

---

## 🔐 Phase 2: Environment Variables Configuration

### 2.1 Local Environment (.env.local)

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yekzen-ecommerce.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yekzen-ecommerce
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yekzen-ecommerce.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2.2 Staging Environment Variables

```bash
# Same as local but with staging URLs
NEXT_PUBLIC_APP_URL=https://yekzen-staging.vercel.app
NODE_ENV=staging
```

### 2.3 Production Environment Variables

```bash
# Use production API keys and URLs
NEXT_PUBLIC_APP_URL=https://yekzen.com
NODE_ENV=production

# Use live payment keys
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
RAZORPAY_KEY_ID=rzp_live_...
```

---

## 📦 Phase 3: Vercel Deployment Setup

### 3.1 GitHub Repository Setup

#### Initialize Git Repository

```bash
cd YekZen-eCommerce
git init
git add .
git commit -m "Initial commit: YekZen eCommerce implementation"

# Create GitHub repository
gh repo create YekZen-eCommerce --public
git remote add origin https://github.com/yourusername/YekZen-eCommerce.git
git push -u origin main
```

#### Repository Structure

```
YekZen-eCommerce/
├── .env.example              # Template for environment variables
├── .gitignore                # Ignore node_modules, .env files
├── package.json              # Dependencies and scripts
├── next.config.js            # Next.js configuration
├── vercel.json               # Vercel deployment configuration
├── app/                      # Next.js App Router pages
├── components/               # React components
├── docs/                     # Documentation
│   ├── implementation-plan.md
│   └── deployment-guide.md
└── README.md                 # Project documentation
```

### 3.2 Vercel Configuration

#### Create vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

#### Update package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy": "vercel --prod",
    "deploy-staging": "vercel"
  }
}
```

### 3.3 Vercel Project Setup

#### Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `YekZen-eCommerce`
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Environment Variables in Vercel

```bash
# In Vercel Dashboard > Project Settings > Environment Variables

# Add all environment variables:
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## 🎯 Phase 4: Deployment Process

### 4.1 Staging Deployment

#### Automatic Deployment

```bash
# Every push to main branch triggers staging deployment
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically deploys to:
# https://yekzen-ecommerce-git-main-username.vercel.app
```

#### Manual Staging Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to staging
npm run deploy-staging
```

#### Preview Deployments

```bash
# Every PR creates a preview deployment
# URL: https://yekzen-ecommerce-pr-123-username.vercel.app

# Features:
- Isolated environment for testing
- Unique URL for each PR
- Automatic deployment on commit
```

### 4.2 Production Deployment

#### Production Checklist

- [ ] All tests passing
- [ ] Performance optimization complete
- [ ] SEO meta tags added
- [ ] Error monitoring setup
- [ ] Environment variables configured
- [ ] Domain DNS configured (if custom domain)

#### Deploy to Production

```bash
# Method 1: Vercel CLI
npm run deploy

# Method 2: GitHub (push to main with prod flag)
git tag v1.0.0
git push origin v1.0.0

# Method 3: Vercel Dashboard
# Go to Deployments > Promote to Production
```

### 4.3 Custom Domain Setup

#### Add Custom Domain

1. Go to Vercel Dashboard > Project Settings > Domains
2. Add domain: `yekzen.com`
3. Configure DNS records:

```bash
# DNS Configuration (at your domain registrar)
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61

# SSL Certificate
- Automatically handled by Vercel
- Let's Encrypt certificates
- Auto-renewal
```

---

## 📊 Phase 5: Monitoring & Analytics

### 5.1 Vercel Analytics

#### Enable Vercel Analytics

```bash
# In vercel.json
{
  "analytics": {
    "id": "your-analytics-id"
  }
}

# In app/layout.js
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 5.2 Firebase Monitoring

#### Firebase Performance

```javascript
// firebase/config.js
import { getPerformance } from "firebase/performance";

// Initialize Performance Monitoring
const perf = getPerformance(app);
```

#### Firebase Analytics

```javascript
// firebase/config.js
import { getAnalytics } from "firebase/analytics";

// Initialize Analytics
const analytics = getAnalytics(app);
```

### 5.3 Error Monitoring (Optional)

#### Sentry Integration

```bash
npm install @sentry/nextjs

# sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## 🔧 Phase 6: CI/CD Pipeline

### 6.1 GitHub Actions Workflow

#### Create .github/workflows/deploy.yml

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Build application
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./
```

### 6.2 Deployment Environments

#### Environment Strategy

```bash
# Development (Local)
- URL: http://localhost:3000
- Database: Firebase (development project)
- Payments: Test mode
- Purpose: Active development

# Staging (Vercel Preview)
- URL: https://yekzen-git-main-username.vercel.app
- Database: Firebase (staging project)
- Payments: Test mode
- Purpose: Testing and client review

# Production (Vercel)
- URL: https://yekzen.com
- Database: Firebase (production project)
- Payments: Live mode
- Purpose: Live application
```

---

## 🚀 Phase 7: Performance Optimization

### 7.1 Next.js Optimization

#### next.config.js Optimization

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },

  // Performance optimizations
  swcMinify: true,
  compress: true,

  // PWA configuration (optional)
  experimental: {
    appDir: true,
  },
};
```

### 7.2 Bundle Optimization

#### Analyze Bundle Size

```bash
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### 7.3 Lighthouse Optimization

#### Target Metrics

- **Performance**: >90
- **Accessibility**: >95
- **Best Practices**: >90
- **SEO**: >90

#### Optimization Strategies

```javascript
// Image optimization
import Image from "next/image";

// Lazy loading
const LazyComponent = dynamic(() => import("./Component"), {
  loading: () => <p>Loading...</p>,
});

// Code splitting
const DynamicComponent = dynamic(() => import("./DynamicComponent"));
```

---

## 📋 Phase 8: Pre-Launch Checklist

### 8.1 Technical Checklist

#### Frontend

- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] Loading states implemented
- [ ] Error boundaries added
- [ ] SEO meta tags complete
- [ ] Favicon and manifest.json
- [ ] Analytics tracking working
- [ ] Performance score >90

#### Backend

- [ ] Firebase security rules configured
- [ ] API routes secured
- [ ] Payment webhooks tested
- [ ] Error handling implemented
- [ ] Database backup strategy
- [ ] Monitoring alerts setup

#### Security

- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] HTTPS enforced

### 8.2 Business Checklist

#### Content

- [ ] Product catalog complete
- [ ] Legal pages (Terms, Privacy, Refund)
- [ ] Contact information updated
- [ ] About page content
- [ ] FAQ section
- [ ] Email templates

#### Operations

- [ ] Payment processing tested
- [ ] Order fulfillment process
- [ ] Customer support system
- [ ] Inventory management
- [ ] Shipping configuration
- [ ] Tax calculation setup

### 8.3 Testing Checklist

#### Functionality Testing

- [ ] User registration/login
- [ ] Product browsing and search
- [ ] Shopping cart operations
- [ ] Checkout process (test payments)
- [ ] Order confirmation emails
- [ ] User account management

#### Performance Testing

- [ ] Page load speed <2 seconds
- [ ] Mobile performance optimized
- [ ] Database query optimization
- [ ] CDN configuration
- [ ] Caching strategy implemented

#### Security Testing

- [ ] SQL injection prevention
- [ ] XSS vulnerability scan
- [ ] Authentication security
- [ ] Payment security (PCI compliance)
- [ ] Data privacy compliance

---

## 📈 Phase 9: Post-Launch Monitoring

### 9.1 Monitoring Setup

#### Application Monitoring

```javascript
// Health check endpoint
// app/api/health/route.js
export async function GET() {
  return Response.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

#### Uptime Monitoring

- **Service**: UptimeRobot (free tier)
- **Intervals**: Check every 5 minutes
- **Alerts**: Email + SMS for downtime
- **Endpoints**: Home, API health, payment endpoints

### 9.2 Performance Monitoring

#### Key Metrics to Track

```bash
# Core Web Vitals
- Largest Contentful Paint (LCP): <2.5s
- First Input Delay (FID): <100ms
- Cumulative Layout Shift (CLS): <0.1

# Business Metrics
- Conversion rate
- Cart abandonment rate
- Page bounce rate
- Average order value
- Customer acquisition cost
```

### 9.3 Error Tracking

#### Error Monitoring Dashboard

- **4xx Errors**: Client-side issues
- **5xx Errors**: Server-side issues
- **JavaScript Errors**: Frontend issues
- **Payment Failures**: Transaction issues
- **Database Errors**: Backend issues

---

## 🔄 Phase 10: Maintenance & Updates

### 10.1 Regular Maintenance

#### Weekly Tasks

- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Update dependencies
- [ ] Security patches
- [ ] Backup verification

#### Monthly Tasks

- [ ] Lighthouse audit
- [ ] Security vulnerability scan
- [ ] Performance optimization review
- [ ] User feedback analysis
- [ ] Feature usage analytics

### 10.2 Update Strategy

#### Deployment Process

```bash
# 1. Feature Development
git checkout -b feature/new-feature
# ... develop feature ...
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 2. Code Review
# Create PR → Review → Approve

# 3. Staging Deployment
git checkout main
git merge feature/new-feature
git push origin main
# → Auto-deploy to staging

# 4. Testing
# Test on staging environment

# 5. Production Deployment
vercel --prod
# → Deploy to production
```

#### Rollback Strategy

```bash
# Instant rollback via Vercel
vercel rollback [deployment-url]

# Or deploy previous version
git checkout v1.0.0
vercel --prod
```

---

## 📚 Resources & Documentation

### Deployment Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Monitoring Resources

- [Vercel Analytics](https://vercel.com/analytics)
- [Firebase Performance](https://firebase.google.com/docs/perf-mon)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Security Resources

- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP Guidelines](https://owasp.org/www-project-top-ten/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

## 🎯 Success Metrics

### Technical KPIs

- **Uptime**: >99.9%
- **Performance**: Lighthouse score >90
- **Security**: Zero critical vulnerabilities
- **SEO**: Google PageSpeed >90

### Business KPIs

- **Load Time**: <2 seconds
- **Conversion Rate**: Industry benchmark
- **Mobile Traffic**: >50% of total
- **Customer Satisfaction**: >4.5/5

---

**Deployment Guide Version**: 1.0  
**Last Updated**: October 17, 2025  
**Next Review**: November 17, 2025
