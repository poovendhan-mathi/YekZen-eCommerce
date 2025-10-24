/**
 * Animation Performance Optimizer
 * Utilities to ensure smooth 60fps animations
 * Preserves current UI while optimizing animation performance
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hook to detect if user prefers reduced motion
 */
export const useAnimationPreference = () => {
  const prefersReducedMotion = useReducedMotion();
  return {
    shouldAnimate: !prefersReducedMotion,
    animationDuration: prefersReducedMotion ? 0 : 0.3,
  };
};

/**
 * Hook to detect device performance
 */
export const useDevicePerformance = () => {
  const [performance, setPerformance] = useState<"high" | "medium" | "low">(
    "high"
  );

  useEffect(() => {
    // Check device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    if (deviceMemory) {
      if (deviceMemory >= 8) {
        setPerformance("high");
      } else if (deviceMemory >= 4) {
        setPerformance("medium");
      } else {
        setPerformance("low");
      }
    } else {
      // Fallback to CPU cores
      if (hardwareConcurrency >= 8) {
        setPerformance("high");
      } else if (hardwareConcurrency >= 4) {
        setPerformance("medium");
      } else {
        setPerformance("low");
      }
    }
  }, []);

  return performance;
};

/**
 * Hook to get optimal animation settings based on device
 */
export const useOptimalAnimationSettings = () => {
  const performance = useDevicePerformance();
  const { shouldAnimate } = useAnimationPreference();

  const settings = {
    high: {
      enableBlur: true,
      enableParallax: true,
      enableComplexAnimations: true,
      frameRate: 60,
      quality: "high" as const,
    },
    medium: {
      enableBlur: false,
      enableParallax: true,
      enableComplexAnimations: false,
      frameRate: 30,
      quality: "medium" as const,
    },
    low: {
      enableBlur: false,
      enableParallax: false,
      enableComplexAnimations: false,
      frameRate: 30,
      quality: "low" as const,
    },
  };

  const currentSettings = settings[performance];

  return {
    ...currentSettings,
    shouldAnimate,
    performance,
  };
};

/**
 * Hook to throttle expensive animations
 */
export const useThrottledAnimation = (
  callback: () => void,
  delay: number = 100
) => {
  const lastRun = useRef(Date.now());

  const throttledCallback = () => {
    const now = Date.now();
    if (now - lastRun.current >= delay) {
      callback();
      lastRun.current = now;
    }
  };

  return throttledCallback;
};

/**
 * Hook to detect if element is in viewport (for lazy animations)
 */
export const useIsInViewport = (ref: React.RefObject<HTMLElement>) => {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsInViewport(entry.isIntersecting);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isInViewport;
};

/**
 * Hook to measure frame rate
 */
export const useFrameRate = () => {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    let animationFrameId: number;

    const measureFPS = () => {
      frameCount.current++;
      const now = Date.now();
      const elapsed = now - lastTime.current;

      if (elapsed >= 1000) {
        setFps(Math.round((frameCount.current / elapsed) * 1000));
        frameCount.current = 0;
        lastTime.current = now;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return fps;
};

/**
 * Utility to get GPU-accelerated CSS properties
 */
export const getGPUAcceleratedStyle = () => {
  return {
    transform: "translateZ(0)",
    willChange: "transform",
    backfaceVisibility: "hidden" as const,
  };
};

/**
 * Utility to create optimized spring config
 */
export const getOptimizedSpringConfig = (
  performance: "high" | "medium" | "low"
) => {
  const configs = {
    high: { damping: 25, stiffness: 300 },
    medium: { damping: 30, stiffness: 200 },
    low: { damping: 40, stiffness: 150 },
  };

  return configs[performance];
};

/**
 * Animation variants optimized for performance
 */
export const optimizedVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: 0.3, ease: [0.6, 0.01, 0.05, 0.95] },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: 0.2 },
  },
};

/**
 * Batch animation updates for better performance
 */
export const useBatchedAnimations = () => {
  const animationQueue = useRef<Array<() => void>>([]);
  const isProcessing = useRef(false);

  const queueAnimation = (animation: () => void) => {
    animationQueue.current.push(animation);

    if (!isProcessing.current) {
      isProcessing.current = true;
      requestAnimationFrame(() => {
        animationQueue.current.forEach((anim) => anim());
        animationQueue.current = [];
        isProcessing.current = false;
      });
    }
  };

  return queueAnimation;
};

export default {
  useAnimationPreference,
  useDevicePerformance,
  useOptimalAnimationSettings,
  useThrottledAnimation,
  useIsInViewport,
  useFrameRate,
  getGPUAcceleratedStyle,
  getOptimizedSpringConfig,
  optimizedVariants,
  useBatchedAnimations,
};
