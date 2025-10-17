// Goal: Auth modal with smooth transitions between login/register forms
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const AuthModal = ({ isOpen, onClose, initialForm = "login" }) => {
  const [currentForm, setCurrentForm] = useState(initialForm);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleToggleForm = (formType) => {
    setCurrentForm(formType);
  };

  const handleClose = () => {
    setCurrentForm("login");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Form Container */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {currentForm === "login" && (
              <LoginForm
                key="login"
                onToggleForm={handleToggleForm}
                onClose={handleClose}
              />
            )}
            {currentForm === "register" && (
              <RegisterForm
                key="register"
                onToggleForm={handleToggleForm}
                onClose={handleClose}
              />
            )}
            {currentForm === "forgot" && (
              <ForgotPasswordForm
                key="forgot"
                onToggleForm={handleToggleForm}
                onClose={handleClose}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
