"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import { ordersService } from "../../../services/orders.service";
import toast from "react-hot-toast";
import {
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Button from "../../../components/ui/Button";

interface Customer {
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to access admin panel");
      router.push(
        "/signin?returnUrl=" + encodeURIComponent("/admin/customers")
      );
      return;
    }

    if (user.email !== "admin@yekzen.com") {
      toast.error("Access denied. Admin privileges required.");
      router.push("/");
      return;
    }

    async function fetchCustomers() {
      try {
        const {
          success,
          orders: allOrders,
          error,
        } = await ordersService.getAllOrders();

        if (!success || !allOrders) {
          toast.error(error || "Failed to load customers");
          setLoading(false);
          return;
        }

        // Group orders by customer email
        const customerMap: { [email: string]: Customer } = {};

        allOrders.forEach((order: any) => {
          const email = order.customerInfo?.email || "unknown@example.com";

          if (!customerMap[email]) {
            customerMap[email] = {
              name: order.customerInfo?.name || "Unknown Customer",
              email: email,
              phone: order.customerInfo?.phone || "N/A",
              totalOrders: 0,
              totalSpent: 0,
              lastOrderDate: order.createdAt || new Date().toISOString(),
            };
          }

          customerMap[email].totalOrders += 1;
          customerMap[email].totalSpent += order.totalAmount || 0;

          // Update last order date if this order is more recent
          if (
            new Date(order.createdAt) >
            new Date(customerMap[email].lastOrderDate)
          ) {
            customerMap[email].lastOrderDate = order.createdAt;
          }
        });

        // Convert to array and sort by total spent
        const customersArray = Object.values(customerMap).sort(
          (a, b) => b.totalSpent - a.totalSpent
        );

        setCustomers(customersArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customers");
        setLoading(false);
      }
    }

    fetchCustomers();
  }, [user, router]);

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
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600 mt-2">
                Manage customer information and activity
              </p>
            </div>
          </div>

          {/* Customers Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {customers.length}
                  </p>
                </div>
                <UserGroupIcon className="w-12 h-12 text-indigo-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
                  </p>
                </div>
                <ShoppingBagIcon className="w-12 h-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    ₹
                    {customers
                      .reduce((sum, c) => sum + c.totalSpent, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <CurrencyDollarIcon className="w-12 h-12 text-green-600" />
              </div>
            </div>
          </div>

          {/* Customers List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {customers.length === 0 ? (
              <div className="p-12 text-center">
                <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No customers yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Customers will appear here once they make purchases
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Order
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer, index) => (
                      <motion.tr
                        key={customer.email}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                              {customer.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                              {customer.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <ShoppingBagIcon className="w-4 h-4 text-gray-400 mr-2" />
                            {customer.totalOrders} order(s)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm font-semibold text-gray-900">
                            <CurrencyDollarIcon className="w-4 h-4 text-gray-400 mr-1" />
                            ₹{customer.totalSpent.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(
                            customer.lastOrderDate
                          ).toLocaleDateString()}
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
