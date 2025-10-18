"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

// Animated status indicator
export const StatusIndicator = ({
  status = "loading",
  message = "",
  className = "",
  size = "md",
}) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const statusConfig = {
    loading: {
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      icon: null,
      animation: { rotate: 360 },
      transition: { duration: 1, repeat: Infinity, ease: "linear" },
    },
    success: {
      color: "text-green-500",
      bgColor: "bg-green-50",
      icon: CheckCircleIcon,
      animation: { scale: [0, 1.2, 1], rotate: [0, 10, 0] },
      transition: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] },
    },
    error: {
      color: "text-red-500",
      bgColor: "bg-red-50",
      icon: XCircleIcon,
      animation: { x: [-5, 5, -5, 5, 0], scale: [1, 1.1, 1] },
      transition: { duration: 0.5 },
    },
    warning: {
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      icon: ExclamationTriangleIcon,
      animation: { y: [-2, 2, -2, 2, 0] },
      transition: { duration: 0.4, repeat: 2 },
    },
    info: {
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      icon: InformationCircleIcon,
      animation: { scale: [0.9, 1.1, 1] },
      transition: { duration: 0.3 },
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.div
        className={`${sizes[size]} ${config.color} flex items-center justify-center`}
        animate={config.animation}
        transition={config.transition}
      >
        {status === "loading" ? (
          <motion.div
            className={`${sizes[size]} border-2 border-current border-t-transparent rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : Icon ? (
          <Icon className={sizes[size]} />
        ) : null}
      </motion.div>

      {message && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-sm font-medium ${config.color}`}
        >
          {message}
        </motion.span>
      )}
    </div>
  );
};

// Confetti animation for success states
export const ConfettiAnimation = ({ isVisible = false, duration = 3000 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isVisible) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        size: Math.random() * 6 + 3,
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2,
        },
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                left: particle.x,
                top: particle.y,
              }}
              initial={{
                y: -10,
                rotate: particle.rotation,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 10,
                x: particle.x + particle.velocity.x * 100,
                rotate: particle.rotation + 720,
                opacity: 0,
              }}
              transition={{
                duration: duration / 1000,
                ease: "easeIn",
              }}
              exit={{ opacity: 0 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// Progress indicator with animation
export const AnimatedProgressBar = ({
  progress = 0,
  status = "active",
  showPercentage = true,
  className = "",
}) => {
  const statusColors = {
    active: "from-blue-500 to-purple-600",
    success: "from-green-500 to-emerald-600",
    error: "from-red-500 to-pink-600",
    warning: "from-yellow-500 to-orange-600",
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <StatusIndicator status={status} size="sm" />
          {showPercentage && (
            <motion.span
              key={progress}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-sm font-medium text-gray-700"
            >
              {Math.round(progress)}%
            </motion.span>
          )}
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${statusColors[status]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>
    </div>
  );
};

// Notification toast with animations
export const AnimatedToast = ({
  message,
  type = "info",
  isVisible = false,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeConfig = {
    success: {
      bg: "bg-green-50 border-green-200",
      text: "text-green-800",
      icon: CheckCircleIcon,
    },
    error: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      icon: XCircleIcon,
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-200",
      text: "text-yellow-800",
      icon: ExclamationTriangleIcon,
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
      icon: InformationCircleIcon,
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className={`
            fixed top-4 right-4 z-50 max-w-sm w-full
            ${config.bg} ${config.text} 
            border rounded-lg shadow-lg p-4
          `}
        >
          <div className="flex items-start">
            <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-3 text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Checkmark animation
export const AnimatedCheckmark = ({
  isVisible = false,
  size = "md",
  color = "green",
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const colors = {
    green: "text-green-500",
    blue: "text-blue-500",
    purple: "text-purple-500",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className={`${sizes[size]} ${colors[color]} mx-auto`}
        >
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 6 9 17l-5-5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: "easeInOut",
              }}
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default {
  StatusIndicator,
  ConfettiAnimation,
  AnimatedProgressBar,
  AnimatedToast,
  AnimatedCheckmark,
};
