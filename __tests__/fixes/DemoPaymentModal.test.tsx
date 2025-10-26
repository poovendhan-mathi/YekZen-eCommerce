/**
 * Test Suite: DemoPaymentModal Currency & UPI
 * Tests currency display and UPI payment option
 */

/// <reference types="@testing-library/jest-dom" />

import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DemoPaymentModal from "../../components/payments/DemoPaymentModal";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("DemoPaymentModal - Currency Display", () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    amount: 852404.69,
    onSuccess: jest.fn(),
    customerInfo: {
      name: "Test User",
      email: "test@example.com",
    },
  };

  it("should display USD currency symbol for Stripe", () => {
    render(
      <DemoPaymentModal {...mockProps} currency="USD" paymentType="card" />
    );

    // Use getAllByText to handle multiple occurrences
    const amounts = screen.getAllByText(/\$852404\.69/);
    expect(amounts.length).toBeGreaterThan(0);
  });

  it("should display INR currency symbol for Razorpay", () => {
    render(
      <DemoPaymentModal {...mockProps} currency="INR" paymentType="card" />
    );

    // Use getAllByText to handle multiple occurrences
    const amounts = screen.getAllByText(/₹852404\.69/);
    expect(amounts.length).toBeGreaterThan(0);
  });

  it("should default to USD when currency not specified", () => {
    render(<DemoPaymentModal {...mockProps} />);

    // Should show $ symbol by default (use getAllByText for multiple occurrences)
    const amounts = screen.getAllByText(/\$852404\.69/);
    expect(amounts.length).toBeGreaterThan(0);
  });
});

describe("DemoPaymentModal - UPI Payment Option", () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    amount: 1000,
    onSuccess: jest.fn(),
    customerInfo: {
      name: "Test User",
      email: "test@example.com",
    },
    currency: "INR" as const,
    paymentType: "upi" as const,
  };

  it("should show UPI tab for INR currency", () => {
    render(<DemoPaymentModal {...mockProps} />);

    expect(screen.getByText(/📱 UPI/)).toBeTruthy();
  });

  it("should show Card tab for INR currency", () => {
    render(<DemoPaymentModal {...mockProps} />);

    expect(screen.getByText(/💳 Card/)).toBeTruthy();
  });

  it("should display UPI QR code when UPI tab is selected", () => {
    render(<DemoPaymentModal {...mockProps} paymentType="upi" />);

    expect(screen.getByText(/Scan QR Code/)).toBeTruthy();
    expect(screen.getByText(/Use any UPI app to scan and pay/)).toBeTruthy();
  });

  it("should show UPI ID in UPI payment view", () => {
    render(<DemoPaymentModal {...mockProps} paymentType="upi" />);

    expect(screen.getByText(/yekzen@demobank/)).toBeTruthy();
  });

  it("should display amount in INR for UPI", () => {
    render(<DemoPaymentModal {...mockProps} amount={1500} paymentType="upi" />);

    const amounts = screen.getAllByText(/₹1500\.00/);
    expect(amounts.length).toBeGreaterThan(0);
  });

  it("should show Complete Demo UPI Payment button", () => {
    render(<DemoPaymentModal {...mockProps} paymentType="upi" />);

    expect(screen.getByText(/Complete Demo UPI Payment/)).toBeTruthy();
  });

  it("should call onSuccess when UPI payment is completed", async () => {
    jest.useFakeTimers();
    const onSuccess = jest.fn();

    render(
      <DemoPaymentModal
        {...mockProps}
        onSuccess={onSuccess}
        paymentType="upi"
      />
    );

    const completeButton = screen.getByText(/Complete Demo UPI Payment/);
    fireEvent.click(completeButton);

    // Fast-forward through the timeout
    jest.advanceTimersByTime(3500);

    expect(onSuccess).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("should not show UPI tabs for USD currency", () => {
    render(
      <DemoPaymentModal {...mockProps} currency="USD" paymentType="card" />
    );

    expect(screen.queryByText(/📱 UPI/)).toBeNull();
  });
});

describe("DemoPaymentModal - Payment Method Switching", () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    amount: 500,
    onSuccess: jest.fn(),
    customerInfo: {
      name: "Test User",
      email: "test@example.com",
    },
    currency: "INR" as const,
    paymentType: "card" as const,
  };

  it("should switch from Card to UPI when UPI tab is clicked", () => {
    render(<DemoPaymentModal {...mockProps} />);

    const upiTab = screen.getByText(/📱 UPI/);
    fireEvent.click(upiTab);

    // Should now show UPI interface
    expect(screen.getByText(/Scan QR Code/)).toBeTruthy();
  });

  it("should switch from UPI to Card when Card tab is clicked", () => {
    render(<DemoPaymentModal {...mockProps} paymentType="upi" />);

    const cardTab = screen.getByText(/💳 Card/);
    fireEvent.click(cardTab);

    // Should now show card form
    expect(screen.getByText(/Show Test Cards/)).toBeTruthy();
  });
});
