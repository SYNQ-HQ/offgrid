import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

export async function POST(request) {
  try {
    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Calculate total on server to prevent tampering
    let total = 0;
    for (const item of items) {
      const dbItem = await prisma.merch.findUnique({
        where: { id: item.id },
      });
      if (dbItem) {
        total += dbItem.price * item.quantity;
      }
    }

    const amount = Math.round(total * 100); // Stripe expects cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        // We can store item IDs or other info here
        orderItems: JSON.stringify(items.map(i => ({ id: i.id, q: i.quantity }))),
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
