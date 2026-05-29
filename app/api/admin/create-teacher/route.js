// app/api/admin/create-teacher/route.js
import connectDB from "@/models/utils/db"
import Teacher from "@/models/Teacher"
import { NextResponse } from "next/server"

connectDB()

export async function POST(req) {
  try {
    const { name, email } = await req.json()
    if (!name || !email) return NextResponse.json({ message: "Name and email required" }, { status: 400 })

    const existing = await Teacher.findOne({ email })
    if (existing) return NextResponse.json({ message: "Teacher already exists" }, { status: 400 })

    const teacher = await Teacher.create({ name, email })
    return NextResponse.json({ message: "Teacher added successfully", teacher }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}