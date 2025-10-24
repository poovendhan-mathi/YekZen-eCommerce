// Goal: Razorpay order creation API for UPI and Indian payment methods
import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "INR", customerInfo } = await request.json();

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Amount in paise (smallest currency unit)
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        orderType: "ecommerce",
        source: "YekZen",
        customerEmail: customerInfo?.email || "",
        customerName: customerInfo?.name || "",
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // Public key for frontend
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create Razorpay order",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}

// Verify Razorpay payment signature
export async function PUT(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    // Create signature verification
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      // Payment is verified - you can update your database here
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Razorpay verification error:", error);

    return NextResponse.json(
      {
        error: "Payment verification failed",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}
