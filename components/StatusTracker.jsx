// Goal: Create implementation status tracker with real-time progress monitoring
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const StatusTracker = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const phases = [
    {
      id: 1,
      title: "Project Setup",
      description: "Initialize Next.js project with dependencies",
      tasks: [
        {
          id: "package-json",
          name: "Package.json configuration",
          status: "completed",
        },
        {
          id: "tailwind-setup",
          name: "Tailwind CSS setup",
          status: "completed",
        },
        {
          id: "firebase-config",
          name: "Firebase configuration",
          status: "completed",
        },
        { id: "mock-data", name: "Mock data creation", status: "completed" },
      ],
    },
    {
      id: 2,
      title: "Core Components",
      description: "Build layout and UI components",
      tasks: [
        { id: "layout-header", name: "Header component", status: "pending" },
        { id: "layout-footer", name: "Footer component", status: "pending" },
        {
          id: "product-card",
          name: "Product card component",
          status: "pending",
        },
        {
          id: "ui-components",
          name: "UI components (Button, Input)",
          status: "pending",
        },
      ],
    },
    {
      id: 3,
      title: "Pages & Routing",
      description: "Create main application pages",
      tasks: [
        { id: "home-page", name: "Home page", status: "pending" },
        { id: "product-page", name: "Product detail page", status: "pending" },
        { id: "cart-page", name: "Shopping cart page", status: "pending" },
        { id: "checkout-page", name: "Checkout page", status: "pending" },
      ],
    },
    {
      id: 4,
      title: "State Management",
      description: "Implement cart and user state",
      tasks: [
        {
          id: "cart-context",
          name: "Shopping cart context",
          status: "pending",
        },
        {
          id: "auth-context",
          name: "Authentication context",
          status: "pending",
        },
        {
          id: "local-storage",
          name: "Local storage integration",
          status: "pending",
        },
      ],
    },
    {
      id: 5,
      title: "Payment Integration",
      description: "Stripe and Razorpay payment systems",
      tasks: [
        { id: "stripe-setup", name: "Stripe integration", status: "pending" },
        {
          id: "razorpay-setup",
          name: "Razorpay integration",
          status: "pending",
        },
        { id: "mock-payments", name: "Mock payment flow", status: "pending" },
        { id: "payment-api", name: "Payment API routes", status: "pending" },
      ],
    },
    {
      id: 6,
      title: "Authentication",
      description: "Firebase Auth implementation",
      tasks: [
        { id: "auth-forms", name: "Login/Register forms", status: "pending" },
        { id: "auth-protection", name: "Route protection", status: "pending" },
        {
          id: "user-profile",
          name: "User profile management",
          status: "pending",
        },
      ],
    },
    {
      id: 7,
      title: "Animations & Polish",
      description: "Framer Motion animations and UI polish",
      tasks: [
        { id: "page-transitions", name: "Page transitions", status: "pending" },
        {
          id: "component-animations",
          name: "Component animations",
          status: "pending",
        },
        { id: "loading-states", name: "Loading states", status: "pending" },
        {
          id: "responsive-design",
          name: "Responsive design",
          status: "pending",
        },
      ],
    },
    {
      id: 8,
      title: "Testing & Deployment",
      description: "Final testing and deployment setup",
      tasks: [
        {
          id: "payment-testing",
          name: "Payment flow testing",
          status: "pending",
        },
        {
          id: "responsive-testing",
          name: "Responsive testing",
          status: "pending",
        },
        { id: "vercel-deploy", name: "Vercel deployment", status: "pending" },
        {
          id: "final-optimization",
          name: "Performance optimization",
          status: "pending",
        },
      ],
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ExclamationCircleIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-200";
      case "in-progress":
        return "bg-yellow-100 border-yellow-200";
      case "error":
        return "bg-red-100 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTotalProgress = () => {
    const allTasks = phases.flatMap((phase) => phase.tasks);
    const completedCount = allTasks.filter(
      (task) => task.status === "completed"
    ).length;
    return Math.round((completedCount / allTasks.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛍️ YekZen Implementation Tracker
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Premium eCommerce Web Application Development Status
          </p>

          {/* Overall Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{getTotalProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getTotalProgress()}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Phases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((phase, index) => {
            const completedTasks = phase.tasks.filter(
              (task) => task.status === "completed"
            ).length;
            const totalTasks = phase.tasks.length;
            const phaseProgress = Math.round(
              (completedTasks / totalTasks) * 100
            );
            const isActive = currentPhase === phase.id;

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-300 ${
                  isActive ? "border-blue-500 shadow-xl" : "border-gray-200"
                }`}
              >
                {/* Phase Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Phase {phase.id}
                    </h3>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        phaseProgress === 100
                          ? "bg-green-100 text-green-800"
                          : phaseProgress > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {phaseProgress}%
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    {phase.title}
                  </h4>
                  <p className="text-sm text-gray-600">{phase.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        phaseProgress === 100
                          ? "bg-green-500"
                          : phaseProgress > 0
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${phaseProgress}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + taskIndex * 0.05 }}
                      className={`flex items-center gap-2 p-2 rounded-lg border ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {getStatusIcon(task.status)}
                      <span className="text-sm font-medium text-gray-700">
                        {task.name}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Phase Status */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {completedTasks} of {totalTasks} tasks completed
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-700">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircleIcon className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-700">Error</span>
            </div>
            <div className="flex items-center gap-2">
              <ExclamationCircleIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-700">Pending</span>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">🚀 Tech Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Framework</div>
              <div className="opacity-90">Next.js 14</div>
            </div>
            <div>
              <div className="font-medium">Styling</div>
              <div className="opacity-90">Tailwind CSS</div>
            </div>
            <div>
              <div className="font-medium">Animation</div>
              <div className="opacity-90">Framer Motion</div>
            </div>
            <div>
              <div className="font-medium">Backend</div>
              <div className="opacity-90">Firebase</div>
            </div>
            <div>
              <div className="font-medium">Payments</div>
              <div className="opacity-90">Stripe + Razorpay</div>
            </div>
            <div>
              <div className="font-medium">Hosting</div>
              <div className="opacity-90">Vercel</div>
            </div>
            <div>
              <div className="font-medium">Images</div>
              <div className="opacity-90">Cloudinary</div>
            </div>
            <div>
              <div className="font-medium">Testing</div>
              <div className="opacity-90">Mock + Live</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatusTracker;
