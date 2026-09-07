import connectDB from "@/models/utils/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const licUsers = await User.find({ role: "lic" })
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json(licUsers, { status: 200 });
  } catch (err) {
    console.error("Fetch LIC accounts error:", err);

    return NextResponse.json(
      {
        message: "Failed to fetch LIC accounts.",
      },
      {
        status: 500,
      }
    );
  }
}