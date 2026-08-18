import connectDB from "../../../../models/utils/db.js";
import User from "../../../../models/User.js";
import { sendEmail } from "../../../../models/utils/sendEmail.js";

connectDB();

export async function POST(req) {
  try {
    const {
      fullName,
      employeeId,
      department,
      contactNumber,
      email,
      tempPassword,
    } = await req.json();

    // =====================================================
    // VALIDATE REQUIRED FIELDS
    // =====================================================

    if (!fullName || !email || !tempPassword) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields.",
        }),
        { status: 400 }
      );
    }

    // =====================================================
    // REMOVE EXISTING LIC WITH SAME EMAIL
    // =====================================================

    await User.deleteOne({
      email: email.toLowerCase(),
      role: "lic",
    });

    // =====================================================
    // CREATE LIC ACCOUNT
    // =====================================================

    const newUser = new User({
      fullName,
      employeeId,
      department,
      contactNumber,
      email: email.toLowerCase(),
      password: tempPassword,
      role: "lic",
      mustChangePassword: true,
    });

    // User model automatically hashes the password
    // through the pre-save middleware.
    await newUser.save();

    // =====================================================
    // SEND EMAIL
    // =====================================================

    try {
      const logoUrl =
        "https://i.ibb.co/NdjvrFhD/LBS-LOGO-NO-BG.png";

      await sendEmail({
        to: email,

        subject:
          "Laboratory Borrowing System - Your Lab-In-Charge Account",

        // =================================================
        // PLAIN TEXT VERSION
        // =================================================

        text: `
Hello ${fullName},

Your Lab-In-Charge account for the Laboratory Borrowing Management System has been created.

Your account credentials are:

Email: ${email}
Temporary Password: ${tempPassword}

Please log in using these credentials and change your password immediately.

For security purposes, do not share your password with anyone.

Laboratory Borrowing Management System
        `.trim(),

        // =================================================
        // HTML EMAIL
        // =================================================

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

  <!-- ================================================= -->
  <!-- EMAIL OUTER CONTAINER -->
  <!-- ================================================= -->

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
        style="
          padding: 40px 15px;
        "
      >

        <!-- ================================================= -->
        <!-- MAIN CARD -->
        <!-- ================================================= -->

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

          <!-- ============================================= -->
          <!-- TOP ACCENT -->
          <!-- ============================================= -->

          <tr>

            <td
              height="5"
              style="
                height: 5px;
                line-height: 5px;
                font-size: 0;
                background-color: #800000;
              "
            >
              &nbsp;
            </td>

          </tr>


          <!-- ============================================= -->
          <!-- HEADER -->
          <!-- ============================================= -->

          <tr>

            <td
              align="center"
              style="
                padding: 35px 30px 20px 30px;
                text-align: center;
              "
            >

              <!-- ========================================= -->
              <!-- LOGO CONTAINER -->
              <!-- ========================================= -->

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
                    style="
                      width: 100px;
                      height: 100px;
                      text-align: center;
                      vertical-align: middle;
                      padding: 0;
                    "
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
                        outline: none;
                        text-decoration: none;
                        object-fit: contain;
                      "
                    />

                  </td>

                </tr>

              </table>


              <!-- ========================================= -->
              <!-- SYSTEM LABEL -->
              <!-- ========================================= -->

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
                      text-align: center;
                    "
                  >
                    Laboratory System
                  </td>

                </tr>

              </table>


              <!-- ========================================= -->
              <!-- TITLE -->
              <!-- ========================================= -->

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


          <!-- ============================================= -->
          <!-- CONTENT -->
          <!-- ============================================= -->

          <tr>

            <td
              style="
                padding: 10px 30px 30px 30px;
              "
            >

              <!-- GREETING -->

              <p
                style="
                  margin: 0 0 20px 0;
                  font-size: 15px;
                  line-height: 1.7;
                  color: #1f2937;
                "
              >
                Hello
                <strong>${fullName}</strong>,
              </p>


              <!-- DESCRIPTION -->

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


              <!-- ========================================= -->
              <!-- CREDENTIAL CARD -->
              <!-- ========================================= -->

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

                  <td
                    style="
                      padding: 20px;
                    "
                  >

                    <!-- CARD TITLE -->

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


                    <!-- ================================= -->
                    <!-- EMAIL -->
                    <!-- ================================= -->

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >

                      <tr>

                        <td
                          style="
                            padding: 13px 0;
                            border-bottom: 1px solid #e5e7eb;
                          "
                        >

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
                            "
                          >
                            ${email}
                          </div>

                        </td>

                      </tr>

                    </table>


                    <!-- ================================= -->
                    <!-- TEMPORARY PASSWORD -->
                    <!-- ================================= -->

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >

                      <tr>

                        <td
                          style="
                            padding: 13px 0 0 0;
                          "
                        >

                          <div
                            style="
                              color: #6b7280;
                              font-size: 11px;
                              margin-bottom: 7px;
                            "
                          >
                            TEMPORARY PASSWORD
                          </div>


                          <table
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                          >

                            <tr>

                              <td
                                style="
                                  background-color: #800000;
                                  color: #FFD700;
                                  padding: 9px 13px;
                                  border-radius: 8px;
                                  font-family: monospace;
                                  font-size: 14px;
                                  font-weight: bold;
                                  letter-spacing: 0.5px;
                                "
                              >
                                ${tempPassword}
                              </td>

                            </tr>

                          </table>

                        </td>

                      </tr>

                    </table>

                  </td>

                </tr>

              </table>


              <!-- ========================================= -->
              <!-- IMPORTANT NOTICE -->
              <!-- ========================================= -->

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

                  <td
                    style="
                      padding: 15px 16px;
                    "
                  >

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

                    </p>

                  </td>

                </tr>

              </table>


              <!-- ========================================= -->
              <!-- SECURITY NOTICE -->
              <!-- ========================================= -->

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

                  <td
                    style="
                      padding: 15px 16px;
                    "
                  >

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


              <!-- CLOSING -->

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


          <!-- ============================================= -->
          <!-- FOOTER -->
          <!-- ============================================= -->

          <tr>

            <td
              align="center"
              style="
                border-top: 1px solid #e5e7eb;
                padding: 20px 30px;
                text-align: center;
                background-color: #fafafa;
              "
            >

              <p
                style="
                  margin: 0;
                  color: #6b7280;
                  font-size: 11px;
                  line-height: 1.5;
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

      console.log("✅ LIC account email sent to:", email);

    } catch (emailError) {
      console.error(
        "❌ Failed to send LIC account email:",
        emailError
      );

      // Account creation still succeeds even if
      // email sending fails.
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return new Response(
      JSON.stringify({
        message: "LIC account created",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  } catch (err) {

    console.error(
      "❌ Create LIC error:",
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