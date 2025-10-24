/**
 * Enhanced Product Animations
 * Advanced animations specifically for product displays
 * Preserves current UI while adding premium product interactions
 */

"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useRef, ReactNode, FC, MouseEvent } from "react";
import Image from "next/image";

// Types
interface AnimatedProductCardProps {
  children: ReactNode;
  className?: string;
}

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

interface QuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * AnimatedProductCard - 3D tilt effect for product cards
 */
export const AnimatedProductCard: FC<AnimatedProductCardProps> = ({
  children,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) / (rect.width / 2));
    y.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          transform: "translateZ(30px)",
        }}
        animate={{
          boxShadow: isHovered
            ? "0 20px 50px rgba(0, 0, 0, 0.2)"
            : "0 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

/**
 * ProductImageZoom - Image zoom on hover
 */
export const ProductImageZoom: FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = "" }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        animate={{
          scale: isZoomed ? 1.5 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={600}
          height={600}
          className="w-full h-auto"
        />
      </motion.div>
    </div>
  );
};

/**
 * ProductImageGallery - Smooth gallery with slide animations
 */
export const ProductImageGallery: FC<ProductImageGalleryProps> = ({
  images,
  productName,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div className="relative overflow-hidden aspect-square">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute w-full h-full object-cover"
        />
      </motion.div>

      {/* Navigation buttons */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
      >
        ←
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
      >
        →
      </button>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-4 justify-center">
        {images.map((img, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
              index === currentIndex ? "border-indigo-500" : "border-gray-200"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

/**
 * AddToCartAnimation - Animated "Add to Cart" button
 */
export const AddToCartAnimation: FC<{
  onAdd: () => void;
  isAdding: boolean;
  isAdded: boolean;
  className?: string;
}> = ({ onAdd, isAdding, isAdded, className = "" }) => {
  return (
    <motion.button
      onClick={onAdd}
      disabled={isAdding}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        animate={{
          opacity: isAdded ? 0 : 1,
          y: isAdded ? -20 : 0,
        }}
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </motion.span>

      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isAdded ? 1 : 0,
          y: isAdded ? 0 : 20,
        }}
      >
        ✓ Added!
      </motion.span>
    </motion.button>
  );
};

/**
 * QuickView - Modal with smooth entrance animation
 */
export const QuickView: FC<QuickViewProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          ✕
        </button>
        {children}
      </motion.div>
    </>
  );
};

/**
 * PriceFlip - Animated price change
 */
export const PriceFlip: FC<{
  price: number;
  currency?: string;
  className?: string;
}> = ({ price, currency = "$", className = "" }) => {
  return (
    <motion.div
      key={price}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {currency}
      {price.toFixed(2)}
    </motion.div>
  );
};

export default {
  AnimatedProductCard,
  ProductImageZoom,
  ProductImageGallery,
  AddToCartAnimation,
  QuickView,
  PriceFlip,
};
