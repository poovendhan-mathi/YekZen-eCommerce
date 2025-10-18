"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

export const ScrollProgressBar = ({ color = "blue" }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const colorMap = {
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    green: "bg-green-600",
    red: "bg-red-600",
    gradient: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
  };

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 ${
        colorMap[color] || colorMap.blue
      } origin-left z-[100]`}
      style={{ scaleX }}
    />
  );
};

export const CircularScrollProgress = ({ size = 60 }) => {
  const { scrollYProgress } = useScroll();
  const circumference = 2 * Math.PI * (size / 2 - 5);

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 5}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="3"
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 5}
          stroke="url(#gradient)"
          strokeWidth="3"
          fill="transparent"
          strokeLinecap="round"
          style={{
            pathLength: scrollYProgress,
            strokeDasharray: circumference,
            strokeDashoffset: 0,
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: scrollYProgress }}
      >
        <motion.span className="text-xs font-semibold text-gray-700">
          {Math.round(scrollYProgress.get() * 100)}%
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export const ScrollToTop = ({ threshold = 300 }) => {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsVisible(latest > threshold);
    });
  }, [scrollY, threshold]);

  const handleScrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleScrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
