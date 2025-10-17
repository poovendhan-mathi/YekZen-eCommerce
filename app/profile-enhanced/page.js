// Goal: Enhanced user profile page with account management and address book
"use client";

import { useState } from "react";
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
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AddressManager from "../../components/user/AddressManager";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Software developer passionate about technology and innovation.",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
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
    setFormData({
      displayName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      bio: "Software developer passionate about technology and innovation.",
    });
    setIsEditing(false);
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
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      {tab.label}
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
