// route.js
import connectDB from "../../../../models/utils/db.js";
import User from "@/models/User";

connectDB();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 }
      );
    }

    // Find LIC user by email
    const user = await User.findOne({ email, role: "lic" });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    // Compare entered password with hashed password in DB
    const isMatch = await user.matchPassword(password);
    console.log("INPUT PASSWORD:", password);
    console.log("HASH FROM DB:", user.password);
    console.log("MATCH RESULT:", isMatch);

    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    // ✅ Success: send back userId and mustChangePassword flag
    return new Response(
      JSON.stringify({
        message: "Login successful",
        userId: user._id,
        mustChangePassword: user.mustChangePassword,
        fullName: user.fullName,
        email: user.email,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("LIC login error:", err);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}