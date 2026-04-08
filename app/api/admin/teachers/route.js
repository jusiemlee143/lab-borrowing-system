import connectDB from "@/models/utils/db"; // ✅ use same as other routes
import Teacher from "@/models/Teacher";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const teachers = await Teacher.find();
    return NextResponse.json(teachers);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch teachers" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const teacher = await Teacher.create({
      name: body.name,
      email: body.email,
    });
    return NextResponse.json(teacher);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to add teacher" }, { status: 500 });
  }
}