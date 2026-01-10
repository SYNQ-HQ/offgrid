import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Configure transporter
    let transporter;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("Using Ethereal test account (Contact Form):", testAccount.user);
    }

    // 1. Send confirmation to user
    await transporter.sendMail({
      from: `"OffGrid" <${process.env.SMTP_FROM || "noreply@offgrid.com"}>`,
      to: email,
      subject: `OffGrid: We received your message`,
      text: `Hi ${name},

Thank you for reaching out. We'll get back to you soon.

OffGrid Team`,
    });

    // 2. Find Admins
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
      select: { email: true },
    });

    // 3. Notify Admins
    for (const admin of admins) {
      if (admin.email) {
        await transporter.sendMail({
          from: `"OffGrid Contact" <${process.env.SMTP_FROM || "noreply@offgrid.com"}>`,
          to: admin.email,
          subject: `New contact form submission: ${subject}`,
          text: `Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
