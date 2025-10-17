"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import Input from "../ui/Input";

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDefault = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl border-2 transition-all ${
        isDefault
          ? "border-indigo-200 bg-indigo-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <MapPinIcon
            className={`w-5 h-5 mt-1 ${
              isDefault ? "text-indigo-600" : "text-gray-400"
            }`}
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-medium text-gray-900">{address.label}</h3>
              {isDefault && (
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
                  Default
                </span>
              )}
            </div>
            <p className="text-gray-700">{address.name}</p>
            <p className="text-gray-600">{address.street}</p>
            <p className="text-gray-600">
              {address.city}, {address.state} {address.zipCode}
            </p>
            <p className="text-gray-600">{address.country}</p>
            {address.phone && (
              <p className="text-gray-600 mt-1">Phone: {address.phone}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(address)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isDefault && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSetDefault(address.id)}
          >
            <CheckIcon className="w-4 h-4 mr-1" />
            Set as Default
          </Button>
        </div>
      )}
    </motion.div>
  );
};

const AddressForm = ({ address, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    label: "",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    isDefault: false,
    ...address,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: address?.id || Date.now(),
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="bg-gray-50 rounded-xl p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-900">
        {address ? "Edit Address" : "Add New Address"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Address Label"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="e.g., Home, Work, etc."
            required
          />
        </div>

        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <Input
            label="Street Address"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <Input
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        />

        <Input
          label="ZIP Code"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="India">India</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isDefault"
          id="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
          Set as default address
        </label>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit">
          {address ? "Update Address" : "Save Address"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </motion.form>
  );
};

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Mock addresses data
  useEffect(() => {
    const mockAddresses = [
      {
        id: 1,
        label: "Home",
        name: "John Doe",
        street: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
        phone: "+1 (555) 123-4567",
        isDefault: true,
      },
      {
        id: 2,
        label: "Work",
        name: "John Doe",
        street: "456 Corporate Blvd, Suite 200",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        country: "United States",
        phone: "+1 (555) 987-6543",
        isDefault: false,
      },
    ];

    setAddresses(mockAddresses);
  }, []);

  const handleSaveAddress = (addressData) => {
    if (editingAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === addressData.id ? addressData : addr))
      );
    } else {
      // Add new address
      setAddresses((prev) => [...prev, addressData]);
    }

    // If this is set as default, update others
    if (addressData.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressData.id,
        }))
      );
    }

    setShowForm(false);
    setEditingAddress(null);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    }
  };

  const handleSetDefault = (addressId) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const defaultAddress = addresses.find((addr) => addr.isDefault);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Address Book</h2>
          <p className="text-gray-600 mt-1">Manage your shipping addresses</p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Address
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <AddressForm
          address={editingAddress}
          onSave={handleSaveAddress}
          onCancel={handleCancelForm}
        />
      )}

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPinIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No addresses yet
          </h3>
          <p className="text-gray-600 mb-6">
            Add your first shipping address to get started
          </p>
          <Button onClick={() => setShowForm(true)}>
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Default address first */}
          {defaultAddress && (
            <AddressCard
              address={defaultAddress}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefault}
              isDefault={true}
            />
          )}

          {/* Other addresses */}
          {addresses
            .filter((addr) => !addr.isDefault)
            .map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefault}
                isDefault={false}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default AddressManager;
