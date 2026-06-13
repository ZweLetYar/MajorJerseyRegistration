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

    const hasValidRollNo =
      rollNo &&
      typeof rollNo === "object" &&
      typeof rollNo.rollNumber === "number" &&
      rollNo.rollNumber >= 1 &&
      rollNo.rollNumber <= 150;

    // Validation
    if (
      !name ||
      !email ||
      !phone ||
      !year ||
      !hasValidRollNo ||
      !paymentProofUrl
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

    // Duplicate roll number
    const existingRoll = await Student.findOne({
      "rollNo.rollPrefix": rollNo.rollPrefix,
      "rollNo.rollNumber": rollNo.rollNumber,
    });

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
