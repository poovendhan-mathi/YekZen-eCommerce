# Animation Components - Quick Reference Guide

## 🎨 Available Animation Components

### 1. Micro-Interactions (`components/ui/MicroInteractions.jsx`)

#### EnhancedButton

Magnetic button with ripple effects.

```jsx
import { EnhancedButton } from "@/components/ui/MicroInteractions";

<EnhancedButton magneticStrength={0.3} rippleColor="rgba(255, 255, 255, 0.5)">
  Click Me
</EnhancedButton>;
```

**Props:**

- `magneticStrength` (number): Hover magnetic effect strength (0-1)
- `rippleColor` (string): Ripple effect color
- All standard button props

---

#### FloatingActionButton

Expandable FAB with action menu.

```jsx
import { FloatingActionButton } from "@/components/ui/MicroInteractions";

const actions = [
  { icon: <PlusIcon />, label: "Add", onClick: handleAdd },
  { icon: <EditIcon />, label: "Edit", onClick: handleEdit },
];

<FloatingActionButton actions={actions} />;
```

---

#### HoverCard

3D tilt card with perspective effects.

```jsx
import { HoverCard } from "@/components/ui/MicroInteractions";

<HoverCard intensity={0.1}>
  <YourContent />
</HoverCard>;
```

**Props:**

- `intensity` (number): Tilt effect strength
- `className` (string): Additional CSS classes

---

#### AnimatedTooltip

Smart positioning tooltip with animations.

```jsx
import { AnimatedTooltip } from "@/components/ui/MicroInteractions";

<AnimatedTooltip content="Click to save" position="top">
  <button>Save</button>
</AnimatedTooltip>;
```

**Props:**

- `content` (string): Tooltip text
- `position` (string): 'top' | 'bottom' | 'left' | 'right'

---

### 2. Mobile Gestures (`components/ui/MobileGestures.jsx`)

#### SwipeableCard

Swipe to dismiss or action.

```jsx
import { SwipeableCard } from "@/components/ui/MobileGestures";

<SwipeableCard
  onSwipeLeft={handleDelete}
  onSwipeRight={handleArchive}
  swipeThreshold={100}
>
  <CardContent />
</SwipeableCard>;
```

**Props:**

- `onSwipeLeft` (function): Left swipe callback
- `onSwipeRight` (function): Right swipe callback
- `swipeThreshold` (number): Pixels to trigger action

---

#### PullToRefresh

Pull down to refresh gesture.

```jsx
import { PullToRefresh } from "@/components/ui/MobileGestures";

<PullToRefresh onRefresh={fetchData}>
  <YourScrollableContent />
</PullToRefresh>;
```

---

#### GestureNavigation

Swipe between sections.

```jsx
import { GestureNavigation } from "@/components/ui/MobileGestures";

const sections = [<Section1 />, <Section2 />, <Section3 />];

<GestureNavigation sections={sections} />;
```

---

#### DragToReorder

Drag and drop list reordering.

```jsx
import { DragToReorder } from "@/components/ui/MobileGestures";

<DragToReorder items={items} onReorder={setItems}>
  {(item) => <ListItem data={item} />}
</DragToReorder>;
```

---

### 3. Status Animations (`components/ui/StatusAnimations.jsx`)

#### AnimatedCheckmark

Success state animation.

```jsx
import { AnimatedCheckmark } from "@/components/ui/StatusAnimations";

<AnimatedCheckmark size={64} color="green" />;
```

---

#### AnimatedError

Error state animation.

```jsx
import { AnimatedError } from "@/components/ui/StatusAnimations";

<AnimatedError size={64} />;
```

---

#### FormFieldAnimation

Real-time form validation animations.

```jsx
import { FormFieldAnimation } from "@/components/ui/StatusAnimations";

<FormFieldAnimation error={errors.email} success={isValid}>
  <input type="email" {...props} />
</FormFieldAnimation>;
```

**Props:**

- `error` (string): Error message (triggers error state)
- `success` (boolean): Success state
- `children` (ReactNode): Form field to wrap

---

#### LoadingButton

Morphing button with loading states.

```jsx
import { LoadingButton } from "@/components/ui/StatusAnimations";

<LoadingButton isLoading={isSubmitting} loadingText="Saving...">
  Save Changes
</LoadingButton>;
```

**Props:**

- `isLoading` (boolean): Loading state
- `loadingText` (string): Text during loading
- All button props

---

#### NotificationToast

Slide-in notification system.

```jsx
import { NotificationToast } from "@/components/ui/StatusAnimations";

<NotificationToast
  type="success"
  message="Item added to cart"
  isVisible={showToast}
  onClose={() => setShowToast(false)}
  duration={3000}
/>;
```

**Props:**

- `type` (string): 'success' | 'error' | 'warning' | 'info'
- `message` (string): Notification message
- `isVisible` (boolean): Visibility state
- `onClose` (function): Close callback
- `duration` (number): Auto-close duration (ms)

---

### 4. Scroll Progress (`components/ui/ScrollProgress.jsx`)

#### ScrollProgressBar

Top-of-page reading progress.

```jsx
import { ScrollProgressBar } from "@/components/ui/ScrollProgress";

// Add to layout or page
<ScrollProgressBar color="gradient" />;
```

**Props:**

- `color` (string): 'blue' | 'purple' | 'green' | 'red' | 'gradient'

---

#### CircularScrollProgress

Circular progress with percentage.

```jsx
import { CircularScrollProgress } from "@/components/ui/ScrollProgress";

<CircularScrollProgress size={60} />;
```

---

#### ScrollToTop

Animated scroll-to-top button.

```jsx
import { ScrollToTop } from "@/components/ui/ScrollProgress";

<ScrollToTop threshold={400} />;
```

**Props:**

- `threshold` (number): Pixels scrolled before showing

---

### 5. Scroll Animations (`components/ui/ScrollAnimations.jsx`)

#### FadeInOnScroll

Fade in elements as they scroll into view.

```jsx
import { FadeInOnScroll } from "@/components/ui/ScrollAnimations";

<FadeInOnScroll>
  <YourContent />
</FadeInOnScroll>;
```

---

#### StaggerContainer

Stagger animations for child elements.

```jsx
import { StaggerContainer } from "@/components/ui/ScrollAnimations";

<StaggerContainer staggerDelay={0.1}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</StaggerContainer>;
```

---

#### CountUp

Animated number counter.

```jsx
import { CountUp } from "@/components/ui/ScrollAnimations";

<CountUp end={1000} duration={2} />;
```

**Props:**

- `end` (number): Target number
- `duration` (number): Animation duration (seconds)

---

#### ParallaxContainer

Parallax scroll effect.

```jsx
import { ParallaxContainer } from "@/components/ui/ScrollAnimations";

<ParallaxContainer speed={0.5}>
  <YourContent />
</ParallaxContainer>;
```

---

### 6. Loading States (`components/ui/LoadingStates.jsx`)

#### Spinner

Rotating loading spinner.

```jsx
import { Spinner } from "@/components/ui/LoadingStates";

<Spinner size="md" color="blue" />;
```

---

#### LoadingDots

Three-dot loading animation.

```jsx
import { LoadingDots } from "@/components/ui/LoadingStates";

<LoadingDots size="md" />;
```

---

#### PulseLoader

Pulsing loading indicator.

```jsx
import { PulseLoader } from "@/components/ui/LoadingStates";

<PulseLoader count={3} />;
```

---

### 7. Skeleton Loaders (`components/ui/Skeleton.jsx`)

#### ProductCardSkeleton

Skeleton for product cards.

```jsx
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

<ProductCardSkeleton />;
```

---

#### ProductGridSkeleton

Skeleton grid for product listings.

```jsx
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

<ProductGridSkeleton count={8} />;
```

---

#### OrderCardSkeleton

Skeleton for order cards.

```jsx
import { OrderCardSkeleton } from "@/components/ui/Skeleton";

<OrderCardSkeleton />;
```

---

## 🎯 Common Use Cases

### Form Validation with Animations

```jsx
import {
  FormFieldAnimation,
  LoadingButton,
} from "@/components/ui/StatusAnimations";

<form onSubmit={handleSubmit}>
  <FormFieldAnimation error={errors.email} success={!!email && !errors.email}>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </FormFieldAnimation>

  <LoadingButton isLoading={isSubmitting} loadingText="Submitting...">
    Submit
  </LoadingButton>
</form>;
```

---

### Product Card with Enhanced Interactions

```jsx
import { HoverCard, AnimatedTooltip } from "@/components/ui/MicroInteractions";

<HoverCard intensity={0.15}>
  <ProductImage />
  <AnimatedTooltip content="Add to wishlist" position="top">
    <WishlistButton />
  </AnimatedTooltip>
</HoverCard>;
```

---

### Page with Scroll Features

```jsx
import { ScrollProgressBar, ScrollToTop } from "@/components/ui/ScrollProgress";
import { FadeInOnScroll } from "@/components/ui/ScrollAnimations";

export default function Page() {
  return (
    <>
      <ScrollProgressBar color="gradient" />

      <FadeInOnScroll>
        <YourContent />
      </FadeInOnScroll>

      <ScrollToTop threshold={500} />
    </>
  );
}
```

---

### Mobile Swipeable List

```jsx
import { SwipeableCard } from "@/components/ui/MobileGestures";

{
  items.map((item) => (
    <SwipeableCard
      key={item.id}
      onSwipeLeft={() => handleDelete(item.id)}
      onSwipeRight={() => handleArchive(item.id)}
    >
      <ItemContent data={item} />
    </SwipeableCard>
  ));
}
```

---

### Success/Error Notifications

```jsx
import { NotificationToast } from "@/components/ui/StatusAnimations";

const [notification, setNotification] = useState(null);

<NotificationToast
  type={notification?.type}
  message={notification?.message}
  isVisible={!!notification}
  onClose={() => setNotification(null)}
  duration={3000}
/>;
```

---

## 🚀 Performance Tips

1. **Use Suspense for Loading States**

   ```jsx
   <Suspense fallback={<ProductGridSkeleton />}>
     <ProductGrid />
   </Suspense>
   ```

2. **Lazy Load Animation Components**

   ```jsx
   const MobileGestures = dynamic(() =>
     import("@/components/ui/MobileGestures")
   );
   ```

3. **Respect Reduced Motion Preferences**

   - All components automatically respect `prefers-reduced-motion`
   - Animations are simplified or disabled for accessibility

4. **Optimize Heavy Animations**
   - Use `transform` and `opacity` for GPU acceleration
   - Avoid animating layout properties (width, height, etc.)
   - Use `will-change` sparingly

---

## 📱 Mobile Considerations

- **Touch Targets**: Minimum 44x44px for mobile
- **Swipe Thresholds**: Adjust based on device size
- **Haptic Feedback**: Simulated in components
- **Performance**: Test on low-end devices

---

## 🎨 Animation Principles

1. **Duration**: 200-600ms for most animations
2. **Easing**: Use spring physics for natural feel
3. **Delay**: Stagger animations by 50-100ms
4. **Feedback**: Provide immediate visual response
5. **Purpose**: Every animation should serve UX

---

## 🐛 Troubleshooting

**Animation not playing?**

- Check if component is wrapped in `AnimatePresence`
- Verify Framer Motion is installed
- Check for CSS conflicts

**Performance issues?**

- Reduce animation count on screen
- Use GPU-accelerated properties
- Check for memory leaks

**Mobile gestures not working?**

- Test on actual device
- Adjust swipe thresholds
- Check for touch event conflicts

---

## 📚 Further Reading

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Best Practices](https://web.dev/animations/)
- [Mobile Gesture Guidelines](https://material.io/design/interaction/gestures.html)

---

**Last Updated**: Phase 9 Implementation  
**Maintained by**: YekZen Development Team
