// Goal: Forgot password form with email validation and Firebase password reset
"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface ForgotPasswordFormProps {
  onToggleForm: (form: string) => void;
  onClose?: () => void;
}

interface FormErrors {
  email?: string;
}

const ForgotPasswordForm = ({ onToggleForm }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { resetPassword } = useAuth();

  const validateEmail = () => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setIsLoading(true);
    const result = await resetPassword(email);

    if (result.success) {
      setIsSubmitted(true);
    }
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    // Clear error when user starts typing
    if (errors.email) {
      setErrors({});
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <EnvelopeIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600">
            We've sent a password reset link to{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or try again in a
            few minutes.
          </p>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsSubmitted(false)}
          >
            Try Different Email
          </Button>

          <button
            onClick={() => onToggleForm?.("login")}
            className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Reset Password
        </h2>
        <p className="text-gray-600 mt-2">
          Enter your email address and we'll send you a link to reset your
          password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={handleChange}
            error={errors.email}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Remember your password?{" "}
          <button
            onClick={() => onToggleForm?.("login")}
            className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordForm;
