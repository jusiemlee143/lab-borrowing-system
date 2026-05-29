import connectDB from "@/models/utils/db"
import User from "@/models/User"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()

    const licUsers = await User.find({ role: "lic" }).select("-password")

    return NextResponse.json(licUsers)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Failed to fetch LIC" }, { status: 500 })
  }
}