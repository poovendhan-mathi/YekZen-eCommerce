// Goal: Enhanced user profile page with account management and address book
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  PencilIcon,
  CheckIcon,
  CogIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AddressManager from "../../components/user/AddressManager";
import { useAuth } from "../../contexts/AuthContext";
import dbService from "../../services/database";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    bio: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/signin?returnUrl=" + encodeURIComponent("/profile"));
    }
  }, [user, router]);

  // Load user data and orders
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        bio: "",
      });

      try {
        // Try to load orders from localStorage first (for instant display)
        const cachedOrders = localStorage.getItem("yekzen-user-orders");
        if (cachedOrders) {
          setUserOrders(JSON.parse(cachedOrders));
        }

        // Then fetch fresh data from database
        const orders = await dbService.getUserOrders(user.uid);
        setUserOrders(orders);

        // Update cache
        localStorage.setItem("yekzen-user-orders", JSON.stringify(orders));
      } catch (error) {
        console.error("Error loading user orders:", error);
        toast.error("Failed to load order history");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user]);

  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBagIcon,
      count: userOrders.length,
    },
    { id: "addresses", label: "Addresses", icon: MapPinIcon },
    { id: "security", label: "Security", icon: ShieldCheckIcon },
    { id: "preferences", label: "Preferences", icon: CogIcon },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement profile update functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        bio: "",
      });
    }
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem("yekzen-user-orders");
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <CheckIcon className="w-4 h-4 mr-1" />
                ) : (
                  <PencilIcon className="w-4 h-4 mr-1" />
                )}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>

            {isEditing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <Input
                  label="Full Name"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {formData.displayName}
                    </h2>
                    <p className="text-gray-600">{formData.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Email
                        </p>
                        <p className="text-gray-900">{formData.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Phone
                        </p>
                        <p className="text-gray-900">{formData.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    About
                  </p>
                  <p className="text-gray-900">{formData.bio}</p>
                </div>
              </div>
            )}
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Order History
              </h3>
              <div className="text-sm text-gray-500">
                {userOrders.length} orders
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-lg p-4 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : userOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No orders yet
                </h4>
                <p className="text-gray-600 mb-4">
                  Start shopping to see your orders here.
                </p>
                <Button onClick={() => router.push("/products")}>
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Order #{order.id}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {order.createdAt
                            ? new Date(
                                order.createdAt.seconds * 1000
                              ).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          ${order.total?.toFixed(2) || "0.00"}
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status || "pending"}
                        </span>
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Items:
                        </p>
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm text-gray-600"
                            >
                              <span>
                                {item.name || "Product"} × {item.quantity || 1}
                              </span>
                              <span>
                                $
                                {(
                                  (item.price || 0) * (item.quantity || 1)
                                ).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{order.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/orders/${order.id}`)}
                      >
                        View Details
                      </Button>
                      {order.status === "completed" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            // Implement reorder functionality
                            toast.success("Items added to cart");
                          }}
                        >
                          Reorder
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case "addresses":
        return <AddressManager />;

      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Security Settings
            </h3>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Password</h4>
                <p className="text-gray-600 mb-4">Last changed 3 months ago</p>
                <Button variant="secondary">Change Password</Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Two-Factor Authentication
                </h4>
                <p className="text-gray-600 mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="secondary">Enable 2FA</Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Login Sessions
                </h4>
                <p className="text-gray-600 mb-4">
                  Manage your active sessions
                </p>
                <Button variant="secondary">View Sessions</Button>
              </div>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Email Notifications
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 mr-3"
                      defaultChecked
                    />
                    <span className="text-gray-700">Order updates</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 mr-3"
                      defaultChecked
                    />
                    <span className="text-gray-700">Promotional emails</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 mr-3"
                    />
                    <span className="text-gray-700">Newsletter</span>
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Language & Region
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Account Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your profile and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                        {tab.count !== undefined && tab.count > 0 && (
                          <span className="ml-1 bg-indigo-100 text-indigo-600 text-xs rounded-full px-2 py-1">
                            {tab.count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
