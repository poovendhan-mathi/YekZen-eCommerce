"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import { ordersService } from "../../../services/orders.service";
import toast from "react-hot-toast";
import {
  ShoppingBagIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

interface Order {
  id: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>(
    {}
  );
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to access admin panel");
      router.push("/signin?returnUrl=" + encodeURIComponent("/admin/orders"));
      return;
    }

    if (user.email !== "admin@yekzen.com") {
      toast.error("Access denied. Admin privileges required.");
      router.push("/");
      return;
    }

    async function fetchOrders() {
      try {
        const {
          success,
          orders: allOrders,
          error,
        } = await ordersService.getAllOrders();

        if (!success || !allOrders) {
          toast.error(error || "Failed to load orders");
          setLoading(false);
          return;
        }

        setOrders(allOrders as Order[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, router]);

  // Filter orders based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      const orderId = order.id.toLowerCase();
      const customerName = order.customerInfo?.name?.toLowerCase() || "";
      const customerEmail = order.customerInfo?.email?.toLowerCase() || "";

      return (
        orderId.includes(searchLower) ||
        customerName.includes(searchLower) ||
        customerEmail.includes(searchLower)
      );
    });

    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  ) => {
    setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));

    try {
      const result = await ordersService.updateOrderStatus(orderId, newStatus);

      if (result.success) {
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error(result.error || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin")}
                className="mb-4"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
              <p className="text-gray-600 mt-2">Manage all customer orders</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-96"
              />
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredOrders.length === 0 && searchTerm ? (
              <div className="p-12 text-center">
                <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No orders found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Try adjusting your search term
                </p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No orders yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Orders will appear here once customers make purchases
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.id.slice(0, 8)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.customerInfo?.name || "Unknown"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customerInfo?.email || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.items?.length || 0} item(s)
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.items?.[0]?.name || "N/A"}
                            {order.items?.length > 1 &&
                              ` +${order.items.length - 1} more`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm font-semibold text-gray-900">
                            <CurrencyDollarIcon className="w-4 h-4 text-gray-400 mr-1" />
                            ₹{order.totalAmount?.toFixed(2) || "0.00"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusUpdate(
                                order.id,
                                e.target.value as any
                              )
                            }
                            disabled={updatingStatus[order.id]}
                            className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border-2 transition-all ${getStatusColor(
                              order.status
                            )} ${
                              updatingStatus[order.id]
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer hover:shadow-md"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.paymentMethod || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="w-4 h-4 text-gray-400 mr-1" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
