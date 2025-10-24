# 📘 TypeScript Project Structure - Best Practices

## ✅ Correct Approach for Next.js + TypeScript

### File Organization

```
YekZen-eCommerce/
├── types/                          # ✅ Shared domain types ONLY
│   ├── product.types.ts           # Product model (used everywhere)
│   ├── user.types.ts              # User model (used everywhere)
│   ├── cart.types.ts              # Cart model (used everywhere)
│   ├── order.types.ts             # Order model (used everywhere)
│   └── global.d.ts                # Global utility types
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx             # ✅ ButtonProps defined HERE
│   │   ├── Input.tsx              # ✅ InputProps defined HERE
│   │   └── Modal.tsx              # ✅ ModalProps defined HERE
│   │
│   ├── product/
│   │   ├── ProductCard.tsx        # ✅ ProductCardProps defined HERE
│   │   └── ProductGrid.tsx        # ✅ ProductGridProps defined HERE
│   │
│   └── layout/
│       └── Header.tsx             # ✅ HeaderProps defined HERE
│
├── app/
│   ├── page.tsx                   # ✅ Component with inline types
│   ├── products/
│   │   └── page.tsx               # ✅ Component with inline types
│   └── api/
│       └── products/
│           └── route.ts           # ✅ API types inline or imported from types/
│
├── contexts/
│   ├── AuthContext.tsx            # ✅ Imports User from types/
│   └── CartContext.tsx            # ✅ Imports Cart, CartItem from types/
│
└── services/
    └── products.service.ts        # ✅ Imports Product from types/
```

---

## 🎯 Type Definition Rules

### ✅ DO: Co-locate Component Props

```typescript
// components/ui/Button.tsx
"use client";

import { ReactNode } from "react";

// ✅ Define props interface IN THE SAME FILE
interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export default function Button({ children, variant, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### ✅ DO: Create Shared Domain Types

```typescript
// types/product.types.ts
// ✅ Product is used in: services, components, contexts, API routes
export interface Product {
  id: string;
  name: string;
  price: number;
  // ... other fields
}
```

```typescript
// components/product/ProductCard.tsx
import { Product } from "@/types/product.types";

// ✅ Component props defined here
interface ProductCardProps {
  product: Product; // ✅ Import shared type
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product }: ProductCardProps) {
  return <div>{product.name}</div>;
}
```

### ❌ DON'T: Create separate type files for component props

```typescript
// ❌ WRONG: Don't create types/button.types.ts
export interface ButtonProps {
  variant: string;
}

// ❌ WRONG: Don't create types/productCard.types.ts
export interface ProductCardProps {
  product: Product;
}
```

---

## 📋 When to Use Separate Type Files

### ✅ Use `/types/*.types.ts` for:

1. **Domain Models** - Business entities used across the app
   - `Product`, `User`, `Order`, `Cart`
2. **API Contracts** - Shared between frontend/backend

   - Request/Response types
   - API error types

3. **Global Utilities** - Reusable type helpers

   - `ApiResponse<T>`
   - `PaginatedResponse<T>`
   - Environment variables

4. **Enums & Constants** - Shared across app
   - `OrderStatus`, `PaymentMethod`
   - `UserRole`

### ✅ Define Inline for:

1. **Component Props** - Specific to that component
2. **Hook Return Types** - Specific to that hook
3. **Internal State Types** - Not exported
4. **Local Helper Types** - Only used in one file

---

## 🎯 Practical Example

### Correct Structure:

```typescript
// types/product.types.ts
// ✅ Shared domain type
export interface Product {
  id: string;
  name: string;
  price: number;
}

// components/product/ProductCard.tsx
import { Product } from "@/types/product.types";

// ✅ Component-specific props
interface ProductCardProps {
  product: Product; // Shared type
  variant?: "grid" | "list"; // Component-specific
  onAddToCart?: () => void;
}

export default function ProductCard({ product, variant }: ProductCardProps) {
  return <div>{product.name}</div>;
}

// services/products.service.ts
import { Product } from "@/types/product.types";

// ✅ Shared type used here too
export async function getProducts(): Promise<Product[]> {
  // ...
}

// app/api/products/route.ts
import { Product } from "@/types/product.types";
import { NextResponse } from "next/server";

// ✅ Shared type in API route
export async function GET(): Promise<NextResponse<Product[]>> {
  // ...
}
```

---

## 🚀 Summary

**Component-Based TypeScript means:**

- ✅ Props interfaces live **with** the component
- ✅ Domain types live in `/types` (shared across app)
- ✅ Import shared types when needed
- ✅ Keep component files self-contained

**NOT:**

- ❌ Creating separate type files for every component
- ❌ Splitting props into external files

---

The structure I created is **correct** for Next.js:

- `/types/product.types.ts` - ✅ Shared domain model
- `/types/user.types.ts` - ✅ Shared domain model
- `/types/cart.types.ts` - ✅ Shared domain model
- `components/ui/Button.tsx` - ✅ Props defined inline

This is the **standard Next.js + TypeScript pattern**! 🎉
