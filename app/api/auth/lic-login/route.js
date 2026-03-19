// route.js
import connectDB from "../../../../models/utils/db.js";
import User from "@/models/User";
import jwt from "jsonwebtoken";

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

    // ✅ Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Set token cookie (HttpOnly so JS cannot read it)
    const res = new Response(
      JSON.stringify({
        message: "Login successful",
        userId: user._id,
        mustChangePassword: user.mustChangePassword,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }),
      { status: 200 }
    );

    res.headers.append(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
        24 * 60 * 60
      }`
    );

    return res;
  } catch (err) {
    console.error("LIC login error:", err);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}