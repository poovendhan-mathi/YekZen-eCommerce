"use client";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "../contexts/CartContext";
import { AuthProvider } from "../contexts/AuthContext";

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
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
    </AuthProvider>
  );
}
