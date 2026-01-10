import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json({ error: "No reference provided" }, { status: 400 });
    }

    // 1. Verify Transaction with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const { metadata, customer, amount, id: paystackId } = verifyData.data;
    
    // Check if order already exists to prevent duplicates
    const existingOrder = await prisma.order.findFirst({
      where: { stripe_payment_id: String(paystackId) } // storing paystack ID here for now
    });

    if (existingOrder) {
      return NextResponse.json({ orderId: existingOrder.id, status: "already_processed" });
    }

    const cartItems = metadata.cart_items;

    // 2. Create Order & Decrement Stock (Atomic Transaction)
    const result = await prisma.$transaction(async (tx) => {
      // Re-check stock strictly inside transaction
      for (const item of cartItems) {
        const dbItem = await tx.merch.findUnique({ where: { id: item.id } });
        if (!dbItem || dbItem.stock < item.quantity) {
          throw new Error(`Out of stock: ${item.name}`);
        }
        
        // Decrement
        await tx.merch.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create Order
      const order = await tx.order.create({
        data: {
          customer_email: customer.email,
          customer_name: customer.first_name ? `${customer.first_name} ${customer.last_name}` : "Customer", // Paystack might not return name if not asked
          total_amount: amount / 100, // Convert back from kobo
          status: "completed",
          stripe_payment_id: String(paystackId), // Using this field for Paystack Reference/ID
          items: {
            create: cartItems.map((item) => ({
              merchId: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
      });

      return order;
    });

    return NextResponse.json({ success: true, orderId: result.id });
  } catch (error) {
    console.error("Paystack Verify Error:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
