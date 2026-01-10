import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      eventId, 
      name, 
      email, 
      seats = 1, 
      type = "ticket",
      phone,
      instagram,
      twitter,
      role,
      referral
    } = body;

    if (!eventId || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get Event to check seats
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      if (event.seats_taken + seats > event.total_seats) {
        throw new Error("Not enough seats available");
      }

      // 2. Create Reservation
      const reservation = await tx.reservation.create({
        data: {
          eventId,
          name,
          email,
          seats,
          type,
          phone,
          instagram,
          twitter,
          role,
          referral,
        },
      });

      // 3. Update Event Seats
      await tx.event.update({
        where: { id: eventId },
        data: {
          seats_taken: {
            increment: seats,
          },
        },
      });

      return { reservation, eventTitle: event.title, eventDate: event.date };
    });

    // Send confirmation email (Fire and forget, or await)
    // We do this outside the transaction to not block/fail the DB write on email error
    try {
        let transporter;
        if (process.env.SMTP_HOST) {
          transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          });
        } else {
            // Fallback for dev without creds
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: { user: testAccount.user, pass: testAccount.pass },
            });
             console.log("Using Ethereal (Reservation):", testAccount.user);
        }

        const isTable = body.type === "table";
        const typeLabel = isTable ? "Table" : "Ticket";

        await transporter.sendMail({
            from: `"OffGrid" <${process.env.SMTP_FROM || "noreply@offgrid.com"}>`,
            to: email,
            subject: `${typeLabel} Registration - OffGrid`,
            text: `Hi ${name},\n\nYour ${typeLabel.toLowerCase()} registration request for ${result.eventTitle} has been received.\n\nEvent: ${result.eventTitle}\nDate: ${result.eventDate}\n${isTable ? `Tables: ${seats}\n` : ""}Phone: ${body.phone || 'N/A'}\n\n${isTable ? "Please complete your payment via WhatsApp if you haven't already. We'll confirm your reservation once payment is verified." : "Please confirm your entry via WhatsApp."}\n\nOffGrid Team`,
        });
    } catch (emailErr) {
        console.error("Failed to send reservation email", emailErr);
        // Don't fail the request, the reservation is made
    }

    return NextResponse.json(result.reservation);
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
