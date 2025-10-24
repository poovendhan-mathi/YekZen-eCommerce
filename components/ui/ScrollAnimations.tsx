"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

// Type definitions
interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

interface ParallaxContainerProps {
  children: ReactNode;
  offset?: number;
}

interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
}

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

interface FloatingElementProps {
  children: ReactNode;
  intensity?: number;
  duration?: number;
}

interface MagneticElementProps {
  children: ReactNode;
  strength?: number;
}

interface EnhancedRevealTextProps {
  text: string;
  className?: string;
}

interface MorphingShapeProps {
  className?: string;
}

// Scroll-triggered fade in animation
export const FadeInOnScroll = ({
  children,
  className = "",
  delay = 0,
}: FadeInOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered children animation
export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
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

// Individual stagger item
export const StaggerItem = ({ children, className = "" }: StaggerItemProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.21, 1.11, 0.81, 0.99],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax scroll effect
export const ParallaxContainer = ({
  children,
  offset = 50,
}: ParallaxContainerProps) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);

  return <motion.div style={{ y }}>{children}</motion.div>;
};

// Scale on scroll
export const ScaleOnScroll = ({
  children,
  className = "",
}: ScaleOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
};

// Reveal text animation
export const RevealText = ({
  text,
  className = "",
  delay = 0,
}: RevealTextProps) => {
  const words = text.split(" ");

  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.1,
            ease: [0.21, 1.11, 0.81, 0.99],
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

// Floating animation
export const FloatingElement = ({
  children,
  intensity = 10,
  duration = 3,
}: FloatingElementProps) => {
  return (
    <motion.div
      animate={{
        y: [0, -intensity, 0],
        x: [0, intensity / 2, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic effect (follows cursor)
export const MagneticElement = ({
  children,
  strength = 0.3,
}: MagneticElementProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    ref.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.2s ease-out" }}
    >
      {children}
    </div>
  );
};

// Scroll progress indicator
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transform origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

// Enhanced reveal text with better animation
export const EnhancedRevealText = ({
  text,
  className = "",
}: EnhancedRevealTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words = text.split(" ");

  return (
    <motion.div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, rotateX: 90 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, rotateX: 0 }
              : { opacity: 0, y: 20, rotateX: 90 }
          }
          transition={{
            duration: 0.6,
            delay: index * 0.08,
            ease: [0.21, 1.11, 0.81, 0.99],
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Morphing shapes
export const MorphingShape = ({ className = "" }: MorphingShapeProps) => {
  return (
    <motion.div
      className={`w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 ${className}`}
      animate={{
        borderRadius: ["20%", "50%", "20%"],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};
