// Goal: Stripe checkout session API for secure payment processing
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(request) {
  try {
    const { items, customerEmail, successUrl, cancelUrl } =
      await request.json();

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    // Transform cart items to Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description || "",
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      metadata: {
        orderType: "ecommerce",
        source: "YekZen",
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "IN"],
      },
      billing_address_collection: "required",
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout session error:", error);

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
