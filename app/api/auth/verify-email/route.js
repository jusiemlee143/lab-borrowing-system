import connectDB from "../../../../models/utils/db.js";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // Get the token from the email link
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    // No token
    if (!token) {
      return NextResponse.redirect(
        new URL(
          "/student/login?error=missing-token",
          req.url
        )
      );
    }

    // Check if the token is valid
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Make sure this token is specifically
    // an email verification token
    if (decoded.purpose !== "email-verification") {
      return NextResponse.redirect(
        new URL(
          "/student/login?error=invalid-token",
          req.url
        )
      );
    }

    // Find the student
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.redirect(
        new URL(
          "/student/login?error=user-not-found",
          req.url
        )
      );
    }

    // Make sure the email matches
    if (user.email !== decoded.email) {
      return NextResponse.redirect(
        new URL(
          "/student/login?error=invalid-token",
          req.url
        )
      );
    }

    // If already verified
    if (user.emailVerified) {
      return NextResponse.redirect(
        new URL(
          "/student/login?verified=already",
          req.url
        )
      );
    }

    // Mark the student's email as verified
    user.emailVerified = true;

    await user.save();

    console.log(
      "Email verified successfully:",
      user.email
    );

    // Send student back to login
    return NextResponse.redirect(
      new URL(
        "/student/login?verified=true",
        req.url
      )
    );

  } catch (error) {
    console.error(
      "Email verification error:",
      error
    );

    // Verification link expired
    if (error.name === "TokenExpiredError") {
      return NextResponse.redirect(
        new URL(
          "/student/login?error=expired-token",
          req.url
        )
      );
    }

    // Invalid token
    return NextResponse.redirect(
      new URL(
        "/student/login?error=invalid-token",
        req.url
      )
    );
  }
}