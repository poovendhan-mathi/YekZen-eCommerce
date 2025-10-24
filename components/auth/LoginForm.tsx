// Goal: Premium login form with validation and Firebase Auth integration
"use client";

import { useState, FC } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Input from "../ui/Input";
import { FormFieldAnimation, LoadingButton } from "../ui/StatusAnimations";

interface LoginFormProps {
  onToggleForm?: (form: string) => void;
  onClose?: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginForm: FC<LoginFormProps> = ({ onToggleForm, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { signIn } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    const result = await signIn(formData.email, formData.password);

    if (result.success) {
      onClose?.();
    }
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-gray-600 mt-2">Sign in to your YekZen account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormFieldAnimation delay={0.1}>
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
        </FormFieldAnimation>

        <FormFieldAnimation delay={0.2}>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </FormFieldAnimation>

        <LoadingButton
          loading={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </LoadingButton>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => onToggleForm?.("forgot")}
          className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
        >
          Forgot your password?
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => onToggleForm?.("register")}
            className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
