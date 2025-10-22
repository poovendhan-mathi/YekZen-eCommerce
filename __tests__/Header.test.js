import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Header from "../components/layout/Header";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
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
      render(<Header />);
      expect(screen.getByText("YekZen")).toBeInTheDocument();
    });

    it("should render navigation links", () => {
      render(<Header />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Categories")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("should render search bar", () => {
      render(<Header />);
      const searchInput = screen.getByPlaceholderText(/search for products/i);
      expect(searchInput).toBeInTheDocument();
    });

    it("should render cart icon", () => {
      render(<Header />);
      const cartLinks = screen.getAllByRole("link");
      const cartLink = cartLinks.find(
        (link) => link.getAttribute("href") === "/cart"
      );
      expect(cartLink).toBeInTheDocument();
    });
  });

  describe("Authentication", () => {
    it("should show Sign In and Sign Up buttons when not authenticated", () => {
      render(<Header />);
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

      render(<Header />);
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

      render(<Header />);
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

      render(<Header />);
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

      render(<Header />);
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
      render(<Header />);
      const searchInput = screen.getByPlaceholderText(/search for products/i);

      fireEvent.change(searchInput, { target: { value: "test query" } });
      expect(searchInput.value).toBe("test query");
    });

    it("should navigate to products page on search submit", () => {
      render(<Header />);
      const searchInput = screen.getByPlaceholderText(/search for products/i);
      const searchForm = searchInput.closest("form");

      fireEvent.change(searchInput, { target: { value: "laptop" } });
      fireEvent.submit(searchForm);

      expect(mockPush).toHaveBeenCalledWith("/products?search=laptop");
    });

    it("should clear search query after submit", () => {
      render(<Header />);
      const searchInput = screen.getByPlaceholderText(/search for products/i);
      const searchForm = searchInput.closest("form");

      fireEvent.change(searchInput, { target: { value: "laptop" } });
      fireEvent.submit(searchForm);

      expect(searchInput.value).toBe("");
    });

    it("should not submit empty search", () => {
      render(<Header />);
      const searchInput = screen.getByPlaceholderText(/search for products/i);
      const searchForm = searchInput.closest("form");

      fireEvent.submit(searchForm);

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Cart Badge", () => {
    it("should not show cart badge when cart is empty", () => {
      render(<Header />);
      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });

    it("should show cart item count", () => {
      useCart.mockReturnValue({
        cart: {
          items: [
            { id: 1, quantity: 2 },
            { id: 2, quantity: 3 },
          ],
        },
      });

      render(<Header />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });

  describe("Mobile Menu", () => {
    it("should toggle mobile menu on button click", async () => {
      render(<Header />);
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

      render(<Header />);
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
