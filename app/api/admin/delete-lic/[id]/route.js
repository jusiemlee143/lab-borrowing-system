import connectDB from "@/models/utils/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

connectDB();

export async function DELETE(req, context) {
  try {
    // ✅ SAME FIX
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "No ID provided" }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "LIC not found" }, { status: 404 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "LIC deleted successfully" });
  } catch (err) {
    console.error("DELETE LIC ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}