"use client";

import { motion } from "framer-motion";

const SkeletonBase = ({ className = "", ...props }) => (
  <motion.div
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    initial={{ opacity: 0.6 }}
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    {...props}
  />
);

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <SkeletonBase className="aspect-square w-full" />
    <div className="p-6 space-y-3">
      <SkeletonBase className="h-6 w-3/4" />
      <SkeletonBase className="h-4 w-1/2" />
      <div className="flex items-center justify-between">
        <SkeletonBase className="h-6 w-1/3" />
        <SkeletonBase className="h-8 w-20" />
      </div>
    </div>
  </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(count)].map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

// Order Card Skeleton
export const OrderCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <SkeletonBase className="h-6 w-24" />
          <SkeletonBase className="h-6 w-20 rounded-full" />
        </div>
        <div className="text-right space-y-2">
          <SkeletonBase className="h-6 w-16" />
          <SkeletonBase className="h-4 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <SkeletonBase className="h-4 w-16 mb-2" />
            <SkeletonBase className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>

    <div className="p-6">
      <SkeletonBase className="h-5 w-32 mb-4" />
      <div className="space-y-4">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <SkeletonBase className="w-16 h-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <SkeletonBase className="h-4 w-3/4" />
              <SkeletonBase className="h-3 w-1/2" />
            </div>
            <SkeletonBase className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// User Profile Skeleton
export const ProfileSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="border-b border-gray-200">
      <div className="flex -mb-px">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex-1 py-4 px-6 text-center">
            <SkeletonBase className="w-5 h-5 mx-auto mb-1" />
            <SkeletonBase className="h-4 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>

    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <SkeletonBase className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <SkeletonBase className="h-6 w-32" />
          <SkeletonBase className="h-4 w-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <SkeletonBase className="h-4 w-16 mb-2" />
            <SkeletonBase className="h-5 w-32" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Generic Content Skeleton
export const ContentSkeleton = ({ lines = 3, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    {[...Array(lines)].map((_, index) => (
      <SkeletonBase
        key={index}
        className={`h-4 ${index === lines - 1 ? "w-2/3" : "w-full"}`}
      />
    ))}
  </div>
);

// Page Loading Skeleton
export const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <SkeletonBase className="h-8 w-64 mb-2" />
        <SkeletonBase className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6">
              <SkeletonBase className="h-6 w-48 mb-4" />
              <ContentSkeleton lines={4} />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6">
            <SkeletonBase className="h-6 w-32 mb-4" />
            <ContentSkeleton lines={3} />
          </div>
          <div className="bg-white rounded-xl p-6">
            <SkeletonBase className="h-6 w-40 mb-4" />
            <ContentSkeleton lines={2} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonBase;
