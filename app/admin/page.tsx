"use client";

import { useState, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  ChartBarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import { getAllProducts } from "../../firebase/productsService";
import { ordersService } from "../../services/orders.service";

// Types
type ColorType = "blue" | "green" | "yellow" | "red";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: FC<{ className?: string }>;
  color?: ColorType;
}

interface Order {
  id: string;
  customer: string;
  total: number;
  status: string;
  date: string;
}

interface Product {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  pendingOrders: number;
  totalProducts: number;
}

const StatCard: FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
}) => {
  const colorClasses: Record<ColorType, string> = {
    blue: "bg-blue-500 text-blue-700 bg-blue-50",
    green: "bg-green-500 text-green-700 bg-green-50",
    yellow: "bg-yellow-500 text-yellow-700 bg-yellow-50",
    red: "bg-red-500 text-red-700 bg-red-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                change.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}
            >
              {change} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color].split(" ")[2]}`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].split(" ")[1]}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  // Admin authentication check
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to access admin dashboard");
      router.push("/signin?returnUrl=" + encodeURIComponent("/admin"));
      return;
    }

    if (user.email !== "admin@yekzen.com") {
      toast.error("Access denied. Admin privileges required.");
      router.push("/");
      return;
    }
  }, [user, router]);

  // Fetch real data from Firebase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch products
        const allProducts = await getAllProducts();
        const productCount = allProducts.length;

        // Fetch orders and stats
        const { success: orderSuccess, orders: allOrders } =
          await ordersService.getAllOrders();
        const { success: statsSuccess, stats: orderStats } =
          await ordersService.getOrderStats();

        if (!orderSuccess || !statsSuccess) {
          toast.error("Failed to load some dashboard data");
        }

        // Set stats with real data
        const realStats = {
          totalOrders: orderStats?.totalOrders || 0,
          totalRevenue: orderStats?.totalRevenue || 0,
          totalUsers: 0, // TODO: Implement user count from Auth
          pendingOrders: orderStats?.pendingOrders || 0,
          totalProducts: productCount,
        };

        // Get recent orders (top 4)
        const recentOrders = (allOrders || []).slice(0, 4).map((order) => ({
          id: order.id,
          customer: order.customerInfo?.name || "Unknown",
          total: order.totalAmount || 0,
          status: order.status || "pending",
          date: order.createdAt || new Date().toISOString(),
        }));

        // Calculate top products from orders
        const productSales: {
          [key: string]: {
            name: string;
            sales: number;
            revenue: number;
            stock: number;
          };
        } = {};

        (allOrders || []).forEach((order) => {
          order.items?.forEach((item: any) => {
            const itemId = item.id;
            if (!productSales[itemId]) {
              productSales[itemId] = {
                name: item.name,
                sales: 0,
                revenue: 0,
                stock: 0,
              };
            }
            // TypeScript now knows productSales[itemId] exists
            productSales[itemId]!.sales += item.quantity;
            productSales[itemId]!.revenue += item.price * item.quantity;
          });
        });

        // Get stock info from products
        for (const productId in productSales) {
          const product = allProducts.find((p) => p.id === productId);
          if (product) {
            productSales[productId]!.stock = product.stock || 0;
          }
        }

        // Convert to array and sort by revenue
        const topProducts = Object.entries(productSales)
          .map(([id, data]) => ({ id: parseInt(id) || 0, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 4);

        setStats(realStats);
        setOrders(recentOrders);
        setProducts(topProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getOrderStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case "delivered":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "shipped":
        return <TruckIcon className="w-5 h-5 text-blue-500" />;
      case "processing":
        return <ChartBarIcon className="w-5 h-5 text-yellow-500" />;
      case "pending":
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      default:
        return <ChartBarIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getOrderStatusColor = (status: string): string => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
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
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor your eCommerce performance
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Orders"
              value={stats.totalOrders?.toLocaleString()}
              change="+12%"
              icon={ShoppingBagIcon}
              color="blue"
            />
            <StatCard
              title="Revenue"
              value={`$${stats.totalRevenue?.toLocaleString()}`}
              change="+8%"
              icon={CurrencyDollarIcon}
              color="green"
            />
            <StatCard
              title="Total Products"
              value={stats.totalProducts?.toLocaleString()}
              icon={CubeIcon}
              color="blue"
            />
            <StatCard
              title="Pending Orders"
              value={stats.pendingOrders}
              change="-3%"
              icon={ExclamationTriangleIcon}
              color="yellow"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Orders
                  </h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push("/admin/orders")}
                  >
                    View All
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-4">
                        {getOrderStatusIcon(order.status)}
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.customer}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${order.total}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Top Products
                  </h3>
                  <Button variant="secondary" size="sm">
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {product.sales} sales
                          </p>
                          <p className="text-xs text-gray-500">
                            Stock: {product.stock} units
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${product.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="justify-center"
                  onClick={() => router.push("/admin/products")}
                >
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Manage Products
                </Button>
                <Button
                  variant="outline"
                  className="justify-center"
                  onClick={() => router.push("/admin/orders")}
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  View All Orders
                </Button>
                <Button
                  variant="outline"
                  className="justify-center"
                  onClick={() => router.push("/admin/customers")}
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Manage Customers
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
