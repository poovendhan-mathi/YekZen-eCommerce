// Goal: Render products from database service as gradient animated cards using Framer Motion
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "../cards/ProductCard";
import dbService from "../../services/database";
import { Product } from "../../types/product.types";

interface MockProductGridProps {
  limit?: number;
  category?: string;
  searchQuery?: string;
}

const MockProductGrid: React.FC<MockProductGridProps> = ({
  limit,
  category,
  searchQuery,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        let allProducts = await dbService.getProducts();

        // Filter products based on category and search query
        let filteredProducts = allProducts;

        if (category && category !== "all") {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.category.toLowerCase() === category.toLowerCase()
          );
        }

        if (searchQuery) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply limit if specified
        const displayProducts = limit
          ? filteredProducts.slice(0, limit)
          : filteredProducts;

        setProducts(displayProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [limit, category, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 rounded-xl h-96 animate-pulse"
          ></div>
        ))}
      </motion.div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? `No products match "${searchQuery}". Try a different search term.`
              : `No products available in the ${category} category.`}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {category && category !== "all"
                ? `${
                    category.charAt(0).toUpperCase() + category.slice(1)
                  } Products`
                : "All Products"}
            </h2>
            <p className="text-gray-600 mt-1">
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Filter/Sort Options */}
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>

      {/* Load More Button (if limited) */}
      {limit && products.length >= limit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <button className="btn-primary">Load More Products</button>
        </motion.div>
      )}

      {/* Categories Quick Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Shop by Category
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {["All", "Audio", "Wearables", "Computers", "Gaming", "Cameras"].map(
            (cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  category === cat.toLowerCase() || (!category && cat === "All")
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {cat}
              </motion.button>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MockProductGrid;
