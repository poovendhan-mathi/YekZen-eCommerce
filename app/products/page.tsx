// Goal: Create products listing page with filtering and search
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "../../components/cards/ProductCard";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
} from "../../firebase/productsService";
import { Product } from "../../types/product.types";

interface ProductsGridProps {
  category: string;
  searchQuery: string;
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([{ id: "all", name: "All Products" }]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    // Get category from URL params
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch all products and build categories from actual data
  useEffect(() => {
    async function fetchCategoriesFromProducts() {
      try {
        const allProducts = await getAllProducts();
        const counts: Record<string, number> = { all: allProducts.length };
        const categoryMap = new Map<string, string>();

        // Extract unique categories from products
        allProducts.forEach((product) => {
          if (product.category) {
            // Capitalize category name properly
            const categoryName = product.category
              .split("-")
              .map(
                (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join(" ");
            categoryMap.set(product.category, categoryName);
            counts[product.category] = (counts[product.category] || 0) + 1;
          }
        });

        // Build categories array from actual data
        const categoriesFromDB = Array.from(categoryMap.entries()).map(
          ([id, name]) => ({ id, name })
        );

        // Sort alphabetically
        categoriesFromDB.sort((a, b) => a.name.localeCompare(b.name));

        // Add "All Products" at the beginning
        setCategories([
          { id: "all", name: "All Products" },
          ...categoriesFromDB,
        ]);
        setCategoryCounts(counts);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategoriesFromProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              All Products
            </h1>
            <p className="text-gray-600">
              Discover our complete collection of premium products
            </p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                    {categoryCounts[category.id] !== undefined &&
                      ` (${categoryCounts[category.id]})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Advanced Filters (Mobile) */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>All Prices</option>
                    <option>Under $50</option>
                    <option>$50 - $100</option>
                    <option>$100 - $500</option>
                    <option>Over $500</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>All Ratings</option>
                    <option>4+ Stars</option>
                    <option>3+ Stars</option>
                    <option>2+ Stars</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Products Grid - Now fetches from Firestore */}
        <ProductsGrid category={selectedCategory} searchQuery={searchQuery} />
      </div>
    </div>
  );
}

// Products Grid Component that fetches from Firestore
function ProductsGrid({ category, searchQuery }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all products once for counts
  useEffect(() => {
    async function fetchAllProducts() {
      try {
        await getAllProducts();
      } catch (err) {
        console.error("Error fetching all products:", err);
      }
    }
    fetchAllProducts();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        let fetchedProducts = [];

        if (searchQuery.trim()) {
          // Search products
          fetchedProducts = await searchProducts(searchQuery);
        } else if (category && category !== "all") {
          // Filter by category
          fetchedProducts = await getProductsByCategory(category);
        } else {
          // Get all products
          fetchedProducts = await getAllProducts();
        }

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, searchQuery]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No products found.{" "}
          {searchQuery ? `Try a different search.` : `Check back later!`}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 text-sm text-gray-600">
        Showing {products.length}{" "}
        {products.length === 1 ? "product" : "products"}
        {category && category !== "all" && ` in ${category}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}

// Wrap with Suspense for useSearchParams
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
