"use client";

import { motion, useDragControls, PanInfo } from "framer-motion";
import { useState, useRef } from "react";

// Swipeable Card component
export const SwipeableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();

  const handleDragEnd = (event, info) => {
    setIsDragging(false);

    if (info.offset.x > threshold && onSwipeRight) {
      onSwipeRight();
    } else if (info.offset.x < -threshold && onSwipeLeft) {
      onSwipeLeft();
    }
  };

  return (
    <motion.div
      className={`select-none ${className}`}
      drag="x"
      dragControls={dragControls}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      whileDrag={{
        scale: 0.95,
        rotate: isDragging ? 5 : 0,
        opacity: 0.8,
      }}
      animate={{
        x: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
};

// Pull to Refresh component
export const PullToRefresh = ({
  children,
  onRefresh,
  threshold = 80,
  className = "",
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef(null);

  const handleDrag = (event, info) => {
    const distance = Math.max(0, info.point.y);
    setPullDistance(distance);

    if (distance > threshold && !isPulling) {
      setIsPulling(true);
    }
  };

  const handleDragEnd = (event, info) => {
    if (pullDistance > threshold && onRefresh) {
      onRefresh();
    }

    setPullDistance(0);
    setIsPulling(false);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      {/* Pull to refresh indicator */}
      <motion.div
        className="flex items-center justify-center py-4"
        style={{
          height: Math.min(pullDistance, threshold),
          opacity: pullDistance / threshold,
        }}
      >
        <motion.div
          animate={{ rotate: isPulling ? 180 : 0 }}
          className="text-gray-500"
        >
          ↓ {isPulling ? "Release to refresh" : "Pull to refresh"}
        </motion.div>
      </motion.div>

      {children}
    </motion.div>
  );
};

// Long Press component
export const LongPress = ({
  children,
  onLongPress,
  duration = 500,
  className = "",
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef(null);

  const handlePressStart = () => {
    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      if (onLongPress) onLongPress();
    }, duration);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <motion.div
      className={`select-none ${className}`}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerLeave={handlePressEnd}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isPressed ? 1.02 : 1,
      }}
      transition={{ duration: 0.1 }}
    >
      {children}

      {/* Progress indicator for long press */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 border-2 border-blue-500 rounded"
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
};

// Pinch to Zoom component
export const PinchToZoom = ({
  children,
  minScale = 0.5,
  maxScale = 3,
  className = "",
}) => {
  const [scale, setScale] = useState(1);

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      style={{ scale }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onPinch={(event, info) => {
        const newScale = Math.min(
          Math.max(scale * info.scale, minScale),
          maxScale
        );
        setScale(newScale);
      }}
      whileDrag={{ cursor: "grabbing" }}
    >
      {children}
    </motion.div>
  );
};

// Drawer component with gesture support
export const GestureDrawer = ({
  isOpen,
  onClose,
  children,
  position = "bottom",
  className = "",
}) => {
  const positions = {
    bottom: { y: "100%" },
    top: { y: "-100%" },
    left: { x: "-100%" },
    right: { x: "100%" },
  };

  const dragConstraints = {
    bottom: { top: 0, bottom: 0 },
    top: { top: 0, bottom: 0 },
    left: { left: 0, right: 0 },
    right: { left: 0, right: 0 },
  };

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    let shouldClose = false;

    switch (position) {
      case "bottom":
        shouldClose = info.offset.y > threshold;
        break;
      case "top":
        shouldClose = info.offset.y < -threshold;
        break;
      case "left":
        shouldClose = info.offset.x < -threshold;
        break;
      case "right":
        shouldClose = info.offset.x > threshold;
        break;
    }

    if (shouldClose && onClose) {
      onClose();
    }
  };

  return (
    <motion.div
      className={`fixed inset-0 z-50 ${className}`}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { opacity: 1 },
        closed: { opacity: 0 },
      }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black"
        variants={{
          open: { opacity: 0.5 },
          closed: { opacity: 0 },
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        className="absolute bg-white rounded-t-xl shadow-xl"
        variants={{
          open: { x: 0, y: 0 },
          closed: positions[position],
        }}
        drag={position === "bottom" || position === "top" ? "y" : "x"}
        dragConstraints={dragConstraints[position]}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default {
  SwipeableCard,
  PullToRefresh,
  LongPress,
  PinchToZoom,
  GestureDrawer,
};
