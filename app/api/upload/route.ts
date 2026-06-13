import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Use /api/uploadthing for file uploads",
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Use /api/uploadthing for file uploads",
  });
}
