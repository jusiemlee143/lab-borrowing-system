import connectDB from "../../../../models/utils/db.js";
import User from "../../../../models/User.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // ==========================================
    // CONNECT TO DATABASE
    // ==========================================

    await connectDB();

    // ==========================================
    // GET LOGIN DATA
    // ==========================================

    const body = await req.json();

    console.log("=================================");
    console.log("STUDENT LOGIN REQUEST");
    console.log("Received:", {
      studentId: body.studentId,
      identifier: body.identifier,
      passwordProvided: !!body.password,
    });
    console.log("=================================");

    /*
      Accept BOTH studentId and identifier.

      This allows your existing Student Login UI
      to remain unchanged.
    */

    const studentId = body.studentId || body.identifier;
    const password = body.password;

    // ==========================================
    // CHECK REQUIRED FIELDS
    // ==========================================

    if (!studentId || !password) {
      console.log("❌ Missing Student ID or password");

      return NextResponse.json(
        {
          message: "Student ID and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // CLEAN STUDENT ID
    // ==========================================

    const cleanStudentId = studentId.trim();

    console.log(
      "Looking for Student ID:",
      cleanStudentId
    );

    // ==========================================
    // FIND STUDENT
    // ==========================================

    const user = await User.findOne({
      studentId: cleanStudentId,
      role: "student",
    });

    // ==========================================
    // STUDENT NOT FOUND
    // ==========================================

    if (!user) {
      console.log(
        "❌ Student not found:",
        cleanStudentId
      );

      return NextResponse.json(
        {
          message: "Invalid Student ID or Password.",
        },
        {
          status: 401,
        }
      );
    }

    // ==========================================
    // STUDENT FOUND
    // ==========================================

    console.log("✅ Student found");
    console.log("Student ID:", user.studentId);
    console.log("Full Name:", user.fullName);
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log(
      "Email Verified:",
      user.emailVerified
    );

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    const isMatch =
      await user.matchPassword(password);

    console.log(
      "Password Match:",
      isMatch
    );

    if (!isMatch) {
      console.log("❌ Password does not match");

      return NextResponse.json(
        {
          message: "Invalid Student ID or Password.",
        },
        {
          status: 401,
        }
      );
    }

    console.log("✅ Password is correct");

    // ==========================================
    // CHECK EMAIL VERIFICATION
    // ==========================================

    if (user.emailVerified !== true) {
      console.log(
        "❌ Email has NOT been verified"
      );

      return NextResponse.json(
        {
          message:
            "Please verify your email address before logging in.",
        },
        {
          status: 403,
        }
      );
    }

    console.log("✅ Email is verified");

    // ==========================================
    // CREATE JWT
    // ==========================================

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // ==========================================
    // CREATE RESPONSE
    // ==========================================

    const response = NextResponse.json(
      {
        message: "Login successful",
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        studentId: user.studentId,
        userId: user._id.toString(),
      },
      {
        status: 200,
      }
    );

    // ==========================================
    // SAVE JWT COOKIE
    // ==========================================

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    console.log("=================================");
    console.log("🎉 STUDENT LOGIN SUCCESSFUL");
    console.log("=================================");

    return response;

  } catch (err) {
    console.error(
      "❌ Student login error:",
      err
    );

    return NextResponse.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}