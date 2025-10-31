import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Header from "../components/layout/Header";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { CurrencyProvider } from "../contexts/CurrencyContext";

// Mock window.scrollTo
global.scrollTo = jest.fn();

// Helper function to render with providers
const renderWithProviders = (component) => {
  return render(<CurrencyProvider>{component}</CurrencyProvider>);
};

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}));

jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../contexts/CartContext", () => ({
  useCart: jest.fn(),
}));

describe("Header Component", () => {
  const mockPush = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
    useAuth.mockReturnValue({
      user: null,
      signOut: mockSignOut,
    });
    useCart.mockReturnValue({
      cart: { items: [] },
    });
  });

  describe("Rendering", () => {
    it("should render the logo", () => {
      renderWithProviders(<Header />);
      expect(screen.getByText("YekZen")).toBeInTheDocument();
    });

    it("should render navigation links", () => {
      renderWithProviders(<Header />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Categories")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("should render search bar", () => {
      renderWithProviders(<Header />);
      const searchInput = screen.getByPlaceholderText(/search for products/i);
      expect(searchInput).toBeInTheDocument();
    });

    it("should render cart icon", () => {
      renderWithProviders(<Header />);
      const cartLinks = screen.getAllByRole("link");
      const cartLink = cartLinks.find(
        (link) => link.getAttribute("href") === "/cart"
      );
      expect(cartLink).toBeInTheDocument();
    });
  });

  describe("Authentication", () => {
    it("should show Sign In and Sign Up buttons when not authenticated", () => {
      renderWithProviders(<Header />);
      expect(screen.getAllByText("Sign In")[0]).toBeInTheDocument();
      expect(screen.getAllByText("Sign Up")[0]).toBeInTheDocument();
    });

    it("should show user profile when authenticated", () => {
      useAuth.mockReturnValue({
        user: {
          email: "user@test.com",
          displayName: "Test User",
        },
        signOut: mockSignOut,
      });

      renderWithProviders(<Header />);
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    it("should show admin badge for admin users", () => {
      useAuth.mockReturnValue({
        user: {
          email: "admin@yekzen.com",
          displayName: "Admin User",
        },
        signOut: mockSignOut,
      });

      renderWithProviders(<Header />);
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });

    it("should show profile dropdown when clicking profile button", async () => {
      useAuth.mockReturnValue({
        user: {
          email: "user@test.com",
          displayName: "Test User",
        },
        signOut: mockSignOut,
      });

      renderWithProviders(<Header />);
      const profileButton = screen.getByText("Test User").closest("button");
      fireEvent.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText("My Profile")).toBeInTheDocument();
        expect(screen.getByText("My Orders")).toBeInTheDocument();
      });
    });

    it("should show admin links in dropdown for admin users", async () => {
      useAuth.mockReturnValue({
        user: {
          email: "admin@yekzen.com",
          displayName: "Admin User",
        },
        signOut: mockSignOut,
      });

      renderWithProviders(<Header />);
      const profileButton = screen.getByText("Admin User").closest("button");
      fireEvent.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Manage Products")).toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    it("should update search query on input change", () => {
      renderWithProviders(<Header />);
      const searchInput = screen.getByPlaceholderText(/search for products/i);

      fireEvent.change(searchInput, { target: { value: "test query" } });
      expect(searchInput.value).toBe("test query");
    });

    it("should navigate to products page on search submit", () => {
      renderWithProviders(<Header />);
      const searchInput = screen.getByPlaceholderText(/search for products/i);
      const searchForm = searchInput.closest("form");

      fireEvent.change(searchInput, { target: { value: "laptop" } });
      fireEvent.submit(searchForm);

      expect(mockPush).toHaveBeenCalledWith("/products?search=laptop");
    });

    it("should clear search query after submit", () => {
      renderWithProviders(<Header />);
      const searchInput = screen.getByPlaceholderText(/search for products/i);
      const searchForm = searchInput.closest("form");

      fireEvent.change(searchInput, { target: { value: "laptop" } });
      fireEvent.submit(searchForm);

      expect(searchInput.value).toBe("");
    });

    it("should not submit empty search", () => {
      renderWithProviders(<Header />);
      const searchInput = screen.getByPlaceholderText(/search for products/i);
      const searchForm = searchInput.closest("form");

      fireEvent.submit(searchForm);

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Cart Badge", () => {
    it("should not show cart badge when cart is empty", () => {
      renderWithProviders(<Header />);
      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });

    it("should show cart item count", () => {
      useCart.mockReturnValue({
        items: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 3 },
        ],
        getItemCount: jest.fn(() => 2), // Two unique items
        addToCart: jest.fn(),
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getSubtotal: jest.fn(() => 0),
        getTax: jest.fn(() => 0),
        getShipping: jest.fn(() => 0),
        getTotal: jest.fn(() => 0),
        isInCart: jest.fn(() => false),
        getItemQuantity: jest.fn(() => 0),
      });

      renderWithProviders(<Header />);
      // Should show 2 (number of unique items), not 5 (total quantity)
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  describe("Mobile Menu", () => {
    it("should toggle mobile menu on button click", async () => {
      renderWithProviders(<Header />);
      const menuButton = screen.getByLabelText("Toggle menu");

      fireEvent.click(menuButton);

      await waitFor(() => {
        // Mobile menu should show navigation items
        const mobileNavItems = screen.getAllByText("Products");
        expect(mobileNavItems.length).toBeGreaterThan(1);
      });
    });
  });

  describe("Logout", () => {
    it("should call signOut and redirect on logout", async () => {
      useAuth.mockReturnValue({
        user: {
          email: "user@test.com",
          displayName: "Test User",
        },
        signOut: mockSignOut,
      });

      renderWithProviders(<Header />);
      const profileButton = screen.getByText("Test User").closest("button");
      fireEvent.click(profileButton);

      await waitFor(() => {
        const logoutButton = screen.getByText("Logout").closest("button");
        fireEvent.click(logoutButton);
      });

      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
