// Goal: Payment cancellation page with retry options
"use client";

import { motion } from "framer-motion";
import {
  XCircleIcon,
  ArrowLeftIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Button from "../../../components/ui/Button";

const PaymentCancelPage = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Cancel Icon */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircleIcon className="w-12 h-12 text-red-600" />
            </div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Payment Cancelled
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-gray-600">
              Your payment was cancelled. No charges were made to your account.
            </motion.p>
          </motion.div>

          {/* Information Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-left max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What happened?
            </h2>

            <div className="space-y-4 text-gray-600">
              <p>
                Your payment process was interrupted or cancelled. This can
                happen for several reasons:
              </p>

              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  You clicked the back button or closed the payment window
                </li>
                <li>The payment session timed out</li>
                <li>There was a technical issue with the payment processor</li>
                <li>You decided not to complete the purchase</li>
              </ul>

              <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <p className="text-blue-800">
                  <strong>Good news:</strong> Your cart items are still saved
                  and ready for checkout whenever you're ready to complete your
                  purchase.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link href="/cart">
              <Button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700">
                <CreditCardIcon className="w-5 h-5" />
                <span>Return to Cart & Retry Payment</span>
              </Button>
            </Link>

            <Link href="/products">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Continue Shopping</span>
              </Button>
            </Link>
          </motion.div>

          {/* Help Section */}
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Payment Issues
                  </h4>
                  <p className="text-gray-600 mb-3">
                    If you're experiencing payment problems, try:
                  </p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Using a different payment method</li>
                    <li>• Checking your internet connection</li>
                    <li>• Clearing your browser cache</li>
                    <li>• Trying a different browser</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Contact Support
                  </h4>
                  <p className="text-gray-600 mb-3">
                    Still having trouble? We're here to help:
                  </p>
                  <div className="text-gray-600 space-y-1">
                    <p>📧 support@yekzen.com</p>
                    <p>📞 1-800-YEKZEN-1</p>
                    <p>💬 Live chat available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Note */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-sm text-gray-500"
          >
            <p>
              🔒 Your payment information is secure and encrypted. No payment
              details are stored on our servers.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
