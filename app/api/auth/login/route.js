// route.js
import connectDB from "../../../../models/utils/db.js";
import User from "../../../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Create response
    const response = NextResponse.json({
      message: "Login successful",
      role: user.role,
    });

    // ✅ IMPORTANT: store token in cookie (middleware will read this)
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;

  } catch (err) {
    console.error("Login error:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}