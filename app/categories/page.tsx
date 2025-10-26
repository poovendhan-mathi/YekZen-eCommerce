"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAllProducts } from "../../firebase/productsService";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getAllProducts();
        if (Array.isArray(result) && result.length > 0) {
          // Group products by category and count them
          const categoryMap = new Map<
            string,
            { count: number; products: any[] }
          >();

          result.forEach((product: any) => {
            const category = product.category || "Uncategorized";
            if (!categoryMap.has(category)) {
              categoryMap.set(category, { count: 0, products: [] });
            }
            const categoryData = categoryMap.get(category)!;
            categoryData.count++;
            categoryData.products.push(product);
          });

          // Convert to category objects
          const categoriesArray: Category[] = Array.from(
            categoryMap.entries()
          ).map(([name, data]) => ({
            id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            name: name,
            description: `Browse ${data.count} ${name.toLowerCase()} products`,
            image:
              data.products[0]?.image ||
              data.products[0]?.images?.[0] ||
              "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
            count: data.count,
          }));

          setCategories(categoriesArray.sort((a, b) => b.count - a.count));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of products organized by category. Find
            exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group block"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">
                      {category.count} products
                    </span>
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      View All →
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
