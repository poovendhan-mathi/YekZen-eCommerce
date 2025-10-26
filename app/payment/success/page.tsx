// Goal: Payment success page with detailed invoice, GST/tax breakdown, and print functionality
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  CheckCircleIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  PrinterIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Button from "../../../components/ui/Button";
import { formatCurrency } from "../../../lib/utils/currency";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  orderId: string;
  subtotal: number;
  tax: number;
  gst: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  estimatedDelivery: string;
  orderDate: string;
}

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");

  const handlePrint = () => {
    window.print();
  };

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
            
            // Determine currency based on payment method
            const paymentCurrency = method === "stripe" ? "USD" : "INR";
            
            // Calculate subtotal from items
            const itemsSubtotal = order.items.reduce(
              (sum: number, item: any) => sum + item.price * item.quantity,
              0
            );
            
            // Calculate taxes and fees (realistic breakdown)
            const gstRate = paymentCurrency === "INR" ? 0.18 : 0; // 18% GST for India
            const taxRate = paymentCurrency === "USD" ? 0.08 : 0; // 8% tax for US
            const shippingCost = paymentCurrency === "INR" ? 50 : 5; // Flat shipping
            const discount = 0; // No discount for now
            
            const gst = gstRate * itemsSubtotal;
            const tax = taxRate * itemsSubtotal;
            const total = itemsSubtotal + gst + tax + shippingCost - discount;
            
            setOrderDetails({
              orderId: order.id,
              subtotal: itemsSubtotal,
              tax: tax,
              gst: gst,
              shipping: shippingCost,
              discount: discount,
              total: total,
              currency: paymentCurrency,
              paymentMethod: order.paymentMethod,
              items: order.items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              shippingAddress: {
                name: order.customerInfo?.name || "Customer",
                address: order.customerInfo?.address || "Address not provided",
                city: order.customerInfo?.city || "",
                postalCode: order.customerInfo?.postalCode || "",
                country: order.customerInfo?.country || "",
              },
              estimatedDelivery: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
              ).toLocaleDateString(),
              orderDate: new Date().toLocaleDateString(),
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 print:bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Print Button - Hidden on print */}
        <div className="flex justify-end mb-4 print:hidden">
          <Button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700"
          >
            <PrinterIcon className="w-5 h-5" />
            <span>Print Invoice</span>
          </Button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Success Icon - Hidden on print */}
          <motion.div variants={itemVariants} className="mb-8 print:hidden">
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

          {/* Invoice - Main Content */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-left print:shadow-none"
          >
            {/* Invoice Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    INVOICE
                  </h2>
                  <p className="text-gray-600">Order #{orderDetails.orderId}</p>
                  <p className="text-sm text-gray-500">Date: {orderDetails.orderDate}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold text-gray-900">YekZen eCommerce</h3>
                  <p className="text-sm text-gray-600">123 Business Street</p>
                  <p className="text-sm text-gray-600">Tech City, TC 12345</p>
                  <p className="text-sm text-gray-600">GST: 29ABCDE1234F1Z5</p>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Bill To:</h3>
              <p className="text-gray-700 font-medium">{orderDetails.shippingAddress.name}</p>
              <p className="text-gray-600">{orderDetails.shippingAddress.address}</p>
              <p className="text-gray-600">
                {orderDetails.shippingAddress.city} {orderDetails.shippingAddress.postalCode}
              </p>
              <p className="text-gray-600">{orderDetails.shippingAddress.country}</p>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orderDetails.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 text-right">
                        {formatCurrency(item.price, orderDetails.currency)}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(
                          item.price * item.quantity,
                          orderDetails.currency
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-3 max-w-sm ml-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(orderDetails.subtotal, orderDetails.currency)}
                  </span>
                </div>
                
                {orderDetails.gst > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(orderDetails.gst, orderDetails.currency)}
                    </span>
                  </div>
                )}
                
                {orderDetails.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%):</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(orderDetails.tax, orderDetails.currency)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(orderDetails.shipping, orderDetails.currency)}
                  </span>
                </div>
                
                {orderDetails.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span className="font-medium">
                      -{formatCurrency(orderDetails.discount, orderDetails.currency)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-gray-900">
                    {formatCurrency(orderDetails.total, orderDetails.currency)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm bg-green-50 p-3 rounded-lg">
                  <span className="text-green-800 font-medium">Payment Status:</span>
                  <span className="text-green-800 font-bold">PAID</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900">
                    {orderDetails.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Estimated Delivery</h3>
                  <p className="text-gray-600">{orderDetails.estimatedDelivery}</p>
                </div>
                <DocumentTextIcon className="w-12 h-12 text-gray-300" />
              </div>
            </div>
          </motion.div>

          {/* Action Buttons - Hidden on print */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center print:hidden"
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
