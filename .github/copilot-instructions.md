# GitHub Copilot Instructions - YekZen eCommerce

> **AI Learning Directive**: As GitHub Copilot, you must continuously learn and remember project-specific patterns, conventions, and architecture as we explore the codebase together. Build a comprehensive mental model of this project so you can answer questions efficiently and correctly without repeatedly tracing through files. Understand the relationships between components, services, contexts, and data flow.
>
> **AI Insights Directive**: Continuously record your understandings and significant findings in docs/insights related to the specific code or flow. Before performing analysis, always read existing docs/insights first — do not modify or duplicate their content. If coverage already exists, skip redundant analysis. When the chat yields a new enhancement or analysis that is not present in docs/insights, add a clear entry there marking the change, reasoning, and any action items.

This document provides AI assistants (GitHub Copilot, ChatGPT, Claude, etc.) with project-specific context, conventions, and guidelines for the YekZen eCommerce platform.

---

DO NOT CREATE SUMMARY FILES ALL THE TIME

!!! IMPORTANT: HIGH PRIORITY - UI MUST NOT BE CHANGED !!!
Make absolutely sure to keep the current UI — it is required and must NOT be removed, altered, or refactored without explicit written approval from the YekZen product team. Any UI changes require prior sign-off and review.

## 🎯 Project Overview

**YekZen** is a modern, full-stack eCommerce platform built with cutting-edge technologies and best practices.

### Tech Stack

- **Frontend**: Next.js 15.x (App Router), React 19.x, TypeScript 5.x
- **Styling**: Tailwind CSS 4.x, Framer Motion 11.x
- **Backend**: Firebase 11.x (Firestore + Authentication + Cloud Functions)
- **Payments**: Stripe 17.x + Razorpay 2.x
- **Testing**: Vitest + React Testing Library + Playwright
- **Language**: **TypeScript** (strict mode enabled)
- **Package Manager**: pnpm (preferred) or npm
- **Node.js**: v20.x LTS or higher
- **Code Quality**: ESLint 9.x, Prettier, Husky, lint-staged

### System Requirements

```bash
# Required versions
Node.js: >= 20.0.0 LTS
npm: >= 10.0.0 (or pnpm >= 9.0.0)
Git: >= 2.40.0
```

---

## 🚀 How to Run the Application

### Quick Start (Recommended)

```bash
# All-in-one development startup script
./start-dev.sh
```

This script automatically:

- Starts Firebase Emulators (Firestore + Auth)
- Seeds the database with test data
- Launches Next.js development server

### Access Points

Once running:

- **App**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000
- **Firestore**: localhost:8080
- **Auth**: localhost:9099

### Manual Development Commands

```bash
# Development
pnpm dev                 # Start Next.js dev server
pnpm emulator            # Start Firebase emulators
pnpm seed                # Seed database with mock data

# Production
pnpm build               # Production build
pnpm start               # Start production server

# Testing
pnpm test                # Run Vitest tests
pnpm test:coverage       # Generate coverage report
pnpm test:e2e            # Run Playwright E2E tests

# Code Quality
pnpm lint                # Run ESLint
pnpm type-check          # TypeScript type checking
```

````

---

## � How to Run the Application

### Development Environment

```bash
# 1. Clone the repository
git clone https://github.com/your-org/YekZen-eCommerce.git
cd YekZen-eCommerce

# 2. Install dependencies (recommended: use pnpm)
pnpm install
# or
npm install

# 3. Set up environment variables
cp .env.example .env.local

# Edit .env.local with your credentials:
# - Firebase configuration
# - Stripe keys
# - Razorpay keys
# - Database URLs

# 4. Start Firebase Emulators (for local development)
pnpm emulator
# or
npm run emulator

# 5. Seed the database (in a new terminal)
pnpm seed
# or
npm run seed

# 6. Start the development server
pnpm dev
# or
npm run dev

# Application will be available at:
# - App: http://localhost:3000
# - Firebase Emulator UI: http://localhost:4000
# - Firestore: localhost:8080
# - Auth: localhost:9099
````

### Production Build

```bash
# 1. Create production environment file
cp .env.example .env.production

# 2. Build the application
pnpm build
# or
npm run build

# 3. Test production build locally
pnpm start
# or
npm start

# 4. Deploy to Vercel/Firebase/your platform
pnpm deploy
# or
npm run deploy
```

### Testing

```bash
# Run all tests
pnpm test
# or
npm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run specific test file
pnpm test src/__tests__/ProductCard.test.tsx
```

### Code Quality

```bash
# Run linter
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# Type check
pnpm type-check

# Run all quality checks before commit
pnpm pre-commit
```

---

## 📂 Project Structure

```
YekZen-eCommerce/
├── app/                           # Next.js 15 App Router
│   ├── (auth)/                    # Auth route group
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── (shop)/                    # Shop route group
│   │   ├── products/
│   │   │   ├── page.tsx           # Product listing
│   │   │   └── [id]/page.tsx      # Product detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── orders/page.tsx
│   ├── admin/                     # Admin dashboard (protected)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/page.tsx
│   │   └── orders/page.tsx
│   ├── api/                       # API Routes
│   │   ├── checkout/route.ts
│   │   ├── webhooks/
│   │   │   ├── stripe/route.ts
│   │   │   └── razorpay/route.ts
│   │   └── products/route.ts
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage
│   ├── loading.tsx                # Global loading
│   ├── error.tsx                  # Global error
│   └── not-found.tsx              # 404 page
│
├── components/                    # Reusable React components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductDetails.tsx
│   │   └── ProductFilters.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartDrawer.tsx
│   ├── auth/
│   │   ├── AuthModal.tsx
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── ui/                        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Spinner.tsx
│   │   └── Badge.tsx
│   └── animations/
│       ├── FadeIn.tsx
│       ├── SlideIn.tsx
│       └── PageTransition.tsx
│
├── lib/                           # Utility libraries
│   ├── firebase/
│   │   ├── config.ts              # Firebase initialization
│   │   ├── auth.ts                # Auth helpers
│   │   ├── firestore.ts           # Firestore helpers
│   │   └── storage.ts             # Storage helpers
│   ├── stripe/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── razorpay/
│   │   └── client.ts
│   ├── utils/
│   │   ├── format.ts              # Formatting utilities
│   │   ├── validation.ts          # Input validation
│   │   └── constants.ts
│   └── hooks/                     # Custom React hooks
│       ├── useAuth.ts
│       ├── useCart.ts
│       ├── useProducts.ts
│       └── useDebounce.ts
│
├── contexts/                      # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── ThemeContext.tsx
│
├── services/                      # Business logic & API services
│   ├── products.service.ts
│   ├── auth.service.ts
│   ├── cart.service.ts
│   ├── orders.service.ts
│   └── payment.service.ts
│
├── types/                         # TypeScript type definitions
│   ├── product.types.ts
│   ├── user.types.ts
│   ├── cart.types.ts
│   ├── order.types.ts
│   └── global.d.ts
│
├── __tests__/                     # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── public/                        # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── scripts/                       # Utility scripts
│   ├── seed.ts                    # Database seeding
│   ├── migrate.ts                 # Database migrations
│   └── deploy.sh                  # Deployment script
│
├── .github/                       # GitHub configuration
│   └── copilot-instructions.md    # This file
│
├── .husky/                        # Git hooks
├── .vscode/                       # VS Code settings
├── firebase/                      # Firebase config files
│   ├── firestore.rules
│   ├── storage.rules
│   └── firebase.json
│
├── .env.example                   # Environment variables template
├── .env.local                     # Local development (gitignored)
├── .env.production                # Production (gitignored)
├── .eslintrc.json                 # ESLint configuration
├── .prettierrc                    # Prettier configuration
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── vitest.config.ts               # Vitest configuration
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Dependencies
└── pnpm-lock.yaml                 # Lock file
```

---

## 🎨 Code Style & Conventions

### TypeScript Best Practices

- **Strict Mode**: Always enabled - no implicit `any`, strict null checks
- **Type Definitions**: Use interfaces for objects, types for unions/intersections
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `ProductCard.tsx`)
  - Files: `camelCase.tsx` for components, `kebab-case.ts` for utilities
  - Functions: `camelCase` (e.g., `handleAddToCart`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
  - Types/Interfaces: `PascalCase` (e.g., `ProductType`, `UserInterface`)`

---

## 🔥 Firebase Integration

### Firestore Operations

```typescript
// ✅ Good: Service layer pattern with TypeScript
import { db } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { Product, ProductInput } from "@/types/product.types";

export const productsService = {
  async getAll(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    );
  },

  async getById(id: string): Promise<Product | null> {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Product;
  },

  async create(productData: ProductInput): Promise<string> {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<ProductInput>): Promise<void> {
    await updateDoc(doc(db, "products", id), {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "products", id));
  },

  async getByCategory(category: string): Promise<Product[]> {
    const q = query(
      collection(db, "products"),
      where("category", "==", category)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    );
  },
};
```

### Authentication

```typescript
// ✅ Good: Use AuthContext with TypeScript
import { useAuth } from "@/contexts/AuthContext";
import { FC } from "react";

export const ProtectedPage: FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <LoginPrompt />;

  return <ProtectedContent user={user} />;
};
```

---

## 🛒 State Management

### Cart Context Pattern

```typescript
// ✅ Good: Context with reducer pattern and TypeScript
import { createContext, useContext, useReducer, FC, ReactNode } from "react";
import { Product } from "@/types/product.types";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

interface CartContextType extends CartState {
  dispatch: React.Dispatch<CartAction>;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.id
      );

      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex].quantity += 1;
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }

      const newItems = [
        ...state.items,
        { product: action.payload, quantity: 1 },
      ];
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      };
    }

    case "REMOVE_ITEM":
      const filteredItems = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems),
      };

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.product.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
}

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
```

---

## 🧪 Testing Guidelines

### Test Structure

```typescript
// ✅ Good: Comprehensive test suite with TypeScript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/types/product.types";

// Mock dependencies
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("ProductCard", () => {
  const mockProduct: Product = {
    id: "1",
    name: "Test Product",
    description: "Test description",
    price: 99.99,
    images: ["/test.jpg"],
    category: "electronics",
    stock: 10,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("renders product information", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
  });

  it("handles add to cart action", async () => {
    const mockAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    const addButton = screen.getByText("Add to Cart");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });
  });

  it("shows loading state during async operations", async () => {
    const mockAddToCart = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    const addButton = screen.getByText("Add to Cart");
    fireEvent.click(addButton);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
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
pnpm test                    # Run all tests
pnpm test:watch              # Watch mode
pnpm test:coverage           # Generate coverage report
pnpm test:e2e                # Run Playwright E2E tests
pnpm test:ui                 # Run tests with UI
```

---

## 🔒 Security Best Practices

### Environment Variables

```typescript
// ✅ Good: Use environment variables
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// ❌ Bad: Hardcoded secrets
const stripeKey = "sk_test_..."; // NEVER DO THIS
```

### Input Validation

```typescript
// ✅ Good: Validate and sanitize with Zod
import { z } from "zod";

const emailSchema = z.string().email();

function validateEmail(email: string): string {
  const result = emailSchema.safeParse(email);
  if (!result.success) {
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

```typescript
// ✅ Good: Server-side checkout session with TypeScript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CheckoutItem[] } = await request.json();

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
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

---

## 🚀 Performance Optimization

### Image Optimization

```typescript
// ✅ Good: Use Next.js Image component with TypeScript
import Image from "next/image";
import { FC } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  isAboveFold?: boolean;
}

export const ProductImage: FC<ProductImageProps> = ({
  src,
  alt,
  isAboveFold = false,
}) => (
  <Image
    src={src}
    alt={alt}
    width={400}
    height={400}
    priority={isAboveFold}
    loading={isAboveFold ? "eager" : "lazy"}
  />
);

// ❌ Bad: Regular img tag
<img src={product.image} alt={product.name} />;
```

### Code Splitting

```typescript
// ✅ Good: Dynamic imports for heavy components
import dynamic from "next/dynamic";
import { FC } from "react";

const HeavyChart = dynamic(() => import("@/components/HeavyChart"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const Dashboard: FC = () => {
  return (
    <div>
      <HeavyChart />
    </div>
  );
};
```

---

## 🐛 Error Handling

### Try-Catch Pattern

```typescript
// ✅ Good: Comprehensive error handling with TypeScript
async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch("/api/products");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Product[] = await response.json();
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

```typescript
// ✅ Good: Error boundary for React components with TypeScript
"use client";
import { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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

```typescript
// ✅ Good: Semantic elements with ARIA and TypeScript
import { FC } from "react";

interface AddToCartButtonProps {
  onClick: () => void;
  isInCart: boolean;
  isLoading: boolean;
}

export const AddToCartButton: FC<AddToCartButtonProps> = ({
  onClick,
  isInCart,
  isLoading,
}) => (
  <button
    onClick={onClick}
    aria-label="Add product to cart"
    aria-pressed={isInCart}
    disabled={isLoading}
    className="btn-primary"
  >
    <ShoppingCartIcon aria-hidden="true" />
    <span>Add to Cart</span>
  </button>
);

// ❌ Bad: Non-semantic div as button
<div onClick={handleClick}>Add to Cart</div>;
```

---

## 📦 Component Patterns

### HOC Pattern (Authentication)

```typescript
// ✅ Good: Reusable authentication HOC with TypeScript
import { ComponentType, useEffect, FC } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function withAuth<P extends object>(Component: ComponentType<P>): FC<P> {
  return function AuthenticatedComponent(props: P) {
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

// Usage
export default withAuth(ProtectedPage);
```

---

## 🔄 Data Fetching

### Server Components (Preferred)

```typescript
// ✅ Good: Fetch in server component with TypeScript
import { Product } from "@/types/product.types";

export default async function ProductsPage() {
  const products: Product[] = await fetch("https://api.example.com/products", {
    next: { revalidate: 3600 }, // Cache for 1 hour
  }).then((res) => res.json());

  return <ProductGrid products={products} />;
}
```

### Client Components (When Needed)

```typescript
// ✅ Good: SWR or React Query for client-side fetching with TypeScript
"use client";
import useSWR from "swr";
import { Product } from "@/types/product.types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductList() {
  const {
    data: products,
    error,
    isLoading,
  } = useSWR<Product[]>("/api/products", fetcher);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <ProductGrid products={products} />;
}
```

---

## 🎯 Common Anti-Patterns to Avoid

### ❌ Don't: Mutate state directly

```typescript
// ❌ Bad
state.items.push(newItem);

// ✅ Good
setState({ ...state, items: [...state.items, newItem] });
```

### ❌ Don't: Use index as key

```typescript
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

```typescript
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

```typescript
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
pnpm dev                 # Start Next.js dev server (localhost:3000)
pnpm emulator            # Start Firebase emulators
pnpm seed                # Seed database with mock data
./start-dev.sh           # Start all services (emulator + seed + dev)

# Testing
pnpm test                # Run Vitest tests
pnpm test:watch          # Vitest in watch mode
pnpm test:coverage       # Generate coverage report
pnpm test:e2e            # Run Playwright E2E tests
pnpm test:ui             # Run tests with UI

# Building
pnpm build               # Production build
pnpm start               # Start production server

# Linting & Formatting
pnpm lint                # Run ESLint
pnpm lint:fix            # Auto-fix ESLint issues
pnpm format              # Format with Prettier
pnpm type-check          # TypeScript type checking
```

---

## 📚 Key Dependencies & Docs

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Firebase**: https://firebase.google.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Stripe**: https://stripe.com/docs/api
- **Vitest**: https://vitest.dev/
- **React Testing Library**: https://testing-library.com/react
- **Playwright**: https://playwright.dev/

---

## 🎯 When Suggesting Code

### Always:

1. ✅ Use TypeScript with strict type checking
2. ✅ Follow Next.js 15 App Router conventions
3. ✅ Use Tailwind for styling
4. ✅ Add Framer Motion for animations
5. ✅ Include error handling
6. ✅ Add loading states
7. ✅ Consider accessibility
8. ✅ Write tests for new features
9. ✅ Use semantic HTML
10. ✅ Follow React best practices

### Never:

1. ❌ Use plain JavaScript without types
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

- **This is a TypeScript project** - Always use TypeScript with proper type definitions
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
- [ ] Coverage maintained (>90%)
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Responsive design verified
- [ ] Accessibility checked
- [ ] Documentation updated
- [ ] TypeScript types defined

## 📸 Screenshots (if applicable)

[Add screenshots here]
```

---

##--
do not create summary files after completion of prompts unless I say so

s
**Last Updated**: January 2025  
**Maintained By**: YekZen Development Team

Use these guidelines to provide consistent, high-quality code suggestions for the YekZen eCommerce platform.
