// Goal: Create responsive cart page with full functionality
"use client";

import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  ShoppingBagIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import Price from "../../components/ui/Price";
import Link from "next/link";
import { useCart } from "../../contexts/CartContext";
import Image from "next/image";

export default function CartPage() {
  const {
    items,
    getTotal,
    getSubtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const subtotal = getSubtotal();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some products to your cart to get started!
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {/* Quantity Badge */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                      {item.quantity}x
                    </span>
                  </div>
                  <Price
                    amount={item.price}
                    className="text-blue-600 font-bold"
                  />

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <Price
                    amount={item.price * item.quantity}
                    className="text-lg font-bold text-gray-900"
                  />
                </div>
              </motion.div>
            ))}

            {/* Clear Cart Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm font-medium mt-4"
            >
              Clear Cart
            </motion.button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <Price amount={subtotal} className="font-medium" />
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <Price amount={total} className="font-bold" />
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full mb-3">Proceed to Checkout</Button>
              </Link>

              <Link href="/products">
                <button className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Continue Shopping
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
