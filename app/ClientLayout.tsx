"use client";

import { ReactNode, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "../contexts/CartContext";
import { AuthProvider } from "../contexts/AuthContext";
import { CurrencyProvider } from "../contexts/CurrencyContext";
import { useSessionTimeout } from "../lib/hooks/useSessionTimeout";
import SessionExpiryModal from "../components/ui/SessionExpiryModal";

interface ClientLayoutProps {
  children: ReactNode;
}

function SessionManager() {
  const [showExpiryModal, setShowExpiryModal] = useState(false);

  // Initialize session timeout for all users
  const { updateActivity } = useSessionTimeout({
    enabled: true,
    onGuestTimeout: () => {
      // Show modal for guest users
      setShowExpiryModal(true);
    },
  });

  const handleContinue = () => {
    setShowExpiryModal(false);
    // Reset activity timer
    updateActivity();
  };

  const handleGoHome = () => {
    setShowExpiryModal(false);
  };

  return (
    <SessionExpiryModal
      isOpen={showExpiryModal}
      onContinue={handleContinue}
      onGoHome={handleGoHome}
    />
  );
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <SessionManager />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
