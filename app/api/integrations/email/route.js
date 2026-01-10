import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { to, subject, body, html } = await request.json();

    if (!to || !subject || (!body && !html)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Configure transporter
    // For production, use real SMTP settings from env
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
      // Fallback to Ethereal for testing
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
      console.log("Using Ethereal test account:", testAccount.user);
    }

    const info = await transporter.sendMail({
      from: `"OffGrid" <${process.env.SMTP_FROM || "noreply@offgrid.com"}>`,
      to,
      subject,
      text: body,
      html: html || body.replace(/\n/g, "<br>"),
    });

    console.log("Email sent: %s", info.messageId);

    // If using ethereal, log the preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Preview URL: %s", previewUrl);
    }

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      previewUrl,
    });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
