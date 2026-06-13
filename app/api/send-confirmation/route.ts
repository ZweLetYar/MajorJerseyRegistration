import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
  try {
    const { to, name, year, rollNo } = await req.json();

    const transporter = nodemailer.createTransport({
      //host: process.env.EMAIL_HOST,
      service: "gmail",
      //port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const result = await transporter.sendMail({
      from: `IST Registration System <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      // use headers to set Reply-To to satisfy TypeScript SendMailOptions
      headers: {
        "Reply-To": process.env.EMAIL_FROM || process.env.EMAIL_USER,
      },
      to,
      subject: "Registration Confirmed",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2 style="color: #1d4ed8;">Registration Confirmed</h2>
          <p>Hello ${name},</p>
          <p>Your registration has been confirmed successfully.</p>
          <p><strong>Year:</strong> ${year}</p>
          <p><strong>Roll No:</strong> ${rollNo}</p>
          <p>Thank you for registering.</p>
        </div>
      `,
    });

    console.log("EMAIL SENT INFO:", result);

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent",
    });
  } catch (error) {
    console.error("Email error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send confirmation email",
      },
      { status: 500 },
    );
  }
}
