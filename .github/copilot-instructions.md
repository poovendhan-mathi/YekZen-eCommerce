# GitHub Copilot Instructions - YekZen eCommerce

This document provides AI assistants (GitHub Copilot, ChatGPT, Claude, etc.) with project-specific context, conventions, and guidelines for the YekZen eCommerce platform.

---

## 🎯 Project Overview

**YekZen** is a full-stack eCommerce platform built with:

- **Frontend**: Next.js 14.2.0 (App Router), React 18.2.0, Tailwind CSS 3.x
- **Backend**: Firebase 10.5.0 (Firestore + Authentication)
- **Payments**: Stripe 13.10.0 + Razorpay 2.9.2
- **Testing**: Jest 29.7.0 + React Testing Library + Playwright 1.40.0
- **Animations**: Framer Motion 10.16.4
- **Language**: **JavaScript** (NOT TypeScript)

---

## 📂 Project Structure

```
/Volumes/POOVENDHAN/Billing/YekZen-eCommerce/
├── app/                    # Next.js App Router pages
│   ├── page.js            # Homepage
│   ├── layout.js          # Root layout
│   ├── products/          # Product listing & detail pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── orders/            # Order history
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes (payments, webhooks)
├── components/            # Reusable React components
│   ├── layout/            # Header, Footer, ClientLayout
│   ├── cards/             # ProductCard, etc.
│   ├── auth/              # AuthModal, LoginForm, RegisterForm
│   ├── ui/                # StatusAnimations, buttons, inputs
│   ├── payments/          # Stripe/Razorpay integration
│   └── hoc/               # withAuth, withAdminAuth
├── contexts/              # React Context providers
│   ├── AuthContext.js     # User authentication state
│   └── CartContext.js     # Shopping cart state
├── firebase/              # Firebase configuration & services
│   ├── config.js          # Firebase initialization
│   └── productsService.js # Firestore CRUD operations
├── __tests__/             # Jest test suites
├── docs/                  # Project documentation
├── scripts/               # Database seeding scripts
└── .github/               # GitHub templates & workflows
```

---

## 🎨 Code Style & Conventions

### JavaScript (Not TypeScript)

- **No TypeScript**: Use vanilla JavaScript with JSDoc for type hints
- **ES6+ Syntax**: Use modern JavaScript features (arrow functions, destructuring, async/await)
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `ProductCard.jsx`)
  - Files: `camelCase` or `PascalCase` based on content
  - Functions: `camelCase` (e.g., `handleAddToCart`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

### React Components

```javascript
// ✅ Good: Functional component with hooks
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      {/* Component content */}
    </motion.div>
  );
}

// ❌ Bad: Class components (avoid)
class ProductCard extends React.Component { ... }
```

### Next.js App Router

```javascript
// ✅ Good: Server components by default
export default async function ProductsPage() {
  const products = await getProducts(); // Server-side data fetching
  return <ProductGrid products={products} />;
}

// Client components when needed
'use client';
import { useState } from 'react';

export default function InteractiveComponent() {
  const [state, setState] = useState();
  // ...
}
```

### Styling with Tailwind

```javascript
// ✅ Good: Utility classes
<button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
  Add to Cart
</button>

// ❌ Bad: Inline styles (avoid unless dynamic)
<button style={{ backgroundColor: 'blue' }}>Add to Cart</button>
```

### Framer Motion Animations

```javascript
// ✅ Good: Reusable animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05 },
};

<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  whileHover="hover"
/>;
```

---

## 🔥 Firebase Integration

### Firestore Operations

```javascript
// ✅ Good: Service layer pattern
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const productsService = {
  async getAll() {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async create(productData) {
    return await addDoc(collection(db, "products"), productData);
  },

  async update(id, updates) {
    return await updateDoc(doc(db, "products", id), updates);
  },

  async delete(id) {
    return await deleteDoc(doc(db, "products", id));
  },
};
```

### Authentication

```javascript
// ✅ Good: Use AuthContext
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedPage() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <LoginPrompt />;

  return <ProtectedContent />;
}
```

---

## 🛒 State Management

### Cart Context Pattern

```javascript
// ✅ Good: Context with reducer pattern
import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      // Check if item exists
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex].quantity += 1;
        return { ...state, items: updated };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  return (
    <CartContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
```

---

## 🧪 Testing Guidelines

### Test Structure

```javascript
// ✅ Good: Comprehensive test suite
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductCard } from "@/components/cards/ProductCard";

// Mock dependencies
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe("ProductCard", () => {
  const mockProduct = {
    id: "1",
    name: "Test Product",
    price: 99.99,
    image: "/test.jpg",
  };

  it("renders product information", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
  });

  it("handles add to cart action", async () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    const addButton = screen.getByText("Add to Cart");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });
  });
});
```

### Coverage Requirements

- **Statements**: 70%
- **Branches**: 60%
- **Functions**: 70%
- **Lines**: 70%

### Test Commands

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Generate coverage report
npm run test:e2e            # Run Playwright E2E tests
```

---

## 🔒 Security Best Practices

### Environment Variables

```javascript
// ✅ Good: Use environment variables
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// ❌ Bad: Hardcoded secrets
const stripeKey = "sk_test_..."; // NEVER DO THIS
```

### Input Validation

```javascript
// ✅ Good: Validate and sanitize
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
  return email.trim().toLowerCase();
}
```

### Firebase Security Rules

```javascript
// ✅ Good: Proper Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 💳 Payment Integration

### Stripe Checkout

```javascript
// ✅ Good: Server-side checkout session
// app/api/checkout/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { items } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 🚀 Performance Optimization

### Image Optimization

```javascript
// ✅ Good: Use Next.js Image component
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={400}
  priority={isAboveFold}
  loading={isAboveFold ? 'eager' : 'lazy'}
/>

// ❌ Bad: Regular img tag
<img src={product.image} alt={product.name} />
```

### Code Splitting

```javascript
// ✅ Good: Dynamic imports for heavy components
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("@/components/HeavyChart"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

---

## 🐛 Error Handling

### Try-Catch Pattern

```javascript
// ✅ Good: Comprehensive error handling
async function fetchProducts() {
  try {
    const response = await fetch("/api/products");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);

    // Show user-friendly error
    toast.error("Unable to load products. Please try again.");

    // Return fallback data or empty array
    return [];
  }
}
```

### Error Boundaries

```javascript
// ✅ Good: Error boundary for React components
"use client";
import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback onReset={() => this.setState({ hasError: false })} />
      );
    }

    return this.props.children;
  }
}
```

---

## ♿ Accessibility (a11y)

### Semantic HTML

```javascript
// ✅ Good: Semantic elements with ARIA
<button
  onClick={handleClick}
  aria-label="Add product to cart"
  aria-pressed={isInCart}
  disabled={isLoading}
>
  <ShoppingCartIcon aria-hidden="true" />
  <span>Add to Cart</span>
</button>

// ❌ Bad: Non-semantic div as button
<div onClick={handleClick}>Add to Cart</div>
```

---

## 📦 Component Patterns

### HOC Pattern (Authentication)

```javascript
// ✅ Good: Reusable authentication HOC
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/signin");
      }
    }, [user, loading, router]);

    if (loading) return <LoadingSpinner />;
    if (!user) return null;

    return <Component {...props} />;
  };
}
```

---

## 🔄 Data Fetching

### Server Components (Preferred)

```javascript
// ✅ Good: Fetch in server component
export default async function ProductsPage() {
  const products = await fetch("https://api.example.com/products", {
    next: { revalidate: 3600 }, // Cache for 1 hour
  }).then((res) => res.json());

  return <ProductGrid products={products} />;
}
```

### Client Components (When Needed)

```javascript
// ✅ Good: SWR or React Query for client-side fetching
"use client";
import useSWR from "swr";

export default function ProductList() {
  const { data: products, error, isLoading } = useSWR("/api/products", fetcher);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <ProductGrid products={products} />;
}
```

---

## 🎯 Common Anti-Patterns to Avoid

### ❌ Don't: Mutate state directly

```javascript
// ❌ Bad
state.items.push(newItem);

// ✅ Good
setState({ ...state, items: [...state.items, newItem] });
```

### ❌ Don't: Use index as key

```javascript
// ❌ Bad
{
  items.map((item, index) => <Item key={index} {...item} />);
}

// ✅ Good
{
  items.map((item) => <Item key={item.id} {...item} />);
}
```

### ❌ Don't: Forget dependency arrays

```javascript
// ❌ Bad: Missing dependencies
useEffect(() => {
  fetchData(userId);
}, []); // userId is missing!

// ✅ Good
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### ❌ Don't: Leave console.log in production

```javascript
// ❌ Bad
console.log("User data:", userData);

// ✅ Good: Use environment checks
if (process.env.NODE_ENV === "development") {
  console.log("User data:", userData);
}
```

---

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server (localhost:3000)
npm run emulator         # Start Firebase emulators
npm run seed             # Seed database with mock data
./start-dev.sh           # Start all services (emulator + seed + dev)

# Testing
npm test                 # Run Jest tests
npm run test:watch       # Jest in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run Playwright E2E tests

# Building
npm run build            # Production build
npm start                # Start production server

# Linting
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
```

---

## 📚 Key Dependencies & Docs

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/
- **Firebase**: https://firebase.google.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Stripe**: https://stripe.com/docs/api
- **Jest**: https://jestjs.io/docs/getting-started
- **React Testing Library**: https://testing-library.com/react

---

## 🎯 When Suggesting Code

### Always:

1. ✅ Use JavaScript (NOT TypeScript)
2. ✅ Follow Next.js 14 App Router conventions
3. ✅ Use Tailwind for styling
4. ✅ Add Framer Motion for animations
5. ✅ Include error handling
6. ✅ Add loading states
7. ✅ Consider accessibility
8. ✅ Write tests for new features
9. ✅ Use semantic HTML
10. ✅ Follow React best practices

### Never:

1. ❌ Use TypeScript syntax
2. ❌ Use Pages Router patterns
3. ❌ Hardcode API keys or secrets
4. ❌ Mutate state directly
5. ❌ Forget error boundaries
6. ❌ Ignore accessibility
7. ❌ Leave console.log statements
8. ❌ Use inline styles extensively
9. ❌ Create untested code
10. ❌ Violate security best practices

---

## 🚨 Important Notes

- **This is a JavaScript project** - Do not suggest TypeScript code
- **Firebase Emulator** - Use emulator for development (Firestore: localhost:8080, Auth: localhost:9099)
- **Test Coverage** - Maintain >70% coverage for new code
- **Responsive Design** - All components must work on mobile, tablet, and desktop
- **Performance** - Use Next.js Image, lazy loading, and code splitting
- **Security** - Never commit API keys, always validate user input

---

## 💡 Example PR Description Template

```markdown
## 🎯 What does this PR do?

Brief description of the changes

## 🧪 How to test?

1. Step-by-step testing instructions
2. Expected behavior

## ✅ Checklist

- [ ] Tests added/updated
- [ ] Coverage maintained (>70%)
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Responsive design verified
- [ ] Accessibility checked
- [ ] Documentation updated

## 📸 Screenshots (if applicable)

[Add screenshots here]
```

---

**Last Updated**: January 2025  
**Maintained By**: YekZen Development Team

Use these guidelines to provide consistent, high-quality code suggestions for the YekZen eCommerce platform.
