import connectDB from "@/models/utils/db";
import Teacher from "@/models/Teacher";
import { NextResponse } from "next/server";

connectDB();

export async function DELETE(req, context) {
  try {
    // ✅ THIS IS THE ONLY CORRECT WAY
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "No ID provided" }, { status: 400 });
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
    }

    await Teacher.findByIdAndDelete(id);

    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    console.error("DELETE TEACHER ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}