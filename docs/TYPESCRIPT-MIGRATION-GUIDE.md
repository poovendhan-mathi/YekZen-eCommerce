# 🔄 TypeScript Migration Guide

## Overview

This guide helps you migrate the YekZen eCommerce project from JavaScript to TypeScript gradually, maintaining functionality throughout.

## ✅ What's Already Done

- ✅ `tsconfig.json` - TypeScript configuration with strict mode
- ✅ `/types/*` - Shared domain type definitions
- ✅ `components/ui/Button.tsx` - Example migrated component
- ✅ `next.config.js` - Updated for TypeScript support

## 📋 Migration Strategy

### Phase 1: Foundation (DONE ✅)

- [x] Install TypeScript dependencies
- [x] Create `tsconfig.json`
- [x] Create shared type definitions in `/types`
- [x] Update `next.config.js`

### Phase 2: Component Migration (In Progress 🔄)

Priority order for conversion:

1. **UI Components** (Highest Priority)

   - [x] `components/ui/Button.jsx` → `.tsx`
   - [ ] `components/ui/Input.jsx` → `.tsx`
   - [ ] `components/ui/Modal.jsx` → `.tsx`
   - [ ] Other UI components

2. **Core Components**

   - [ ] `components/layout/Header.jsx` → `.tsx`
   - [ ] `components/layout/Footer.jsx` → `.tsx`
   - [ ] `components/product/ProductCard.jsx` → `.tsx`

3. **Context Providers**
   - [ ] `contexts/AuthContext.js` → `.tsx`
   - [ ] `contexts/CartContext.js` → `.tsx`

### Phase 3: Services & Firebase

- [ ] `firebase/config.js` → `.ts`
- [ ] `firebase/productsService.js` → `.ts`
- [ ] `services/*.js` → `.ts`

### Phase 4: App Routes

- [ ] `app/page.js` → `.tsx`
- [ ] `app/layout.js` → `.tsx`
- [ ] `app/products/page.js` → `.tsx`
- [ ] Other route files

---

## 🚀 How to Migrate a Component

### Example: Converting ProductCard

**Before (ProductCard.jsx):**

```jsx
"use client";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
    </div>
  );
}
```

**After (ProductCard.tsx):**

```typescript
"use client";

import { Product } from "@/types/product.types";

// ✅ Props interface defined in component file
interface ProductCardProps {
  product: Product; // ✅ Import shared type
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart?.(product)}>Add to Cart</button>
    </div>
  );
}
```

### Key Changes:

1. ✅ Rename `.jsx` → `.tsx`
2. ✅ Import shared types from `/types`
3. ✅ Define `Props` interface in component
4. ✅ Add type annotations to function parameters
5. ✅ Use optional chaining (`?.`) for optional props

---

## 📝 Migration Checklist for Each File

When converting a file:

- [ ] Rename `.js/.jsx` to `.ts/.tsx`
- [ ] Import required types from `/types`
- [ ] Define component props interface
- [ ] Add type annotations to function parameters
- [ ] Add return type annotations (optional but recommended)
- [ ] Fix any TypeScript errors
- [ ] Test the component

---

## 🔧 Common Patterns

### Pattern 1: Client Component with Props

```typescript
"use client";

import { ReactNode } from "react";
import { Product } from "@/types/product.types";

interface MyComponentProps {
  children: ReactNode;
  product: Product;
  onAction?: () => void;
}

export default function MyComponent({
  children,
  product,
  onAction,
}: MyComponentProps) {
  // implementation
}
```

### Pattern 2: Server Component (async)

```typescript
import { Product } from "@/types/product.types";

export default async function ProductsPage() {
  const products: Product[] = await getProducts();

  return <ProductGrid products={products} />;
}
```

### Pattern 3: API Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/types/product.types";

export async function GET(request: NextRequest) {
  const products: Product[] = await fetchProducts();
  return NextResponse.json<Product[]>(products);
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json();
  // Validate and type check body
  return NextResponse.json({ success: true });
}
```

### Pattern 4: Context with TypeScript

```typescript
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types/user.types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<void> => {
    // implementation
  };

  const logout = async (): Promise<void> => {
    // implementation
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

---

## 🚨 Common Migration Issues

### Issue 1: Implicit 'any' type

**Error:**

```
Parameter 'product' implicitly has an 'any' type.
```

**Fix:**

```typescript
// ❌ Before
function addToCart(product) {}

// ✅ After
import { Product } from "@/types/product.types";
function addToCart(product: Product) {}
```

### Issue 2: Missing type for event handlers

**Error:**

```
Parameter 'e' implicitly has an 'any' type.
```

**Fix:**

```typescript
import { ChangeEvent, MouseEvent } from "react";

// For input change
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// For button click
const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};
```

### Issue 3: useState without type

**Fix:**

```typescript
// ❌ Before
const [user, setUser] = useState(null);

// ✅ After
import { User } from "@/types/user.types";
const [user, setUser] = useState<User | null>(null);
```

---

## 🎯 Testing the Migration

After migrating files:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Build check
npm run build

# 3. Run dev server
npm run dev

# 4. Test features
# - Navigate to migrated pages
# - Test migrated components
# - Check browser console for errors
```

---

## 📊 Progress Tracking

Track your migration progress:

```bash
# Count TypeScript files
find app -name "*.tsx" | wc -l
find components -name "*.tsx" | wc -l

# Count remaining JavaScript files
find app -name "*.js" -o -name "*.jsx" | wc -l
find components -name "*.js" -o -name "*.jsx" | wc -l
```

---

## 🎉 Migration Complete When:

- [ ] All `.js/.jsx` files converted to `.ts/.tsx`
- [ ] `npx tsc --noEmit` shows no errors
- [ ] `npm run build` succeeds
- [ ] All features work in dev mode
- [ ] All tests pass
- [ ] No runtime TypeScript errors

---

## 📚 Resources

- [Next.js TypeScript Docs](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

**Migration Started**: October 22, 2025  
**Target Completion**: October 29, 2025  
**Current Status**: Foundation Complete ✅
