/**
 * Animation Showcase Page
 * Demonstrates all animation features while preserving the current UI
 */

"use client";

import { useState } from "react";
import {
  ScrollReveal,
  FadeInWhenVisible,
  Parallax,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/ScrollReveal";
import {
  AnimatedProductCard,
  ProductImageZoom,
  AddToCartAnimation,
} from "@/components/product/ProductAnimations";
import {
  InteractiveButton,
  MagneticButton,
  InteractiveCard,
  RippleEffect,
} from "@/components/ui/MicroInteractions";
import {
  LoadingSpinner,
  LoadingOverlay,
  ShimmerSkeleton,
  LoadingButton,
} from "@/components/ui/LoadingStates";
import { useOptimalAnimationSettings } from "@/lib/animationOptimizer";

export default function AnimationShowcase() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const settings = useOptimalAnimationSettings();

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsAdding(false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const demoProducts = [
    {
      id: 1,
      name: "Premium Headphones",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 399,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    },
    {
      id: 3,
      name: "Wireless Earbuds",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingOverlay
        isLoading={isLoading}
        message="Loading awesome animations..."
      />

      {/* Hero Section with Parallax */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-32">
        <Parallax offset={100}>
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal direction="down" delay={0.2}>
              <h1 className="text-6xl font-bold mb-6">🎨 Animation Showcase</h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.4}>
              <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                Experience smooth 60fps animations powered by Framer Motion 11.x
              </p>
              <p className="text-sm mt-4 text-indigo-200">
                Device Performance: {settings.performance.toUpperCase()} |
                Animations:{" "}
                {settings.shouldAnimate
                  ? "Enabled"
                  : "Disabled (Reduced Motion)"}
              </p>
            </ScrollReveal>
          </div>
        </Parallax>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-32">
        {/* Scroll Reveal Section */}
        <section>
          <FadeInWhenVisible>
            <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
              📜 Scroll Reveal Animations
            </h2>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ScrollReveal direction="up" delay={0}>
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="text-5xl mb-4">⬆️</div>
                <h3 className="text-xl font-semibold">From Bottom</h3>
                <p className="text-gray-600 mt-2">Slides up smoothly</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="down" delay={0.1}>
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="text-5xl mb-4">⬇️</div>
                <h3 className="text-xl font-semibold">From Top</h3>
                <p className="text-gray-600 mt-2">Slides down gracefully</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.2}>
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="text-5xl mb-4">⬅️</div>
                <h3 className="text-xl font-semibold">From Right</h3>
                <p className="text-gray-600 mt-2">Enters from right</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3}>
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="text-5xl mb-4">➡️</div>
                <h3 className="text-xl font-semibold">From Left</h3>
                <p className="text-gray-600 mt-2">Enters from left</p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Stagger Animation Section */}
        <section>
          <FadeInWhenVisible>
            <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
              ⚡ Stagger Animations
            </h2>
          </FadeInWhenVisible>

          <StaggerContainer staggerDelay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {demoProducts.map((product) => (
                <StaggerItem key={product.id}>
                  <AnimatedProductCard className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="aspect-square relative">
                      <ProductImageZoom
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-bold text-indigo-600">
                        ${product.price}
                      </p>
                    </div>
                  </AnimatedProductCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </section>

        {/* Micro Interactions Section */}
        <section className="bg-white rounded-3xl p-12 shadow-xl">
          <FadeInWhenVisible>
            <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
              ✨ Micro Interactions
            </h2>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={0}>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">
                  Interactive Button
                </h3>
                <InteractiveButton
                  variant="primary"
                  size="md"
                  onClick={() => console.log("Clicked!")}
                >
                  Hover & Click Me
                </InteractiveButton>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Magnetic Button</h3>
                <MagneticButton
                  className="bg-purple-600 text-white px-8 py-4 rounded-xl font-medium"
                  strength={0.3}
                  onClick={() => console.log("Magnetic!")}
                >
                  Follow Cursor
                </MagneticButton>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Ripple Effect</h3>
                <RippleEffect
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium inline-block cursor-pointer"
                  onClick={() => console.log("Ripple!")}
                >
                  Click for Ripple
                </RippleEffect>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 3D Card Tilt Section */}
        <section>
          <FadeInWhenVisible>
            <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
              🎴 3D Card Tilt
            </h2>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {demoProducts.map((product, index) => (
              <ScrollReveal key={product.id} direction="up" delay={index * 0.1}>
                <InteractiveCard className="bg-white rounded-2xl shadow-2xl p-6">
                  <div className="aspect-square bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl mb-4 flex items-center justify-center text-white text-6xl">
                    {index === 0 ? "🎧" : index === 1 ? "⌚" : "🎵"}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${product.price}
                  </p>
                </InteractiveCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Loading States Section */}
        <section className="bg-gray-900 rounded-3xl p-12 text-white">
          <FadeInWhenVisible>
            <h2 className="text-4xl font-bold mb-12 text-center">
              ⏳ Loading States
            </h2>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Spin Loader</h3>
              <div className="flex justify-center">
                <LoadingSpinner size="lg" color="white" variant="spin" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Dots Loader</h3>
              <div className="flex justify-center">
                <LoadingSpinner size="md" color="indigo" variant="dots" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Pulse Loader</h3>
              <div className="flex justify-center">
                <LoadingSpinner size="md" color="green" variant="pulse" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <LoadingButton
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 2000);
              }}
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-medium"
              variant="primary"
            >
              Test Loading Button
            </LoadingButton>

            <AddToCartAnimation
              onAdd={handleAddToCart}
              isAdding={isAdding}
              isAdded={isAdded}
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-medium"
            />
          </div>
        </section>

        {/* Shimmer Skeleton Section */}
        <section>
          <FadeInWhenVisible>
            <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
              💀 Skeleton Loading
            </h2>
          </FadeInWhenVisible>

          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <div className="flex gap-4 mb-6">
              <ShimmerSkeleton
                width="80px"
                height="80px"
                className="rounded-full"
              />
              <div className="flex-1 space-y-3">
                <ShimmerSkeleton width="60%" height="24px" />
                <ShimmerSkeleton width="40%" height="20px" />
              </div>
            </div>
            <ShimmerSkeleton width="100%" height="200px" className="mb-4" />
            <ShimmerSkeleton width="80%" height="16px" className="mb-2" />
            <ShimmerSkeleton width="90%" height="16px" />
          </div>
        </section>

        {/* Floating Element Section */}
        <section className="text-center py-16">
          <FadeInWhenVisible>
            <h2 className="text-4xl font-bold text-gray-800 mb-12">
              ✨ Scroll Animations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All elements on this page animate smoothly as you scroll. Try
              scrolling up and down to see the magic!
            </p>
          </FadeInWhenVisible>
        </section>

        {/* Performance Info */}
        <section className="bg-indigo-600 text-white rounded-3xl p-12 text-center">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold mb-6">
              🚀 Performance Optimized
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-5xl mb-2">60fps</div>
                <p className="text-indigo-200">Smooth Animations</p>
              </div>
              <div>
                <div className="text-5xl mb-2">🎯</div>
                <p className="text-indigo-200">GPU Accelerated</p>
              </div>
              <div>
                <div className="text-5xl mb-2">♿</div>
                <p className="text-indigo-200">Reduced Motion Support</p>
              </div>
            </div>
            <p className="mt-8 text-indigo-200">
              All animations automatically adjust based on your device
              performance
            </p>
          </FadeInWhenVisible>
        </section>
      </div>
    </div>
  );
}
