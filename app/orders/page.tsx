// Goal: Enhanced user orders page with detailed order history and tracking
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBagIcon,
  CalendarIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowPathIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import Link from "next/link";

interface OrderItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
  address: string;
  method: string;
  tracking?: string;
  estimatedDelivery: string;
  deliveredDate?: string;
}

interface StatusHistoryItem {
  status: string;
  date: string;
  description: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  paymentMethod: string;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  statusHistory: StatusHistoryItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Mock orders data - in real app, fetch from API
  useEffect(() => {
    const mockOrders = [
      {
        id: "ORD-001",
        date: "2024-01-15",
        status: "delivered",
        total: 189.98,
        subtotal: 159.98,
        shipping: 9.99,
        tax: 20.01,
        paymentMethod: "Stripe",
        items: [
          {
            id: 1,
            name: "Wireless Headphones",
            description: "Premium noise-cancelling headphones",
            price: 129.99,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
          },
          {
            id: 2,
            name: "Phone Case",
            description: "Protective case for smartphones",
            price: 29.99,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1601593346740-925612772716?w=300",
          },
        ],
        shippingInfo: {
          address: "123 Main St, Apt 4B, New York, NY 10001",
          method: "Standard Shipping",
          tracking: "TR123456789",
          estimatedDelivery: "2024-01-18",
          deliveredDate: "2024-01-17",
        },
        statusHistory: [
          {
            status: "confirmed",
            date: "2024-01-15T10:00:00Z",
            description: "Order confirmed",
          },
          {
            status: "processing",
            date: "2024-01-15T14:00:00Z",
            description: "Processing payment",
          },
          {
            status: "shipped",
            date: "2024-01-16T09:00:00Z",
            description: "Package shipped",
          },
          {
            status: "delivered",
            date: "2024-01-17T15:30:00Z",
            description: "Package delivered",
          },
        ],
      },
      {
        id: "ORD-002",
        date: "2024-01-10",
        status: "shipped",
        total: 329.98,
        subtotal: 299.99,
        shipping: 15.99,
        tax: 14.0,
        paymentMethod: "Razorpay",
        items: [
          {
            id: 3,
            name: "Laptop Stand",
            description: "Adjustable aluminum laptop stand",
            price: 299.99,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300",
          },
        ],
        shippingInfo: {
          address: "456 Oak Ave, Suite 200, Los Angeles, CA 90210",
          method: "Express Shipping",
          tracking: "TR987654321",
          estimatedDelivery: "2024-01-12",
        },
        statusHistory: [
          {
            status: "confirmed",
            date: "2024-01-10T11:00:00Z",
            description: "Order confirmed",
          },
          {
            status: "processing",
            date: "2024-01-10T16:00:00Z",
            description: "Processing payment",
          },
          {
            status: "shipped",
            date: "2024-01-11T08:00:00Z",
            description: "Package shipped",
          },
        ],
      },
      {
        id: "ORD-003",
        date: "2024-01-08",
        status: "processing",
        total: 79.99,
        subtotal: 69.99,
        shipping: 5.99,
        tax: 4.01,
        paymentMethod: "Stripe",
        items: [
          {
            id: 4,
            name: "Wireless Mouse",
            description: "Ergonomic wireless mouse",
            price: 69.99,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300",
          },
        ],
        shippingInfo: {
          address: "789 Pine St, Miami, FL 33101",
          method: "Standard Shipping",
          estimatedDelivery: "2024-01-15",
        },
        statusHistory: [
          {
            status: "confirmed",
            date: "2024-01-08T13:00:00Z",
            description: "Order confirmed",
          },
          {
            status: "processing",
            date: "2024-01-08T17:00:00Z",
            description: "Processing payment",
          },
        ],
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders as Order[]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case "delivered":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "shipped":
        return <TruckIcon className="w-5 h-5 text-blue-500" />;
      case "processing":
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case "cancelled":
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const handleReorder = (order: Order): void => {
    // In real app, add items to cart and redirect to checkout
    const cartItems = order.items.map((item: OrderItem) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.location.href = "/checkout";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order History
              </h1>
              <p className="text-gray-600 mt-2">Track and manage your orders</p>
            </div>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm p-1 mb-8 inline-flex">
            {[
              { key: "all", label: "All Orders" },
              { key: "processing", label: "Processing" },
              { key: "shipped", label: "Shipped" },
              { key: "delivered", label: "Delivered" },
              { key: "cancelled", label: "Cancelled" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterStatus === filter.key
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {filter.label}
                {filter.key !== "all" && (
                  <span className="ml-2 text-xs">
                    ({orders.filter((o) => o.status === filter.key).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filterStatus === "all"
                  ? "No orders yet"
                  : `No ${filterStatus} orders`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === "all"
                  ? "When you place orders, they'll appear here."
                  : `You don't have any ${filterStatus} orders at the moment.`}
              </p>
              <Link href="/products">
                <Button>Start Shopping</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order {order.id}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">
                            {getStatusText(order.status)}
                          </span>
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Payment Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <CreditCardIcon className="w-4 h-4 mr-2" />
                          Payment
                        </h4>
                        <p className="text-sm text-gray-600">
                          {order.paymentMethod}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          Paid
                        </p>
                      </div>

                      {/* Shipping Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          Shipping
                        </h4>
                        <p className="text-sm text-gray-600">
                          {order.shippingInfo.method}
                        </p>
                        {order.shippingInfo.tracking && (
                          <p className="text-sm text-indigo-600 font-medium">
                            {order.shippingInfo.tracking}
                          </p>
                        )}
                      </div>

                      {/* Status Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <TruckIcon className="w-4 h-4 mr-2" />
                          Delivery
                        </h4>
                        {order.status === "delivered" &&
                        order.shippingInfo.deliveredDate ? (
                          <p className="text-sm text-green-600 font-medium">
                            Delivered{" "}
                            {new Date(
                              order.shippingInfo.deliveredDate
                            ).toLocaleDateString()}
                          </p>
                        ) : order.shippingInfo.estimatedDelivery ? (
                          <p className="text-sm text-gray-600">
                            Est.{" "}
                            {new Date(
                              order.shippingInfo.estimatedDelivery
                            ).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600">-</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Items ({order.items.length})
                    </h4>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4"
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              {item.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                              ${item.price.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setSelectedOrder(
                              selectedOrder === order.id ? null : order.id
                            )
                          }
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          {selectedOrder === order.id ? "Hide" : "View"} Details
                        </Button>
                        {order.status === "shipped" && (
                          <Button variant="secondary" size="sm">
                            <TruckIcon className="w-4 h-4 mr-1" />
                            Track Package
                          </Button>
                        )}
                        {order.status === "delivered" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleReorder(order)}
                          >
                            <ArrowPathIcon className="w-4 h-4 mr-1" />
                            Reorder
                          </Button>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Last updated:{" "}
                        {new Date(
                          order.statusHistory[order.statusHistory.length - 1]
                            ?.date || new Date()
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 bg-gray-50"
                    >
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Status History */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-4">
                              Order Timeline
                            </h5>
                            <div className="space-y-3">
                              {order.statusHistory.map((status, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start space-x-3"
                                >
                                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                                  <div>
                                    <p className="font-medium text-gray-900 capitalize">
                                      {status.status}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {status.description}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(status.date).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-4">
                              Shipping Address
                            </h5>
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <p className="text-gray-900">
                                {order.shippingInfo.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
