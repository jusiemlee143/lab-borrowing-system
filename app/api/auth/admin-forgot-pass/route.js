import { NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/models/utils/db";
import User from "@/models/User";
import { sendEmail } from "@/models/utils/sendEmail";

export async function POST(request) {
  try {
    await connectDB();

    // =====================================================
    // READ REQUEST BODY
    // =====================================================

    const body = await request.json();

    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          message: "Please enter your email address.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // FIND ADMIN ACCOUNT
    // =====================================================

    const user = await User.findOne({
      email,
      role: "admin",
    }).lean();

    // =====================================================
    // SECURITY
    //
    // Do not reveal whether the email belongs to an admin.
    // =====================================================

    if (!user) {
      return NextResponse.json({
        message:
          "If an admin account exists with that email, a password reset link has been sent.",
      });
    }

    // =====================================================
    // GENERATE RESET TOKEN
    // =====================================================

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    // =====================================================
    // HASH TOKEN
    //
    // We store only the hash in MongoDB.
    // The original token is only sent through email.
    // =====================================================

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // =====================================================
    // TOKEN EXPIRATION
    //
    // 15 minutes
    // =====================================================

    const resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // =====================================================
    // SAVE RESET TOKEN
    //
    // IMPORTANT:
    // Use updateOne instead of user.save().
    //
    // user.save() validates the entire User document and
    // your existing admin record is missing fullName.
    // =====================================================

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordExpires: resetPasswordExpires,
        },
      }
    );

    // =====================================================
    // APPLICATION URL
    // =====================================================

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    // =====================================================
    // RESET URL
    //
    // Your page is:
    //
    // app/admin/admin-reset-pass/page.tsx
    //
    // Therefore the URL is:
    //
    // /admin/admin-reset-pass
    // =====================================================

    const resetUrl =
      `${baseUrl}/admin/admin-reset-pass?token=${resetToken}`;

    // =====================================================
    // ADMIN NAME
    //
    // Some older admin records may not have fullName.
    // Use a safe fallback.
    // =====================================================

    const adminName =
      user.fullName || "Administrator";

    // =====================================================
    // SEND EMAIL
    // =====================================================

    await sendEmail({
      to: user.email,

      subject:
        "Lab Borrowing System - Admin Password Reset",

      // ===================================================
      // PLAIN TEXT EMAIL
      // ===================================================

      text: `
Hello ${adminName},

We received a request to reset the password for your administrator account in the Laboratory Borrowing System.

Use the link below to create a new password:

${resetUrl}

This password reset link will expire in 15 minutes.

If you did not request this password reset, you can safely ignore this email.

Laboratory Borrowing System
      `.trim(),

      // ===================================================
      // HTML EMAIL
      // ===================================================

      html: `
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f9fafb;
            padding: 40px 20px;
          "
        >

          <div
            style="
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 16px;
              overflow: hidden;
            "
          >

            <!-- TOP ACCENT -->

            <div
              style="
                height: 5px;
                background: linear-gradient(
                  90deg,
                  #800000,
                  #FFD700,
                  #800000
                );
              "
            ></div>

            <!-- CONTENT -->

            <div
              style="
                padding: 35px;
                color: #1f2937;
              "
            >

              <div
                style="
                  text-align: center;
                  margin-bottom: 25px;
                "
              >

                <h2
                  style="
                    margin: 0;
                    color: #800000;
                    font-size: 24px;
                  "
                >
                  Laboratory Borrowing System
                </h2>

                <p
                  style="
                    margin-top: 6px;
                    color: #6b7280;
                    font-size: 13px;
                  "
                >
                  Administrator Account Recovery
                </p>

              </div>

              <p
                style="
                  font-size: 15px;
                  line-height: 1.6;
                "
              >
                Hello <strong>${adminName}</strong>,
              </p>

              <p
                style="
                  font-size: 15px;
                  line-height: 1.6;
                  color: #4b5563;
                "
              >
                We received a request to reset the password
                for your
                <strong>administrator account</strong>.
              </p>

              <!-- RESET BUTTON -->

              <div
                style="
                  text-align: center;
                  margin: 30px 0;
                "
              >

                <a
                  href="${resetUrl}"
                  style="
                    display: inline-block;
                    padding: 13px 25px;
                    background-color: #800000;
                    color: #FFD700;
                    text-decoration: none;
                    border-radius: 9px;
                    font-weight: bold;
                    font-size: 14px;
                  "
                >
                  Reset Admin Password
                </a>

              </div>

              <!-- EXPIRATION -->

              <div
                style="
                  background-color: #fffaf0;
                  border: 1px solid #f3e5ab;
                  border-radius: 10px;
                  padding: 14px;
                  margin-bottom: 20px;
                "
              >

                <p
                  style="
                    margin: 0;
                    font-size: 13px;
                    color: #6b7280;
                    line-height: 1.5;
                  "
                >
                  🔐 This password reset link will expire
                  in <strong>15 minutes</strong>.
                </p>

              </div>

              <p
                style="
                  font-size: 13px;
                  line-height: 1.6;
                  color: #6b7280;
                "
              >
                If you did not request this password reset,
                you can safely ignore this email.
                Your current password will remain unchanged.
              </p>

              <!-- DIRECT LINK -->

              <p
                style="
                  font-size: 12px;
                  line-height: 1.5;
                  color: #9ca3af;
                  word-break: break-all;
                "
              >
                If the button above does not work, copy and
                paste this link into your browser:
                <br />
                <span style="color: #800000;">
                  ${resetUrl}
                </span>
              </p>

              <hr
                style="
                  margin: 30px 0;
                  border: none;
                  border-top: 1px solid #e5e7eb;
                "
              />

              <p
                style="
                  margin: 0;
                  text-align: center;
                  font-size: 11px;
                  color: #9ca3af;
                "
              >
                Laboratory Borrowing Management System
              </p>

            </div>

          </div>

        </div>
      `,
    });

    // =====================================================
    // SUCCESS
    // =====================================================

    return NextResponse.json({
      message:
        "If an admin account exists with that email, a password reset link has been sent.",
    });

  } catch (error) {
    console.error(
      "ADMIN FORGOT PASSWORD ERROR:",
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