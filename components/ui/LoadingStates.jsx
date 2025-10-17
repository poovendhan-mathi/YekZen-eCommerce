"use client";

import { motion } from "framer-motion";

// Enhanced loading spinner with multiple variants
export const LoadingSpinner = ({
  size = "md",
  color = "indigo",
  variant = "spin",
  className = "",
}) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colors = {
    indigo: "border-indigo-500",
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    white: "border-white",
  };

  if (variant === "dots") {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${sizes[size]} bg-${color}-500 rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        className={`${sizes[size]} bg-${color}-500 rounded-full ${className}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
      />
    );
  }

  // Default spin variant
  return (
    <motion.div
      className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// Full page loading overlay
export const LoadingOverlay = ({ isLoading, message = "Loading..." }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-600 font-medium"
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Skeleton with shimmer effect
export const ShimmerSkeleton = ({ className = "", width, height }) => {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 rounded ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

// Button loading state
export const LoadingButton = ({
  children,
  isLoading,
  onClick,
  className = "",
  variant = "primary",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-indigo-500",
  };

  return (
    <motion.button
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${isLoading ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      onClick={isLoading ? undefined : onClick}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" color="white" className="mr-2" />}
      {children}
    </motion.button>
  );
};

// Progressive image loading with skeleton
export const ProgressiveImage = ({ src, alt, className = "", ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !isError && (
        <ShimmerSkeleton className="absolute inset-0" />
      )}

      {isError ? (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Failed to load</span>
        </div>
      ) : (
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          className="w-full h-full object-cover"
          {...props}
        />
      )}
    </div>
  );
};
