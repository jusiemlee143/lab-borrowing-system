import connectDB from "../../../../models/utils/db.js";
import User from "../../../../models/User.js";
import { sendEmail } from "@/models/utils/sendEmail.js";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

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

    // Create student account
    const user = await User.create({
      studentId: cleanStudentId,
      fullName: cleanFullName,
      email: cleanEmail,
      password,
      role: "student",
      mustChangePassword: false,
      emailVerified: false,
    });

    console.log("✅ Student account created:", user.email);

    // Create email verification token
    const verificationToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        purpose: "email-verification",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Create verification link
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const verificationUrl =
      `${appUrl}/api/auth/verify-email?token=${encodeURIComponent(
        verificationToken
      )}`;

    // Send verification email using your EXISTING sendEmail.js
    await sendEmail({
      to: user.email,
      subject: "Verify Your Student Account",
      text: `
Hello ${user.fullName},

Thank you for registering for the Lab Borrowing System.

Please verify your email address by clicking this link:

${verificationUrl}

This verification link will expire in 24 hours.

If you did not create this account, please ignore this email.
      `,
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 12px;
        ">

          <h2 style="color: #800000;">
            Lab Borrowing System
          </h2>

          <p>
            Hello <strong>${user.fullName}</strong>,
          </p>

          <p>
            Thank you for registering for the Lab Borrowing System.
          </p>

          <p>
            Please verify your email address by clicking
            the button below:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a
              href="${verificationUrl}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #800000;
                color: #FFD700;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
              "
            >
              Verify My Email
            </a>
          </div>

          <p>
            This verification link will expire in
            <strong>24 hours</strong>.
          </p>

          <p style="color: #777; font-size: 13px;">
            If you did not create this account, you can
            safely ignore this email.
          </p>

        </div>
      `,
    });

    console.log("✅ Verification email sent to:", user.email);

    return new Response(
      JSON.stringify({
        message:
          "Account created successfully. Please check your email to verify your account.",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  } catch (err) {
    console.error("❌ Student registration error:", err);

    return new Response(
      JSON.stringify({
        message: "Server error",
        error: err.message,
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