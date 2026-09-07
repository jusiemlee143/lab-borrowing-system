import connectDB from "../../../../models/utils/db.js";
import User from "@/models/User";

connectDB();

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, newPassword } = body;

    console.log("CHANGE PASSWORD BODY:", body);

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!userId || !newPassword) {
      return new Response(
        JSON.stringify({
          message: "Missing userId or newPassword",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findById(userId);

    if (!user) {
      return new Response(
        JSON.stringify({
          message: "User not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // =====================================================
    // MAKE SURE THIS IS A LIC ACCOUNT
    // =====================================================

    if (user.role !== "lic") {
      return new Response(
        JSON.stringify({
          message: "Only Lab-In-Charge accounts can use this endpoint.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    user.password = newPassword;

    // LIC has completed first-time account setup
    user.mustChangePassword = false;

    // Account is now verified
    user.emailVerified = true;

    await user.save();

    // =====================================================
    // RESPONSE
    // =====================================================

    return new Response(
      JSON.stringify({
        message: "Password changed successfully",
        verified: true,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error(
      "Change password error:",
      err
    );

    return new Response(
      JSON.stringify({
        message: "Server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}