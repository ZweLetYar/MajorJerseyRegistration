import dbConnect from "@/lib/dbConnect";
import Student from "@/lib/models/Student";
import { NextResponse } from "next/server";

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
    } = body;

    // Validation
    if (!name || !email || !phone || !year || !rollNo || !paymentProofUrl) {
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

    // Duplicate roll number
    const existingRoll = await Student.findOne({ rollNo });

    if (existingRoll) {
      return NextResponse.json(
        { message: "Roll number already registered" },
        { status: 409 },
      );
    }

    // Duplicate email
    const existingEmail = await Student.findOne({ email });

    if (existingEmail) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 },
      );
    }

    const student = await Student.create({
      name,
      email,
      phone,
      year,
      rollNo,
      paymentProofUrl,
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
