import connectDB from "../../../../models/utils/db.js";
import User from "../../../../models/User.js";
import { sendEmail } from "../../../../models/utils/sendEmail.js";

export async function POST(req) {
  try {
    // =====================================================
    // CONNECT DATABASE
    // =====================================================

    await connectDB();

    // =====================================================
    // READ REQUEST BODY
    // =====================================================

    const body = await req.json();

    const {
      fullName,
      employeeId,
      department,
      contactNumber,
      email,
      tempPassword,
    } = body;

    console.log("========================================");
    console.log("CREATE LIC REQUEST");
    console.log("========================================");
    console.log({
      fullName,
      employeeId,
      department,
      contactNumber,
      email,
      hasTempPassword: Boolean(tempPassword),
    });

    // =====================================================
    // NORMALIZE VALUES
    // =====================================================

    const normalizedFullName =
      typeof fullName === "string"
        ? fullName.trim()
        : "";

    const normalizedEmployeeId =
      typeof employeeId === "string"
        ? employeeId.trim()
        : "";

    const normalizedDepartment =
      typeof department === "string"
        ? department.trim()
        : "";

    const normalizedContactNumber =
      typeof contactNumber === "string"
        ? contactNumber.trim()
        : "";

    const normalizedEmail =
      typeof email === "string"
        ? email.trim().toLowerCase()
        : "";

    const normalizedTempPassword =
      typeof tempPassword === "string"
        ? tempPassword.trim()
        : "";

    // =====================================================
    // VALIDATE REQUIRED FIELDS
    // =====================================================

    if (
      !normalizedFullName ||
      !normalizedEmail ||
      !normalizedTempPassword
    ) {
      return new Response(
        JSON.stringify({
          message:
            "Full name, email, and temporary password are required.",
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
    // VALIDATE EMAIL
    // =====================================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return new Response(
        JSON.stringify({
          message:
            "Please provide a valid email address.",
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
    // CHECK EXISTING ACCOUNT
    // =====================================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          message:
            "An account with this email already exists.",
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // =====================================================
    // CREATE LIC ACCOUNT
    // =====================================================

    const newUser = new User({
      fullName: normalizedFullName,

      employeeId:
        normalizedEmployeeId || undefined,

      department:
        normalizedDepartment || undefined,

      contactNumber:
        normalizedContactNumber || undefined,

      email: normalizedEmail,

      password: normalizedTempPassword,

      role: "lic",

      // Account starts as pending.
      emailVerified: false,

      // LIC must change temporary password.
      mustChangePassword: true,
    });

    console.log(
      "Saving new LIC account..."
    );

    // =====================================================
    // SAVE ACCOUNT
    // =====================================================

    await newUser.save();

    console.log(
      "✅ LIC account saved:",
      newUser._id.toString()
    );

    // =====================================================
    // SEND EMAIL
    // =====================================================

    try {
      const logoUrl =
        "https://i.ibb.co/NdjvrFhD/LBS-LOGO-NO-BG.png";

      await sendEmail({
        to: normalizedEmail,

        subject:
          "Laboratory Borrowing System - Your Lab-In-Charge Account",

        text: `
Hello ${normalizedFullName},

Your Lab-In-Charge account for the Laboratory Borrowing Management System has been created.

Your account credentials are:

Email: ${normalizedEmail}
Temporary Password: ${normalizedTempPassword}

Please log in using these credentials and change your password immediately.

Your account will remain pending until you complete the required password change.

For security purposes, do not share your password with anyone.

Laboratory Borrowing Management System
        `.trim(),

        html: `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Lab-In-Charge Account</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f8fafc;
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: #f8fafc;
  "
>
  <tr>
    <td
      align="center"
      style="padding: 40px 15px;"
    >

      <table
        width="600"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
          width: 100%;
          max-width: 600px;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          overflow: hidden;
        "
      >

        <!-- TOP ACCENT -->

        <tr>
          <td
            height="5"
            style="
              height: 5px;
              background-color: #800000;
            "
          >
            &nbsp;
          </td>
        </tr>

        <!-- HEADER -->

        <tr>
          <td
            align="center"
            style="
              padding: 35px 30px 20px 30px;
              text-align: center;
            "
          >

            <table
              width="100"
              height="100"
              cellpadding="0"
              cellspacing="0"
              border="0"
              align="center"
              style="
                width: 100px;
                height: 100px;
                margin: 0 auto 20px auto;
                border: 1px solid #e5c100;
                border-radius: 18px;
                background-color: #ffffff;
              "
            >
              <tr>
                <td
                  width="100"
                  height="100"
                  align="center"
                  valign="middle"
                >
                  <img
                    src="${logoUrl}"
                    alt="Laboratory Borrowing System Logo"
                    width="76"
                    height="76"
                    style="
                      display: block;
                      width: 76px;
                      height: 76px;
                      margin: 0 auto;
                      border: 0;
                    "
                  />
                </td>
              </tr>
            </table>

            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              align="center"
            >
              <tr>
                <td
                  align="center"
                  style="
                    padding: 7px 12px;
                    border-radius: 999px;
                    background-color: #f8eeee;
                    border: 1px solid #ead6d6;
                    color: #800000;
                    font-size: 10px;
                    font-weight: bold;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                  "
                >
                  Laboratory System
                </td>
              </tr>
            </table>

            <h1
              style="
                margin: 18px 0 8px 0;
                color: #800000;
                font-size: 25px;
                line-height: 1.3;
                font-weight: bold;
              "
            >
              Lab-In-Charge Account
            </h1>

            <p
              style="
                margin: 0;
                color: #6b7280;
                font-size: 14px;
                line-height: 1.6;
              "
            >
              Your account has been successfully created.
            </p>

          </td>
        </tr>

        <!-- CONTENT -->

        <tr>
          <td
            style="
              padding: 10px 30px 30px 30px;
            "
          >

            <p
              style="
                margin: 0 0 20px 0;
                font-size: 15px;
                line-height: 1.7;
              "
            >
              Hello
              <strong>${normalizedFullName}</strong>,
            </p>

            <p
              style="
                margin: 0 0 25px 0;
                color: #4b5563;
                font-size: 14px;
                line-height: 1.7;
              "
            >
              Your Lab-In-Charge account for the
              <strong>
                Laboratory Borrowing Management System
              </strong>
              has been created by the system administrator.
            </p>

            <!-- CREDENTIAL CARD -->

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                width: 100%;
                background-color: #fafafa;
                border: 1px solid #e5e7eb;
                border-radius: 14px;
                margin-bottom: 25px;
              "
            >
              <tr>
                <td style="padding: 20px;">

                  <div
                    style="
                      margin-bottom: 15px;
                      color: #800000;
                      font-size: 13px;
                      font-weight: bold;
                      text-transform: uppercase;
                      letter-spacing: 0.8px;
                    "
                  >
                    Your Login Credentials
                  </div>

                  <div
                    style="
                      color: #6b7280;
                      font-size: 11px;
                      margin-bottom: 5px;
                    "
                  >
                    EMAIL ADDRESS
                  </div>

                  <div
                    style="
                      color: #111827;
                      font-size: 14px;
                      font-weight: bold;
                      word-break: break-word;
                      padding-bottom: 15px;
                      border-bottom: 1px solid #e5e7eb;
                    "
                  >
                    ${normalizedEmail}
                  </div>

                  <div
                    style="
                      color: #6b7280;
                      font-size: 11px;
                      margin-top: 15px;
                      margin-bottom: 7px;
                    "
                  >
                    TEMPORARY PASSWORD
                  </div>

                  <span
                    style="
                      display: inline-block;
                      background-color: #800000;
                      color: #FFD700;
                      padding: 9px 13px;
                      border-radius: 8px;
                      font-family: monospace;
                      font-size: 14px;
                      font-weight: bold;
                    "
                  >
                    ${normalizedTempPassword}
                  </span>

                </td>
              </tr>
            </table>

            <!-- IMPORTANT NOTICE -->

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                width: 100%;
                background-color: #fffbea;
                border: 1px solid #f3df83;
                border-radius: 12px;
                margin-bottom: 25px;
              "
            >
              <tr>
                <td style="padding: 15px 16px;">

                  <p
                    style="
                      margin: 0;
                      color: #6b5b00;
                      font-size: 13px;
                      line-height: 1.6;
                    "
                  >
                    <strong>Important:</strong>
                    Please log in using the temporary password
                    and change your password immediately.
                    Your account will remain pending until
                    you complete this required password change.
                  </p>

                </td>
              </tr>
            </table>

            <!-- SECURITY NOTICE -->

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                width: 100%;
                background-color: #f0fdf4;
                border: 1px solid #bbf7d0;
                border-radius: 12px;
                margin-bottom: 25px;
              "
            >
              <tr>
                <td style="padding: 15px 16px;">

                  <p
                    style="
                      margin: 0;
                      color: #166534;
                      font-size: 13px;
                      line-height: 1.6;
                    "
                  >
                    <strong>Security Notice:</strong>
                    Keep your login credentials private and do
                    not share your temporary password with other users.
                  </p>

                </td>
              </tr>
            </table>

            <p
              style="
                margin: 0;
                color: #6b7280;
                font-size: 13px;
                line-height: 1.7;
              "
            >
              If you believe this account was created by mistake,
              please contact the laboratory system administrator.
            </p>

          </td>
        </tr>

        <!-- FOOTER -->

        <tr>
          <td
            align="center"
            style="
              border-top: 1px solid #e5e7eb;
              padding: 20px 30px;
              background-color: #fafafa;
            "
          >

            <p
              style="
                margin: 0;
                color: #6b7280;
                font-size: 11px;
              "
            >
              Laboratory Borrowing Management System
            </p>

            <p
              style="
                margin: 5px 0 0 0;
                color: #9ca3af;
                font-size: 10px;
              "
            >
              Authorized laboratory personnel only
            </p>

          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
        `,
      });

      console.log(
        "✅ LIC account email sent to:",
        normalizedEmail
      );
    } catch (emailError) {
      console.error(
        "⚠️ LIC account was created, but email failed:",
        emailError
      );
    }

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return new Response(
      JSON.stringify({
        message:
          "LIC account created successfully.",

        user: {
          id: newUser._id.toString(),
          fullName: newUser.fullName,
          employeeId: newUser.employeeId,
          department: newUser.department,
          contactNumber: newUser.contactNumber,
          email: newUser.email,
          role: newUser.role,
          emailVerified:
            newUser.emailVerified,
          mustChangePassword:
            newUser.mustChangePassword,
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
    // =====================================================
    // REAL ERROR LOG
    // =====================================================

    console.error(
      "========================================"
    );

    console.error(
      "❌ CREATE LIC ACCOUNT ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(err);

    // =====================================================
    // MONGOOSE VALIDATION ERROR
    // =====================================================

    if (err?.name === "ValidationError") {
      const validationErrors =
        Object.values(err.errors || {}).map(
          (error) => error.message
        );

      return new Response(
        JSON.stringify({
          message:
            "LIC account validation failed.",
          errors: validationErrors,
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
    // DUPLICATE KEY ERROR
    // =====================================================

    if (err?.code === 11000) {
      return new Response(
        JSON.stringify({
          message:
            "An account with this email already exists.",
          duplicate:
            err.keyValue || null,
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // =====================================================
    // GENERAL SERVER ERROR
    // =====================================================

    return new Response(
      JSON.stringify({
        message:
          "Server error while creating LIC account.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? err?.message
            : undefined,
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