/**
 * Animation Optimization Configuration
 * Makes animations smooth and performant by using GPU acceleration
 */

// Add these optimized animation utilities to your globals.css or create a new animation.css

export const optimizedAnimations = {
  // Smooth transitions using transform and opacity (GPU accelerated)
  smoothTransition: {
    willChange: "transform, opacity",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    perspective: "1000px",
  },

  // Reduce motion for users who prefer it
  reducedMotion: `
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `,

  // Hardware acceleration classes
  gpuAcceleration: {
    transform: "translate3d(0, 0, 0)",
    willChange: "transform",
  },
};

// Framer Motion optimal config
export const motionConfig = {
  // Use layout animations sparingly
  layoutTransition: {
    type: "spring",
    stiffness: 700,
    damping: 30,
  },

  // Optimized spring config
  smoothSpring: {
    type: "spring",
    stiffness: 260,
    damping: 20,
  },

  // Fast transitions
  fastTransition: {
    duration: 0.2,
    ease: [0.4, 0.0, 0.2, 1],
  },

  // Smooth entrance
  entrance: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] },
  },

  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },

  // Hover scale (optimized)
  hoverScale: {
    whileHover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    whileTap: { scale: 0.98 },
  },
};
