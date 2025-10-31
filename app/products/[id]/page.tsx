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
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import Button from "../../../components/ui/Button";
import Price, { OriginalPrice, Discount } from "../../../components/ui/Price";
import ReviewModal from "../../../components/ui/ReviewModal";
import toast from "react-hot-toast";
import { useCart } from "../../../contexts/CartContext";
import { useAuth } from "../../../contexts/AuthContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  inStock: boolean;
  stockCount: number;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  shipping: {
    free: boolean;
    estimatedDays: string;
    returnPolicy: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("features");

  // Fetch product data from Firebase
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      try {
        const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
        const productId = rawId ?? "1";

        // Import Firebase service
        const { getProductById } = await import(
          "../../../firebase/productsService"
        );
        const result = await getProductById(productId);

        if (result.success && result.product) {
          const fbProduct = result.product;
          // Map Firebase product to component format
          const mappedProduct: Product = {
            id: parseInt(productId, 10),
            name: fbProduct.name,
            description: fbProduct.description || "No description available",
            price: fbProduct.price,
            originalPrice: fbProduct.originalPrice || fbProduct.price * 1.2,
            rating: fbProduct.rating || 4.5,
            reviewCount: Math.floor(Math.random() * 300) + 50,
            category: fbProduct.category,
            brand: fbProduct.brand || "Premium Brand",
            inStock: fbProduct.inStock !== false,
            stockCount: fbProduct.stock || 10,
            images:
              fbProduct.images && fbProduct.images.length > 0
                ? fbProduct.images
                : fbProduct.image
                ? [fbProduct.image]
                : [
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
                  ],
            features: [
              "Premium Quality",
              "Free Shipping",
              "30-Day Returns",
              "Warranty Included",
              "24/7 Customer Support",
            ],
            specifications: {
              Brand: fbProduct.brand || "Premium",
              Category: fbProduct.category,
              Stock: String(fbProduct.stock || 10),
              Rating: String(fbProduct.rating || 4.5),
            },
            shipping: {
              free: true,
              estimatedDays: "2-3 business days",
              returnPolicy: "30-day return policy",
            },
          };
          setProduct(mappedProduct);
        } else {
          toast.error("Product not found");
          router.push("/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product) return;

      setLoadingReviews(true);
      try {
        const { reviewsService } = await import(
          "../../../services/reviews.service"
        );
        const result = await reviewsService.getProductReviews(
          String(product.id)
        );

        if (result.success && result.reviews) {
          setReviews(result.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [product]);

  const handleRefreshReviews = async () => {
    if (!product) return;

    try {
      const { reviewsService } = await import(
        "../../../services/reviews.service"
      );
      const result = await reviewsService.getProductReviews(String(product.id));

      if (result.success && result.reviews) {
        setReviews(result.reviews);
        // Update product rating
        const avgRating =
          result.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          result.reviews.length;
        setProduct((prev) =>
          prev
            ? {
                ...prev,
                rating: avgRating,
                reviewCount: result.reviews!.length,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Error refreshing reviews:", error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Add to cart with specified quantity using CartContext
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      quantity: quantity, // Pass the actual quantity
    });

    toast.success(
      `Added ${quantity} ${quantity > 1 ? "items" : "item"} to cart`
    );
  };

  const handleBuyNow = () => {
    if (!product) return;

    // Add product to cart first
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      quantity: quantity,
    });

    // Then navigate to checkout
    router.push("/checkout");
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
                <Price
                  amount={product.price}
                  className="text-3xl font-bold text-gray-900"
                />
                {product.originalPrice > product.price && (
                  <OriginalPrice
                    amount={product.originalPrice}
                    className="text-xl text-gray-500"
                  />
                )}
                {product.originalPrice > product.price && (
                  <Discount
                    original={product.originalPrice}
                    current={product.price}
                  />
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
                    onClick={handleBuyNow}
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
                <button
                  onClick={() => setActiveTab("features")}
                  className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "features"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "specifications"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "reviews"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
              </nav>
            </div>

            {/* Features Tab */}
            {activeTab === "features" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(
                  ([key, value], index) => (
                    <div
                      key={index}
                      className="flex justify-between py-3 border-b border-gray-100"
                    >
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Write Review Button */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  {user ? (
                    <Button
                      onClick={() => setShowReviewModal(true)}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <StarIconSolid className="w-4 h-4 text-yellow-400" />
                      <span>Write a Review</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        toast.error("Please sign in to write a review");
                        router.push("/signin");
                      }}
                      variant="outline"
                    >
                      Sign in to Review
                    </Button>
                  )}
                </div>

                {/* Reviews List */}
                {loadingReviews ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <StarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No reviews yet</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Be the first to review this product!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 pb-6 last:border-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <StarIconSolid
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.verified && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  ✓ Verified Purchase
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-900">
                              {review.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              By {review.userName} •{" "}
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <button
                          onClick={async () => {
                            const { reviewsService } = await import(
                              "../../../services/reviews.service"
                            );
                            await reviewsService.markReviewHelpful(review.id);
                            handleRefreshReviews();
                          }}
                          className="flex items-center space-x-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                          <HandThumbUpIcon className="w-4 h-4" />
                          <span>Helpful ({review.helpful || 0})</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Review Modal */}
        {user && (
          <ReviewModal
            isOpen={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            productId={String(product.id)}
            productName={product.name}
            userId={user.uid}
            userName={user.displayName || user.email || "Anonymous"}
            userEmail={user.email || ""}
            onReviewSubmitted={handleRefreshReviews}
          />
        )}
      </div>
    </div>
  );
}
