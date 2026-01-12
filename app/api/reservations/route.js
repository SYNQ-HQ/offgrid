import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { getReservationEmailTemplate } from "@/lib/email-templates";
import { z } from "zod";

const reservationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  name: z.string().min(2, "Name is too short"),
  email: z.email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  seats: z.number().int().positive().default(1),
  type: z.enum(["ticket", "table"]).default("ticket"),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  referral: z.string().optional(),
});

export async function POST(request) {
  try {
    const json = await request.json();
    const validation = reservationSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.format(),
        },
        { status: 400 },
      );
    }

    const {
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
    } = validation.data;

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get Event
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      const isTable = type === "table";

      // 2. Capacity Check (Only for Tables)
      if (isTable && event.seats_taken + seats > event.total_seats) {
        throw new Error("Not enough tables available");
      }

      // 3. Create Reservation
      const reservation = await tx.reservation.create({
        data: {
          eventId,
          name,
          email,
          seats: isTable ? seats : 1, // Tickets default to 1 unit
          type,
          phone,
          instagram,
          twitter,
          role,
          referral,
        },
      });

      // 4. Update Event Capacity (Only for Tables)
      if (isTable) {
        await tx.event.update({
          where: { id: eventId },
          data: {
            seats_taken: {
              increment: seats,
            },
          },
        });
      }

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

      const isTable = type === "table";
      const typeLabel = isTable ? "Table" : "Ticket";

      const htmlContent = getReservationEmailTemplate({
        name,
        eventTitle: result.eventTitle,
        eventDate: result.eventDate,
        type: type,
        seats,
        phone: phone,
      });

      await transporter.sendMail({
        from: `"OffGrid" <${process.env.SMTP_FROM || "noreply@offgrid.com"}>`,
        to: email,
        subject: `${typeLabel} Registration - OffGrid`,
        text: `Hi ${name},\n\nYour ${typeLabel.toLowerCase()} registration request for ${result.eventTitle} has been received.\n\nEvent: ${result.eventTitle}\nDate: ${result.eventDate}\n${isTable ? `Tables: ${seats}\n` : ""}Phone: ${phone || "N/A"}\n\n${isTable ? "Please complete your payment via WhatsApp if you haven't already. We'll confirm your reservation once payment is verified." : "Please confirm your entry via WhatsApp."}\n\nOffGrid Team`,
        html: htmlContent,
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
