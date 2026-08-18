import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import connectDB from "@/models/utils/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();

    // =====================================================
    // READ REQUEST BODY
    // =====================================================

    const body = await request.json();

    const token = body.token?.trim();
    const password = body.password;

    // =====================================================
    // VALIDATE INPUT
    // =====================================================

    if (!token) {
      return NextResponse.json(
        {
          message: "Invalid or missing password reset token.",
        },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          message: "Please enter a new password.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // PASSWORD REQUIREMENTS
    // =====================================================

    if (password.length < 8) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // HASH THE TOKEN
    //
    // The email contains the original token.
    // MongoDB stores only the SHA-256 hash.
    // =====================================================

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // =====================================================
    // FIND ADMIN WITH VALID TOKEN
    //
    // The token must:
    // 1. Match the stored hash
    // 2. Not be expired
    // 3. Belong to an admin account
    // =====================================================

    const user = await User.findOne({
      role: "admin",
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    }).lean();

    // =====================================================
    // INVALID / EXPIRED TOKEN
    // =====================================================

    if (!user) {
      return NextResponse.json(
        {
          message:
            "This password reset link is invalid or has expired.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // HASH NEW PASSWORD
    //
    // IMPORTANT:
    // We are using updateOne(), so the User model's
    // pre("save") middleware will NOT run.
    //
    // Therefore we manually hash the password here.
    // =====================================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // =====================================================
    // UPDATE PASSWORD
    //
    // updateOne() avoids validating the existing document's
    // required fields such as fullName.
    //
    // We also remove the reset token immediately so that
    // the link can only be used once.
    // =====================================================

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          password: hashedPassword,
        },

        $unset: {
          resetPasswordToken: "",
          resetPasswordExpires: "",
        },
      }
    );

    // =====================================================
    // SUCCESS
    // =====================================================

    return NextResponse.json(
      {
        message:
          "Your admin password has been reset successfully.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(
      "ADMIN RESET PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}