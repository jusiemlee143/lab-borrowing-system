import connectDB from "../../../../models/utils/db.js";
import User from "@/models/User";

connectDB();

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, newPassword } = body;

    console.log("CHANGE PASSWORD BODY:", body);

    // ✅ validation
    if (!userId || !newPassword) {
      return new Response(
        JSON.stringify({ message: "Missing userId or newPassword" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // ✅ assign new password directly, let the model hash it
    user.password = newPassword;
    user.mustChangePassword = false;

    await user.save();

    return new Response(
      JSON.stringify({ message: "Password changed successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Change password error:", err);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}