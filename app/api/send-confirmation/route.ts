import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  checkRateLimit,
  createRateLimitResponse,
  getRequestIdentifier,
} from "@/lib/rateLimit";

const REQUEST_LIMIT = 20;
const REQUEST_WINDOW_MS = 60 * 1000;

export const maxDuration = 10;

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(
    `email:confirm:${getRequestIdentifier(req)}`,
    REQUEST_LIMIT,
    REQUEST_WINDOW_MS,
  );

  if (!rateLimit.allowed) {
    return createRateLimitResponse();
  }

  try {
    const { to, name, year, rollNo } = await req.json();

    const smtpHost = process.env.EMAIL_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.EMAIL_PORT || 587);
    const smtpSecure = process.env.EMAIL_SECURE === "true" || smtpPort === 465;
    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const fromName = process.env.EMAIL_FROM_NAME || "IST Registration System";
    const replyToAddress = process.env.EMAIL_REPLY_TO || fromAddress;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !fromAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Email credentials are not configured",
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      requireTLS: true,
      pool: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
    });
    await Promise.race([
      (
        transporter as typeof transporter & { verify: () => Promise<void> }
      ).verify(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Email verification timed out")),
          5000,
        ),
      ),
    ]);

    await Promise.race([
      transporter.sendMail({
        //@ts-ignore
        from: {
          name: fromName,
          address: fromAddress,
        },
        replyTo: {
          name: fromName,
          address: replyToAddress,
        },
        to,
        subject: "Registration Confirmed",
        text: `Hello ${name}, your registration is confirmed. Year: ${year}, Roll: ${rollNo}`,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #111827;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.06);">
            <div style="background: linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%); padding: 24px 32px; color: #ffffff;">
              <h2 style="margin: 0; font-size: 24px;">Registration Confirmed</h2>
              <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.95;">Thank you for registering for the IST Major Jacket.</p>
            </div>
            <div style="padding: 32px;">
              <p style="margin: 0 0 12px; font-size: 16px;">Hello ${name},</p>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.7;">Your registration has been received and confirmed successfully.</p>
              <div style="background: #f8fafc; border-left: 4px solid #1d4ed8; padding: 14px 16px; border-radius: 8px; margin-bottom: 18px;">
                <p style="margin: 0 0 6px; font-size: 14px;"><strong>Year:</strong> ${year}</p>
                <p style="margin: 0; font-size: 14px;"><strong>Roll No:</strong> ${rollNo}</p>
              </div>
              <p style="margin: 0; font-size: 15px; line-height: 1.7;">Please keep this email for your records. We will be in touch with further updates if needed.</p>
            </div>
            <div style="background: #f8fafc; padding: 16px 32px; text-align: center; font-size: 12px; color: #6b7280;">
              <p style="margin: 0;">IST Major Jacket Registration System</p>
            </div>
          </div>
        </div>
      `,
        headers: {
          "Auto-Submitted": "auto-generated",
          "X-Auto-Response-Suppress": "OOF, RN, NRN, AutoReply",
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email send timed out")), 10000),
      ),
    ]);

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Email error:", error);

    return NextResponse.json(
      {
        success: false,
        message: `Failed to send confirmation email: ${message}`,
      },
      { status: 500 },
    );
  }
}
