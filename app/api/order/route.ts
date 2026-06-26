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

export const maxDuration = 10;

export async function GET(req: Request) {
  const rateLimit = checkRateLimit(
    `order:get:${getRequestIdentifier(req)}`,
    REQUEST_LIMIT,
    REQUEST_WINDOW_MS,
  );

  if (!rateLimit.allowed) {
    return createRateLimitResponse();
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (id) {
      const order = await Order.findById(id).lean();

      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ success: true, order }, { status: 200 });
    }

    const query = email ? { email } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, orders, count: orders.length },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const rateLimit = checkRateLimit(
    `order:patch:${getRequestIdentifier(req)}`,
    REQUEST_LIMIT,
    REQUEST_WINDOW_MS,
  );

  if (!rateLimit.allowed) {
    return createRateLimitResponse();
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const nextStatus = body?.status;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order id is required" },
        { status: 400 },
      );
    }

    if (!["confirmed", "rejected"].includes(nextStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 },
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: nextStatus },
      { new: true },
    ).lean();

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, order: updatedOrder },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

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
      isRegistrant,
    } = body;

    const hasValidRollNo =
      rollNo &&
      typeof rollNo === "object" &&
      typeof rollNo.rollNumber === "number" &&
      rollNo.rollNumber >= 1 &&
      rollNo.rollNumber <= 150;

    const shouldValidateOnly = validateOnly === true;

    // Validation
    if (
      !name ||
      !email ||
      !phone ||
      !year ||
      !size ||
      !hasValidRollNo ||
      (!shouldValidateOnly && !paymentProofUrl)
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // Myanmar phone validation
    if (!phone.startsWith("+95")) {
      return NextResponse.json(
        { message: "Invalid phone number" },
        { status: 400 },
      );
    }

    // Registant roll number (unique per selected year group)
    const isRegistant = await Promise.race([
      Student.findOne({
        year,
        "rollNo.rollNumber": rollNo.rollNumber,
        status: "confirmed",
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database lookup timed out")), 4000),
      ),
    ]);

    if (isRegistant) {
      return NextResponse.json(
        { success: false, message: "Registrant" },
        { status: 200 },
      );
    }

    // Duplicate roll number (unique per selected year group)
    const existingRoll = await Promise.race([
      Order.findOne({
        year,
        "rollNo.rollNumber": rollNo.rollNumber,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database lookup timed out")), 4000),
      ),
    ]);

    if (existingRoll) {
      return NextResponse.json(
        { success: false, message: "Roll number already ordered" },
        { status: 409 },
      );
    }

    // Duplicate email
    const existingEmail = await Promise.race([
      Order.findOne({ email: email.toLowerCase() }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database lookup timed out")), 4000),
      ),
    ]);

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email already ordered" },
        { status: 409 },
      );
    }

    if (shouldValidateOnly) {
      return NextResponse.json(
        { success: true, message: "Ordering details look good." },
        { status: 200 },
      );
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
      isRegistrant: isRegistrant || false,
    });

    return NextResponse.json(
      {
        success: true,
        id: order._id,
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
