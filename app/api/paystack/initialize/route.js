import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, amount, items } = body;

    if (!email || !amount || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Validate Stock Server-Side
    for (const item of items) {
      const dbItem = await prisma.merch.findUnique({
        where: { id: item.id },
      });

      if (!dbItem) {
        return NextResponse.json(
          { error: `Item not found: ${item.name}` },
          { status: 400 }
        );
      }

      if (dbItem.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for: ${item.name}` },
          { status: 400 }
        );
      }
    }

    // 2. Initialize Paystack Transaction
    const params = {
      email,
      amount: Math.round(amount * 100), // Convert to kobo/cents
      metadata: {
        cart_items: items.map(i => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price
        }))
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/verify`
    };

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Paystack initialization failed");
    }

    return NextResponse.json(paystackData.data);
  } catch (error) {
    console.error("Paystack Init Error:", error);
    return NextResponse.json(
      { error: error.message || "Payment initialization failed" },
      { status: 500 }
    );
  }
}
