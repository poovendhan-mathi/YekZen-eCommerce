"use client";

import { motion, useDragControls } from "framer-motion";
import { useState, useRef, ReactNode } from "react";

interface DragInfo {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
}

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  className?: string;
}

// Swipeable Card component
export const SwipeableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  className = "",
}: SwipeableCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();

  const handleDragEnd = (_event: unknown, info: DragInfo) => {
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

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => void | Promise<void>;
  threshold?: number;
  className?: string;
}

// Pull to Refresh component
export const PullToRefresh = ({
  children,
  onRefresh,
  threshold = 80,
  className = "",
}: PullToRefreshProps) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (_event: unknown, info: DragInfo) => {
    const distance = Math.max(0, info.offset.y);
    setPullDistance(distance);

    if (distance > threshold && !isPulling) {
      setIsPulling(true);
    }
  };

  const handleDragEnd = (_event: unknown, _info: DragInfo) => {
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

interface LongPressProps {
  children: ReactNode;
  onLongPress?: () => void;
  duration?: number;
  className?: string;
}

// Long Press component
export const LongPress = ({
  children,
  onLongPress,
  duration = 500,
  className = "",
}: LongPressProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

interface PinchToZoomProps {
  children: ReactNode;
  minScale?: number;
  maxScale?: number;
  className?: string;
}

// Pinch to Zoom component (Note: onPinch not supported in framer-motion, this is a simplified version)
export const PinchToZoom = ({
  children,
  className = "",
}: Pick<PinchToZoomProps, "children" | "className">) => {
  const [scale, setScale] = useState(1);

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      style={{ scale }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileDrag={{ cursor: "grabbing" }}
      onWheel={(e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        const newScale = Math.min(Math.max(scale + delta, 0.5), 3);
        setScale(newScale);
      }}
    >
      {children}
    </motion.div>
  );
};

interface GestureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: "bottom" | "top" | "left" | "right";
  className?: string;
}

// Drawer component with gesture support
export const GestureDrawer = ({
  isOpen,
  onClose,
  children,
  position = "bottom",
  className = "",
}: GestureDrawerProps) => {
  type PositionType = GestureDrawerProps["position"] & string;

  const positions: Record<PositionType, { y?: string; x?: string }> = {
    bottom: { y: "100%" },
    top: { y: "-100%" },
    left: { x: "-100%" },
    right: { x: "100%" },
  };

  const dragConstraints: Record<
    PositionType,
    { top?: number; bottom?: number; left?: number; right?: number }
  > = {
    bottom: { top: 0, bottom: 0 },
    top: { top: 0, bottom: 0 },
    left: { left: 0, right: 0 },
    right: { left: 0, right: 0 },
  };

  const handleDragEnd = (_event: unknown, info: DragInfo) => {
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
