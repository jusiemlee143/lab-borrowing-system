import connectDB from "../../../../models/utils/db.js";
import User from "@/models/User";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(req) {
  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return new Response(JSON.stringify({ message: "Missing userId or newPassword" }), { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.mustChangePassword = false;

    await user.save();

    return new Response(JSON.stringify({ message: "Password changed successfully" }), { status: 200 });
  } catch (err) {
    console.error("Change password error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}