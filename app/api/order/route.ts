import dbConnect from "@/lib/dbConnect";
import Student from "@/lib/models/Student";
import Order from "@/lib/models/Order";
import {
  checkRateLimit,
  createRateLimitResponse,
  getRequestIdentifier,
} from "@/lib/rateLimit";
import { NextResponse } from "next/server";

const REQUEST_LIMIT = 60;
const REQUEST_WINDOW_MS = 60 * 1000;

export async function POST(req: Request) {
  const rateLimit = checkRateLimit(
    `order:post:${getRequestIdentifier(req)}`,
    REQUEST_LIMIT,
    REQUEST_WINDOW_MS,
  );

  if (!rateLimit.allowed) {
    return createRateLimitResponse();
  }

  try {
    await dbConnect();

    const body = await req.json();

    const {
      name,
      email,
      phone,
      year,
      size,
      rollNo,
      paymentProofUrl,
      validateOnly,
      status,
    } = body;

    const hasValidRollNo =
      rollNo &&
      typeof rollNo === "object" &&
      typeof rollNo.rollNumber === "number" &&
      rollNo.rollNumber >= 1 &&
      rollNo.rollNumber <= 150;

    if (
      !name ||
      !email ||
      !phone ||
      !year ||
      !size ||
      !hasValidRollNo ||
      (!validateOnly && !paymentProofUrl)
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    if (!phone.startsWith("+95")) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 },
      );
    }

    // CHECK REGISTRANT
    const isRegistrant = await Student.findOne({
      year,
      "rollNo.rollNumber": rollNo.rollNumber,
      status: "confirmed",
    });

    // DUPLICATE CHECK (ROLL)
    const existingRoll = await Order.findOne({
      year,
      "rollNo.rollNumber": rollNo.rollNumber,
    });

    if (existingRoll) {
      return NextResponse.json(
        { success: false, message: "Roll number already ordered" },
        { status: 409 },
      );
    }

    // DUPLICATE CHECK (EMAIL)
    const existingEmail = await Order.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email already ordered" },
        { status: 409 },
      );
    }

    if (validateOnly) {
      return NextResponse.json({
        success: true,
        isRegistrant: Boolean(isRegistrant),
      });
    }

    const order = await Order.create({
      name,
      email,
      phone,
      year,
      size,
      rollNo,
      paymentProofUrl,
      status: status || "unchecked",
      isRegistrant: Boolean(isRegistrant),
    });

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
