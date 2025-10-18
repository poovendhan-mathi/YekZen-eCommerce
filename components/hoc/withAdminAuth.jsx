"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const withAdminAuth = (WrappedComponent) => {
  const AdminProtectedComponent = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          toast.error("Please sign in to access admin dashboard");
          router.push(
            "/signin?returnUrl=" + encodeURIComponent(window.location.pathname)
          );
          return;
        }

        if (user.email !== "admin@yekzen.com") {
          toast.error("Access denied. Admin privileges required.");
          router.push("/");
          return;
        }
      }
    }, [user, loading, router]);

    // Show loading or render component
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!user || user.email !== "admin@yekzen.com") {
      return null; // Will redirect via useEffect
    }

    return <WrappedComponent {...props} />;
  };

  AdminProtectedComponent.displayName = `withAdminAuth(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return AdminProtectedComponent;
};

export default withAdminAuth;
