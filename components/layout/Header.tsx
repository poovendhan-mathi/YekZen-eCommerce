// Goal: Create premium animated Navbar with YekZen logo, search, and cart icon
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import AuthModal from "../auth/AuthModal";
import RegionSelector from "./RegionSelector";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalType, setAuthModalType] = useState<string>("login");
  const [showProfileDropdown, setShowProfileDropdown] =
    useState<boolean>(false);
  const { items } = useCart();
  const { user, signOut: logout } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Show number of unique items, not total quantity
  const cartItemsCount = items?.length || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent<HTMLFormElement>) => {
    e && e.preventDefault && e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileDropdown(false);
    router.push("/");
  };

  const isAdmin = user?.email === "admin@yekzen.com";

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center flex-shrink-0"
            >
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">YZ</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  YekZen
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2 ml-12">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="group relative px-3 py-2 text-gray-700 font-medium rounded-lg overflow-hidden block"
                  >
                    <span className="relative z-10 group-hover:text-white transition-colors duration-200">
                      {item.name}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Search Bar - Enhanced Design */}
            <motion.form
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSearch}
              className="hidden lg:flex items-center flex-1 max-w-3xl mx-6"
            >
              <div className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <MagnifyingGlassIcon className="absolute left-5 h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search for products, brands, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-28 py-4 text-base font-medium border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-lg transition-all bg-white"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl hover:shadow-xl transition-all text-sm font-semibold active:scale-95"
                  >
                    Search
                  </button>
                </div>
              </div>
            </motion.form>

            {/* Right Actions */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              {/* Region Selector */}
              <RegionSelector />

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors group"
              >
                <ShoppingCartIcon className="h-7 w-7 group-hover:scale-110 transition-transform" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </Link>

              {/* User Profile/Auth */}
              <div className="hidden sm:flex items-center">
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      id="user-profile-button"
                      onClick={() =>
                        setShowProfileDropdown(!showProfileDropdown)
                      }
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                        {(
                          (user?.displayName || user?.email || "U")[0] || "U"
                        ).toUpperCase()}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900">
                          {user?.displayName ||
                            user?.email?.split("@")[0] ||
                            "User"}
                        </span>
                        {isAdmin && (
                          <span className="text-xs text-purple-600 font-semibold">
                            Admin
                          </span>
                        )}
                      </div>
                      <ChevronDownIcon
                        className={`h-4 w-4 text-gray-500 transition-transform ${
                          showProfileDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                      {showProfileDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-sm font-semibold text-gray-900">
                              {user?.displayName || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user?.email}
                            </p>
                          </div>

                          <div className="py-2">
                            <Link
                              href="/profile"
                              onClick={() => setShowProfileDropdown(false)}
                              className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                            >
                              <UserCircleIcon className="h-5 w-5 text-gray-600" />
                              <span className="text-sm text-gray-700">
                                My Profile
                              </span>
                            </Link>

                            <Link
                              href="/orders"
                              onClick={() => setShowProfileDropdown(false)}
                              className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                            >
                              <ShoppingCartIcon className="h-5 w-5 text-gray-600" />
                              <span className="text-sm text-gray-700">
                                My Orders
                              </span>
                            </Link>

                            {isAdmin && (
                              <>
                                <div className="border-t border-gray-200 my-2" />
                                <Link
                                  href="/admin"
                                  onClick={() => setShowProfileDropdown(false)}
                                  className="flex items-center space-x-3 px-4 py-2.5 hover:bg-purple-50 transition-colors"
                                >
                                  <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                                  <span className="text-sm text-purple-600 font-semibold">
                                    Admin Dashboard
                                  </span>
                                </Link>
                                <Link
                                  href="/admin/products"
                                  onClick={() => setShowProfileDropdown(false)}
                                  className="flex items-center space-x-3 px-4 py-2.5 hover:bg-purple-50 transition-colors"
                                >
                                  <Cog6ToothIcon className="h-5 w-5 text-purple-600" />
                                  <span className="text-sm text-purple-600 font-semibold">
                                    Manage Products
                                  </span>
                                </Link>
                              </>
                            )}
                          </div>

                          <div className="border-t border-gray-200 mt-2 pt-2">
                            <button
                              id="logout-button"
                              onClick={handleLogout}
                              className="flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 transition-colors w-full"
                            >
                              <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-600" />
                              <span className="text-sm text-red-600 font-medium">
                                Logout
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAuthModalType("login");
                        setShowAuthModal(true);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => {
                        setAuthModalType("register");
                        setShowAuthModal(true);
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </motion.div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-200"
              >
                <div className="py-4 space-y-4">
                  {/* Mobile Search */}
                  <div className="px-4">
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </form>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="space-y-2 px-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Auth */}
                  <div className="px-4 space-y-2">
                    <button
                      onClick={() => {
                        setAuthModalType("login");
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalType("register");
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialForm={authModalType}
      />
    </>
  );
};

export default Header;
<Button className="w-full">Sign Up</Button>;
