import connectDB from "../../../../models/utils/db.js";
import User from "@/models/User";

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get information sent by the Create Account page
    const {
      studentId,
      fullName,
      email,
      password,
    } = await req.json();

    // Check required fields
    if (!studentId || !fullName || !email || !password) {
      return new Response(
        JSON.stringify({
          message: "All fields are required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check password length
    if (password.length < 8) {
      return new Response(
        JSON.stringify({
          message: "Password must be at least 8 characters",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Clean the information
    const cleanStudentId = studentId.trim();
    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check if Student ID already exists
    const existingStudent = await User.findOne({
      studentId: cleanStudentId,
    });

    if (existingStudent) {
      return new Response(
        JSON.stringify({
          message: "Student ID is already registered",
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check if email already exists
    const existingEmail = await User.findOne({
      email: cleanEmail,
    });

    if (existingEmail) {
      return new Response(
        JSON.stringify({
          message: "Email address is already registered",
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Create the student
    //
    // IMPORTANT:
    // We do NOT hash the password here.
    // User.js automatically hashes it using the pre-save hook.
    const user = await User.create({
      studentId: cleanStudentId,
      fullName: cleanFullName,
      email: cleanEmail,
      password: password,
      role: "student",
      mustChangePassword: false,
      emailVerified: false,
    });

    console.log("Student account created:", user.email);

    return new Response(
      JSON.stringify({
        message: "Student account created successfully",
        user: {
          id: user._id,
          studentId: user.studentId,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Student registration error:", err);

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