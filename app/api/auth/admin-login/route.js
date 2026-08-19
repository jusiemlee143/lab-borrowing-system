import connectDB from "../../../../models/utils/db.js";
import User from "@/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // =====================================================
    // CONNECT TO DATABASE
    // =====================================================

    await connectDB();

    // =====================================================
    // GET LOGIN DATA
    // =====================================================

    const { email, password } = await req.json();

    // =====================================================
    // VALIDATE INPUT
    // =====================================================

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // FIND ADMIN USER
    // =====================================================

    const user = await User.findOne({
      email,
      role: "admin",
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid credentials.",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // CHECK PASSWORD
    // =====================================================

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("==================================");
    console.log("ADMIN LOGIN");
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("Password Match:", isMatch);
    console.log("==================================");

    if (!isMatch) {
      return NextResponse.json(
        {
          message: "Invalid credentials.",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // JWT SECRET CHECK
    // =====================================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is not configured."
      );

      return NextResponse.json(
        {
          message: "Server configuration error.",
        },
        {
          status: 500,
        }
      );
    }

    // =====================================================
    // CREATE ADMIN JWT
    //
    // IMPORTANT:
    // Use "userId" instead of "id".
    //
    // proxy.ts expects:
    // decoded.userId
    // decoded.role
    // =====================================================

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        mustChangePassword:
          user.mustChangePassword || false,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // =====================================================
    // CREATE RESPONSE
    // =====================================================

    const response = NextResponse.json(
      {
        message: "Login successful",
        userId: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        mustChangePassword:
          user.mustChangePassword || false,
      },
      {
        status: 200,
      }
    );

    // =====================================================
    // SET ADMIN COOKIE
    //
    // ADMIN -> token
    // LIC   -> licToken
    //
    // They are intentionally separate so both accounts
    // can be logged in at the same time.
    // =====================================================

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    console.log("==================================");
    console.log("ADMIN LOGIN SUCCESSFUL");
    console.log("User:", user.fullName);
    console.log("Role:", user.role);
    console.log("User ID:", user._id.toString());
    console.log("ADMIN COOKIE SET: token");
    console.log("==================================");

    // =====================================================
    // RETURN RESPONSE
    // =====================================================

    return response;
  } catch (err) {
    console.error("==================================");
    console.error("ADMIN LOGIN ERROR:");
    console.error(err);
    console.error("==================================");

    return NextResponse.json(
      {
        message: "Server error.",
      },
      {
        status: 500,
      }
    );
  }
}