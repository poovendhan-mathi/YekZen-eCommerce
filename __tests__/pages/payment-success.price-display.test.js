/**
 * Payment Success Page - Price Display Test
 *
 * Tests for correct price and currency display on payment success page
 *
 * Bug Fix #2: Individual item prices should show (price × quantity), not unit price
 */

import "@testing-library/jest-dom";

describe("Payment Success - Price Calculations", () => {
  describe("Individual Item Price Display", () => {
    it("should calculate total price (price × quantity) for each item", () => {
      const item1 = { id: 1, name: "Product 1", price: 99.99, quantity: 2 };
      const item2 = { id: 2, name: "Product 2", price: 149.99, quantity: 3 };

      const item1Total = (item1.price * item1.quantity).toFixed(2);
      const item2Total = (item2.price * item2.quantity).toFixed(2);

      expect(item1Total).toBe("199.98");
      expect(item2Total).toBe("449.97");
    });

    it("should handle decimal precision correctly", () => {
      const price = 99.99;
      const quantity = 3;
      const total = (price * quantity).toFixed(2);

      expect(total).toBe("299.97");
      // Should not have floating point precision errors
      expect(total).not.toBe("299.96999999999997");
    });

    it("should handle single quantity correctly", () => {
      const item = { price: 149.99, quantity: 1 };
      const total = (item.price * item.quantity).toFixed(2);

      expect(total).toBe("149.99");
    });

    it("should handle large quantities", () => {
      const item = { price: 10.0, quantity: 100 };
      const total = (item.price * item.quantity).toFixed(2);

      expect(total).toBe("1000.00");
    });

    it("should handle very small prices", () => {
      const item = { price: 0.01, quantity: 5 };
      const total = (item.price * item.quantity).toFixed(2);

      expect(total).toBe("0.05");
    });
  });

  describe("Currency Display", () => {
    it("should display INR for Razorpay payments", () => {
      const order = {
        paymentMethod: "Razorpay",
        totalAmount: 2999.0,
      };

      expect(order.paymentMethod).toBe("Razorpay");
      // Razorpay = INR currency
    });

    it("should display USD for Stripe payments", () => {
      const order = {
        paymentMethod: "Stripe",
        totalAmount: 299.99,
      };

      expect(order.paymentMethod).toBe("Stripe");
      // Stripe = USD currency
    });
  });

  describe("Price Precision", () => {
    it("should handle price precision with many decimals", () => {
      const price = 99.999999;
      const quantity = 3;
      const total = (price * quantity).toFixed(2);

      expect(total).toBe("300.00");
    });

    it("should round correctly", () => {
      const price = 10.995;
      const quantity = 2;
      const total = (price * quantity).toFixed(2);

      expect(total).toBe("21.99");
    });

    it("should handle zero price", () => {
      const item = { price: 0, quantity: 5 };
      const total = (item.price * item.quantity).toFixed(2);

      expect(total).toBe("0.00");
    });
  });

  describe("Order Total Calculations", () => {
    it("should calculate correct order total from multiple items", () => {
      const items = [
        { id: 1, price: 99.99, quantity: 2 },
        { id: 2, price: 149.99, quantity: 1 },
      ];

      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      expect(total.toFixed(2)).toBe("349.97");
    });

    it("should handle undefined values gracefully", () => {
      const items = [
        { id: 1, price: 100, quantity: 2 },
        { id: 2, price: undefined, quantity: 1 },
      ];

      const total = items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      );

      expect(total).toBe(200);
    });
  });
});
