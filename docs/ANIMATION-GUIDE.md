# Animation System Documentation

## Overview

This project uses **Framer Motion 11.x** for all animations, providing 60fps smooth animations while preserving the current UI design.

## Animation Components

### 1. Scroll Reveal Animations (`components/ui/ScrollReveal.tsx`)

Components that animate elements as they scroll into view.

```tsx
import { ScrollReveal, FadeInWhenVisible, Parallax } from '@/components/ui/ScrollReveal';

// Scroll reveal with direction
<ScrollReveal direction="up" delay={0.2}>
  <ProductCard />
</ScrollReveal>

// Simple fade in
<FadeInWhenVisible>
  <Content />
</FadeInWhenVisible>

// Parallax effect
<Parallax offset={50}>
  <BackgroundImage />
</Parallax>
```

**Available Components:**

- `ScrollReveal` - Animates from any direction (up, down, left, right)
- `FadeInWhenVisible` - Simple fade animation
- `Parallax` - Parallax scrolling effect
- `ScaleOnScroll` - Scales based on scroll position
- `StaggerContainer` & `StaggerItem` - Stagger child animations
- `SlideInFromSide` - Slide from left or right

### 2. Micro Interactions (`components/ui/MicroInteractions.tsx`)

Small delightful animations that enhance UX.

```tsx
import { ButtonHover, MagneticButton, CardTilt } from '@/components/ui/MicroInteractions';

// Hover effect button
<ButtonHover onClick={handleClick}>
  Click Me
</ButtonHover>

// Magnetic button (follows cursor)
<MagneticButton strength={0.3}>
  Magnetic
</MagneticButton>

// 3D tilt card
<CardTilt maxTilt={15}>
  <ProductCard />
</CardTilt>
```

**Available Components:**

- `ButtonHover` - Scale + glow on hover
- `MagneticButton` - Follows cursor movement
- `CardTilt` - 3D tilt following mouse
- `RippleEffect` - Material Design ripple
- `FloatingElement` - Gentle floating animation
- `PulseGlow` - Pulsing glow effect
- `ShakeOnError` - Shake for errors
- `SuccessBounce` - Success animation

### 3. Mobile Gestures (`components/ui/MobileGestures.tsx`)

Touch-friendly interactions for mobile devices.

```tsx
import { SwipeableCard, PullToRefresh, BottomDrawer } from '@/components/ui/MobileGestures';

// Swipeable card
<SwipeableCard
  onSwipeLeft={() => console.log('Left')}
  onSwipeRight={() => console.log('Right')}
>
  <Card />
</SwipeableCard>

// Pull to refresh
<PullToRefresh onRefresh={async () => await fetchData()}>
  <ProductList />
</PullToRefresh>

// Bottom drawer
<BottomDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <DrawerContent />
</BottomDrawer>
```

**Available Components:**

- `SwipeableCard` - Detect swipe gestures
- `PullToRefresh` - Pull down to refresh
- `BottomDrawer` - Swipeable drawer from any direction
- `HorizontalScroll` - Touch-friendly horizontal scroll
- `LongPress` - Detect long press
- `DoubleTap` - Detect double tap

### 4. Product Animations (`components/product/ProductAnimations.tsx`)

Premium animations specifically for products.

```tsx
import {
  AnimatedProductCard,
  ProductImageZoom,
  ProductImageGallery,
  AddToCartAnimation
} from '@/components/product/ProductAnimations';

// 3D product card
<AnimatedProductCard>
  <ProductCard />
</AnimatedProductCard>

// Image zoom on hover
<ProductImageZoom src="/image.jpg" alt="Product" />

// Image gallery with slides
<ProductImageGallery
  images={['/1.jpg', '/2.jpg', '/3.jpg']}
  productName="Product Name"
/>

// Animated add to cart
<AddToCartAnimation
  onAdd={handleAdd}
  isAdding={isAdding}
  isAdded={isAdded}
/>
```

**Available Components:**

- `AnimatedProductCard` - 3D tilt effect
- `ProductImageZoom` - Zoom on hover
- `ProductImageGallery` - Smooth gallery slides
- `AddToCartAnimation` - Animated button with states
- `QuickView` - Smooth modal entrance
- `PriceFlip` - Animated price changes

### 5. Page Transitions (`components/transitions/PageTransition.tsx`)

Smooth transitions between pages.

```tsx
import { PageTransition, SlideUpTransition } from '@/components/transitions/PageTransition';

// In layout.tsx
<PageTransition variant="fade">
  {children}
</PageTransition>

// Or use specific transition
<SlideUpTransition>
  {children}
</SlideUpTransition>
```

**Available Variants:**

- `fade` - Simple fade in/out
- `slide` - Slide horizontally
- `scale` - Scale up/down
- `flip` - 3D flip effect
- `blur` - Blur transition

## Performance Optimization

### Animation Hooks (`lib/animationOptimizer.ts`)

```tsx
import {
  useOptimalAnimationSettings,
  useAnimationPreference,
  useDevicePerformance,
} from "@/lib/animationOptimizer";

function MyComponent() {
  const settings = useOptimalAnimationSettings();

  // Automatically adjusts based on:
  // - User's reduced motion preference
  // - Device performance (CPU/memory)
  // - Current frame rate

  return (
    <motion.div
      animate={settings.shouldAnimate ? { x: 100 } : {}}
      transition={{ duration: settings.animationDuration }}
    >
      Content
    </motion.div>
  );
}
```

**Available Hooks:**

- `useAnimationPreference()` - Respects user's motion preferences
- `useDevicePerformance()` - Returns 'high' | 'medium' | 'low'
- `useOptimalAnimationSettings()` - Auto-adjusts all settings
- `useThrottledAnimation()` - Throttle expensive animations
- `useIsInViewport()` - Lazy load animations
- `useFrameRate()` - Monitor current FPS

## Best Practices

### 1. Always Preserve Current UI

```tsx
// ✅ Good: Adds animation without changing UI
<ScrollReveal direction="up">
  <div className="existing-class-names">
    {/* Current UI structure unchanged */}
  </div>
</ScrollReveal>

// ❌ Bad: Changes UI structure
<NewComponentThatReplacesEverything />
```

### 2. Use Performance Optimizations

```tsx
import { useOptimalAnimationSettings } from "@/lib/animationOptimizer";

function ProductCard() {
  const { shouldAnimate, enableBlur, enableParallax } =
    useOptimalAnimationSettings();

  return (
    <motion.div
      animate={shouldAnimate ? animations : {}}
      style={{
        // GPU acceleration
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      {/* ... */}
    </motion.div>
  );
}
```

### 3. Respect Reduced Motion

```tsx
import { useAnimationPreference } from "@/lib/animationOptimizer";

function AnimatedComponent() {
  const { shouldAnimate, animationDuration } = useAnimationPreference();

  // Automatically disabled for users who prefer reduced motion
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: shouldAnimate ? 1 : 1 }}
      transition={{ duration: animationDuration }}
    >
      Content
    </motion.div>
  );
}
```

### 4. Use Appropriate Animation Types

```tsx
// For page transitions
<PageTransition variant="fade">{children}</PageTransition>

// For scroll effects
<ScrollReveal direction="up">...</ScrollReveal>

// For hover effects
<ButtonHover>...</ButtonHover>

// For mobile
<SwipeableCard onSwipeLeft={...}>...</SwipeableCard>
```

## Animation Timing Guidelines

- **Micro-interactions**: 0.1-0.3s (button hover, clicks)
- **Page transitions**: 0.3-0.5s (route changes)
- **Scroll reveals**: 0.4-0.6s (elements entering viewport)
- **Complex animations**: 0.5-1.0s (galleries, modals)

## Easing Functions

```tsx
// Fast start, slow end (common)
ease: [0.6, -0.05, 0.01, 0.99];

// Spring physics (bouncy)
type: "spring";
stiffness: 300;
damping: 30;

// Ease in-out (smooth)
ease: "easeInOut";
```

## Testing Animations

1. **Performance**: Check FPS stays at 60
2. **Accessibility**: Test with reduced motion enabled
3. **Mobile**: Test touch gestures on real devices
4. **Load**: Test with slow 3G network throttling

## Troubleshooting

**Animations not working?**

- Check Framer Motion is installed: `npm install framer-motion`
- Ensure "use client" directive at top of file
- Verify animations respect `shouldAnimate` flag

**Poor performance?**

- Use `useOptimalAnimationSettings()` hook
- Enable GPU acceleration with `transform: translateZ(0)`
- Limit number of simultaneous animations
- Use `willChange` CSS property sparingly

**Conflicts with existing UI?**

- Wrap existing components, don't replace them
- Use `className` prop to preserve styling
- Keep original HTML structure intact

## Examples

### Enhanced Product Card

```tsx
import {
  AnimatedProductCard,
  ProductImageZoom,
} from "@/components/product/ProductAnimations";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

function ProductCard({ product }) {
  return (
    <ScrollReveal direction="up">
      <AnimatedProductCard className="bg-white rounded-lg shadow-lg p-6">
        <ProductImageZoom src={product.image} alt={product.name} />
        <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
      </AnimatedProductCard>
    </ScrollReveal>
  );
}
```

### Mobile-Friendly Product List

```tsx
import { PullToRefresh, SwipeableCard } from "@/components/ui/MobileGestures";
import { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

function ProductList() {
  return (
    <PullToRefresh onRefresh={fetchProducts}>
      <StaggerContainer staggerDelay={0.1}>
        {products.map((product) => (
          <StaggerItem key={product.id}>
            <SwipeableCard
              onSwipeLeft={() => addToCart(product)}
              onSwipeRight={() => addToWishlist(product)}
            >
              <ProductCard product={product} />
            </SwipeableCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </PullToRefresh>
  );
}
```

---

**Version**: 1.0  
**Last Updated**: January 2025  
**Framer Motion Version**: 11.x
