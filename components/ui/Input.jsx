// Goal: Create reusable input component with validation and styling
"use client";

import { forwardRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      error,
      helperText,
      required = false,
      className = "",
      icon: Icon,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const baseStyles =
      "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300";
    const normalStyles = "border-gray-300 focus:ring-blue-500";
    const errorStyles = "border-red-300 focus:ring-red-500";

    const inputClasses = `
    ${baseStyles}
    ${error ? errorStyles : normalStyles}
    ${Icon || isPassword ? "pl-12" : ""}
    ${className}
  `.trim();

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            className={inputClasses}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
