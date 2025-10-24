/**
 * Scroll Reveal Animations
 * Components that animate elements as they scroll into view
 * Preserves current UI while adding smooth scroll animations
 */

"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode, FC, useState, useEffect } from "react";

// Types
interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
}

interface ParallaxProps {
  children: ReactNode;
  offset?: number;
  className?: string;
}

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

/**
 * ScrollReveal - Animates elements as they come into view
 * Direction controls which way elements animate from
 */
export const ScrollReveal: FC<ScrollRevealProps> = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
            }
          : {}
      }
      transition={{
        duration,
        delay,
        ease: [0.6, -0.05, 0.01, 0.99],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * FadeInWhenVisible - Simple fade in animation on scroll
 */
export const FadeInWhenVisible: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Parallax - Creates parallax scrolling effect
 */
export const Parallax: FC<ParallaxProps> = ({
  children,
  offset = 50,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

/**
 * ScaleOnScroll - Scales element based on scroll position
 */
export const ScaleOnScroll: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
};

/**
 * StaggerContainer - Staggers animation of child elements
 */
export const StaggerContainer: FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerItem - Individual item for StaggerContainer
 */
export const StaggerItem: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.6, -0.05, 0.01, 0.99],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * SlideInFromSide - Slides content in from side with reveal effect
 */
export const SlideInFromSide: FC<{
  children: ReactNode;
  direction?: "left" | "right";
  className?: string;
}> = ({ children, direction = "left", className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{
        x: direction === "left" ? -100 : 100,
        opacity: 0,
      }}
      animate={
        isInView
          ? {
              x: 0,
              opacity: 1,
            }
          : {}
      }
      transition={{
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * CountUp - Animates numbers counting up
 */
export const CountUp: FC<{
  end: number;
  duration?: number;
  className?: string;
}> = ({ end, duration = 2, className = "" }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {count}
    </span>
  );
};

export default ScrollReveal;
