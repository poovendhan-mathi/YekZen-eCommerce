// Goal: Create responsive cart page - temporarily simplified
"use client";

import { motion } from "framer-motion";
import { ArrowLeftIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import Link from "next/link";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h2>
        <p className="text-gray-600 mb-8">
          Cart functionality will be implemented in Phase 6 with complete state
          management.
        </p>
        <Link href="/products">
          <Button>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
