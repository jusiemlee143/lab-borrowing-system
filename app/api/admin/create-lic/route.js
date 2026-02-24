import connectDB from "../../../../models/utils/db.js";
import User from "../../../../models/User.js";
import nodemailer from "nodemailer";

connectDB();

export async function POST(req) {
  try {
    const { fullName, employeeId, department, contactNumber, email, tempPassword } =
      await req.json();

    // Remove any existing LIC with same email
    await User.deleteOne({ email, role: "lic" });

    // Create LIC with hashed password via pre-save middleware
    const newUser = new User({
      fullName,
      employeeId,
      department,
      contactNumber,
      email,
      password: tempPassword, // plain text → will be hashed automatically
      role: "lic",
      mustChangePassword: true,
    });
    await newUser.save();

    // Send email with credentials
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Lab-in-Charge Account",
        html: `
          <p>Hello ${fullName},</p>
          <p>Your LIC account has been created.</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          <p>Please log in and change your password immediately.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Email sent to", email);
    } catch (err) {
      console.error("Failed to send email:", err);
    }

    return new Response(
      JSON.stringify({ message: "LIC account created" }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Create LIC error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
