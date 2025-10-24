"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

interface AnimatedCardProps {
  children: ReactNode;
  hover?: boolean;
  delay?: number;
  className?: string;
  onClick?: () => void;
}

interface StaggeredListProps {
  children: ReactNode;
  className?: string;
}

interface StaggeredItemProps {
  children: ReactNode;
  index?: number;
  className?: string;
}

interface AnimatedBadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  pulse?: boolean;
  className?: string;
}

interface AnimatedPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

// Enhanced Button with micro-interactions
export const AnimatedButton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  ...props
}: AnimatedButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-indigo-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      type={props.type}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
        />
      )}
      {children}
    </motion.button>
  );
};

// Animated Card Component
export const AnimatedCard = ({
  children,
  hover = true,
  delay = 0,
  className = "",
  onClick,
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={
        hover
          ? {
              y: -5,
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }
          : {}
      }
      className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

interface FloatingActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
}

// Floating Action Button
export const FloatingActionButton = ({
  children,
  onClick,
  position = "bottom-right",
  className = "",
}: FloatingActionButtonProps) => {
  const positions: Record<
    FloatingActionButtonProps["position"] & string,
    string
  > = {
    "bottom-right": "fixed bottom-6 right-6",
    "bottom-left": "fixed bottom-6 left-6",
    "top-right": "fixed top-6 right-6",
    "top-left": "fixed top-6 left-6",
  };

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        ${positions[position]}
        z-50 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white
        rounded-full shadow-lg hover:shadow-xl
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

interface AnimatedInputProps {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  placeholder?: string;
  type?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Animated Input with focus effects
export const AnimatedInput = ({
  label,
  error,
  icon: Icon,
  className = "",
  ...props
}: AnimatedInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative ${className}`}
    >
      {label && (
        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </motion.label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <motion.input
          whileFocus={{
            scale: 1.01,
            borderColor: "#6366f1",
          }}
          className={`
            block w-full px-3 py-2 border border-gray-300 rounded-md
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            transition-all duration-200
            ${Icon ? "pl-10" : ""}
            ${error ? "border-red-300 focus:ring-red-500" : ""}
          `}
          placeholder={props.placeholder}
          type={props.type}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

// Staggered List Animation
export const StaggeredList = ({
  children,
  className = "",
}: StaggeredListProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredItem = ({
  children,
  className = "",
}: Omit<StaggeredItemProps, "index">) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut",
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated Badge
export const AnimatedBadge = ({
  children,
  variant = "default",
  pulse = false,
  className = "",
}: AnimatedBadgeProps) => {
  const variants: Record<AnimatedBadgeProps["variant"] & string, string> = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variants[variant]}
        ${pulse ? "animate-pulse" : ""}
        ${className}
      `}
    >
      {children}
    </motion.span>
  );
};

// Page Header with animation
export const AnimatedPageHeader = ({
  title,
  subtitle,
  action,
  className = "",
}: AnimatedPageHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`flex items-center justify-between mb-8 ${className}`}
    >
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-gray-900"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mt-2"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};
