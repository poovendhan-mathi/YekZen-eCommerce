// Goal: Payment success page with order confirmation and animations
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  CheckCircleIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Button from "../../../components/ui/Button";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
  };
  estimatedDelivery: string;
}

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          // Fetch real order from Firebase
          const { ordersService } = await import(
            "../../../services/orders.service"
          );
          const result = await ordersService.getOrderById(orderId);

          if (result.success && result.order) {
            const order = result.order;
            setOrderDetails({
              orderId: order.id,
              amount: order.totalAmount,
              currency: method === "stripe" ? "USD" : "INR",
              paymentMethod: order.paymentMethod,
              items: order.items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              shippingAddress: {
                name: order.customerInfo?.name || "Customer",
                address: order.customerInfo?.address || "Address on file",
              },
              estimatedDelivery: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
              ).toLocaleDateString(),
            });
          }
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId, method]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Payment Successful! 🎉
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </motion.p>
          </motion.div>

          {/* Order Details Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-left"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Order Details
              </h2>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                Confirmed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">
                      {orderDetails.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg">
                      {orderDetails.currency === "USD" ? "$" : "₹"}
                      {orderDetails.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-medium">
                      {orderDetails.estimatedDelivery}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Items Ordered
                </h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium">
                        {orderDetails.currency === "USD" ? "$" : "₹"}
                        {item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                Shipping Address
              </h3>
              <p className="text-gray-600">
                {orderDetails.shippingAddress.name}
                <br />
                {orderDetails.shippingAddress.address}
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/orders">
              <Button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700">
                <ShoppingBagIcon className="w-5 h-5" />
                <span>View All Orders</span>
              </Button>
            </Link>

            <Link href="/products">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Continue Shopping</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            variants={itemVariants}
            className="mt-12 p-6 bg-blue-50 rounded-xl"
          >
            <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <p>Order confirmation email sent</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <p>Item preparation & packaging</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <p>Shipment & delivery tracking</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
