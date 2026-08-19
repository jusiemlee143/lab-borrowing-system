import connectDB from "@/models/utils/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // =====================================================
    // VALIDATE INPUT
    // =====================================================

    if (!email || !password) {
      return Response.json(
        {
          message: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // FIND LIC USER
    // =====================================================

    const user = await User.findOne({
      email,
      role: "lic",
    });

    if (!user) {
      return Response.json(
        {
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // CHECK PASSWORD
    // =====================================================

    const isMatch = await user.matchPassword(password);

    console.log("MATCH RESULT:", isMatch);

    if (!isMatch) {
      return Response.json(
        {
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // CREATE JWT
    // =====================================================

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // =====================================================
    // SET LIC COOKIE
    // =====================================================

    const cookieStore = await cookies();

    cookieStore.set("licToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    console.log("==================================");
    console.log("LIC LOGIN SUCCESSFUL");
    console.log("User:", user.fullName);
    console.log("Role:", user.role);
    console.log("LIC COOKIE SET");
    console.log("==================================");

    // =====================================================
    // RESPONSE
    // =====================================================

    return Response.json(
      {
        message: "Login successful",
        userId: user._id,
        mustChangePassword: user.mustChangePassword,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("LIC login error:", err);

    return Response.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}