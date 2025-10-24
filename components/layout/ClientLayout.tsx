// Goal: Client layout wrapper with auth and cart context providers
"use client";

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import PageTransition from "../transitions/PageTransition";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "../../contexts/CartContext";
import { AuthProvider } from "../../contexts/AuthContext";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363736",
              color: "#fff",
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}
