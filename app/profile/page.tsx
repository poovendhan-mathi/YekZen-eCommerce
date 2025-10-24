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
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Software developer passionate about technology and innovation.",
    address: "123 Main St, City, State 12345",
  });

  // Mock user data
  const user = {
    displayName: "John Doe",
    email: "john.doe@example.com",
    metadata: { creationTime: new Date().toISOString() },
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      address: "123 Main St, City, State 12345",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                </span>
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">
                  {user?.displayName || "User"}
                </h1>
                <p className="text-purple-100 mt-2">{user?.email}</p>
                <p className="text-purple-100 text-sm">
                  Member since{" "}
                  {new Date(user?.metadata?.creationTime).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Profile Information
              </h2>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Button>
              ) : (
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSave}
                    className="flex items-center space-x-2"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>Save</span>
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Personal Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      {formData.displayName || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <p className="text-gray-900">{formData.email}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email address cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center">
                      <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg flex-1">
                        {formData.phone || "Not provided"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Address Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg min-h-[100px]">
                      {formData.address || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Account Actions
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Download Data</Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
