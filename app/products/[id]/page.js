"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/24/solid";
import Button from "../../../components/ui/Button";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock product data - in real app, fetch from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockProduct = {
        id: parseInt(params.id),
        name: "Premium Wireless Headphones",
        description:
          "Experience crystal-clear audio with these premium wireless headphones featuring active noise cancellation and 30-hour battery life.",
        price: 129.99,
        originalPrice: 179.99,
        rating: 4.5,
        reviewCount: 234,
        category: "Electronics",
        brand: "TechPro",
        inStock: true,
        stockCount: 15,
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
          "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600",
        ],
        features: [
          "Active Noise Cancellation",
          "30-hour Battery Life",
          "Quick Charge (5min = 3hrs)",
          "Premium Comfort Padding",
          "Wireless & Wired Connection",
          "Built-in Microphone",
        ],
        specifications: {
          "Driver Size": "40mm",
          "Frequency Response": "20Hz - 20kHz",
          Impedance: "32 Ohm",
          Weight: "250g",
          Connectivity: "Bluetooth 5.0, 3.5mm",
          Charging: "USB-C",
        },
        shipping: {
          free: true,
          estimatedDays: "2-3 business days",
          returnPolicy: "30-day return policy",
        },
      };

      const mockReviews = [
        {
          id: 1,
          user: "Sarah Johnson",
          rating: 5,
          date: "2024-01-15",
          comment:
            "Absolutely fantastic headphones! The sound quality is incredible and the noise cancellation works perfectly.",
          verified: true,
        },
        {
          id: 2,
          user: "Mike Chen",
          rating: 4,
          date: "2024-01-10",
          comment:
            "Great value for money. Comfortable for long listening sessions.",
          verified: true,
        },
        {
          id: 3,
          user: "Emma Davis",
          rating: 5,
          date: "2024-01-08",
          comment:
            "Love these! Perfect for work and travel. Battery life is amazing.",
          verified: false,
        },
      ];

      setProduct(mockProduct);
      setReviews(mockReviews);
      setLoading(false);
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;

    // In real app, add to cart context
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
    };

    // Store in localStorage for now
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <Button onClick={() => router.push("/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-8">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-indigo-600 ring-2 ring-indigo-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Basic Info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-indigo-600 font-medium">
                  {product.brand}
                </span>
                <button
                  onClick={handleWishlist}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {isWishlisted ? (
                    <HeartIconSolid className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice > product.price && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`font-medium ${
                  product.inStock ? "text-green-700" : "text-red-700"
                }`}
              >
                {product.inStock
                  ? `In Stock (${product.stockCount} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            {product.inStock && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stockCount, quantity + 1))
                      }
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 text-lg font-semibold"
                  >
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => router.push("/checkout")}
                    variant="secondary"
                    className="px-8 py-4 text-lg font-semibold"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            )}

            {/* Shipping Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <TruckIcon className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-medium text-green-800">
                    {product.shipping.free
                      ? "Free Shipping"
                      : "Shipping Available"}
                  </div>
                  <div className="text-sm text-green-600">
                    Estimated delivery: {product.shipping.estimatedDays}
                  </div>
                </div>
              </div>
            </div>

            {/* Return Policy */}
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <ShieldCheckIcon className="w-5 h-5" />
              <span>{product.shipping.returnPolicy}</span>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                <button className="border-b-2 border-indigo-600 text-indigo-600 py-4 px-1 text-sm font-medium">
                  Features
                </button>
                <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 py-4 px-1 text-sm font-medium">
                  Specifications
                </button>
                <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 py-4 px-1 text-sm font-medium">
                  Reviews ({product.reviewCount})
                </button>
              </nav>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
