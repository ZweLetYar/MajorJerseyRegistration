import dbConnect from "@/lib/dbConnect";
import Student from "@/lib/models/Student";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (id) {
      const student = await Student.findById(id).lean();

      if (!student) {
        return NextResponse.json(
          { success: false, message: "Student not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ success: true, student }, { status: 200 });
    }

    const query = email ? { email } : {};
    const students = await Student.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, students, count: students.length },
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
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const nextStatus = body?.status;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Student id is required" },
        { status: 400 },
      );
    }

    if (!["confirmed", "rejected"].includes(nextStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 },
      );
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { status: nextStatus },
      { new: true },
    ).lean();

    if (!updatedStudent) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, student: updatedStudent },
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
  try {
    await dbConnect();

    const body = await req.json();

    const {
      name,
      email,
      phone,
      year,

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

    const shouldValidateOnly = validateOnly === true;

    // Validation
    if (
      !name ||
      !email ||
      !phone ||
      !year ||
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

    // Duplicate roll number (unique per selected year group)
    const existingRoll = await Student.findOne({
      year,
      "rollNo.rollNumber": rollNo.rollNumber,
    });

    if (existingRoll) {
      return NextResponse.json(
        { success: false, message: "Roll number already registered" },
        { status: 409 },
      );
    }

    // Duplicate email
    const existingEmail = await Student.findOne({ email: email.toLowerCase() });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 },
      );
    }

    if (shouldValidateOnly) {
      return NextResponse.json(
        { success: true, message: "Registration details look good." },
        { status: 200 },
      );
    }

    const student = await Student.create({
      name,
      email,
      phone,
      year,
      rollNo,
      paymentProofUrl,
      status: status || "unchecked",
    });

    return NextResponse.json(
      {
        success: true,
        id: student._id,
        student,
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
