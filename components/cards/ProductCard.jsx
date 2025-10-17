// Goal: Display mock products in animated card grid using TailwindCSS and Framer Motion
"use client";

import { motion } from "framer-motion";
import {
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Button from "../ui/Button";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../contexts/CartContext";

const ProductCard = ({ product, index = 0 }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        <Link href={`/products/${product.id}`}>
          <motion.div
            variants={imageVariants}
            whileHover="hover"
            className="w-full h-full"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold"
          >
            -{discount}%
          </motion.div>
        )}

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg"
        >
          {isWishlisted ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
          )}
        </motion.button>

        {/* Quick Actions Overlay */}
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
          className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
        >
          <div className="flex space-x-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Button size="sm" className="shadow-lg" onClick={handleAddToCart}>
                <ShoppingCartIcon className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href={`/product/${product.id}`}>
                <Button variant="secondary" size="sm" className="shadow-lg">
                  Quick View
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
            <span className="text-white font-semibold bg-gray-800 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.brand}
          </span>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {product.stockCount <= 5 && product.inStock && (
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Only {product.stockCount} left
            </span>
          )}
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
              {product.features.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{product.features.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="w-full"
            disabled={!product.inStock}
            variant={product.inStock ? "primary" : "secondary"}
            onClick={handleAddToCart}
          >
            {product.inStock ? (
              <>
                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            ) : (
              "Out of Stock"
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
