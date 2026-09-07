import { NextResponse } from "next/server";
import connectDB from "@/models/utils/db";
import User from "@/models/User";
import mongoose from "mongoose";

export async function PATCH(request, { params }) {
  try {
    // ============================================================
    // CONNECT TO DATABASE
    // ============================================================

    await connectDB();

    // ============================================================
    // GET ACCOUNT ID
    // ============================================================

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          message: "LIC account ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // VALIDATE MONGODB OBJECT ID
    // ============================================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid LIC account ID.",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // GET REQUEST BODY
    // ============================================================

    const body = await request.json();

    // ============================================================
    // VALIDATE isActive
    // ============================================================

    if (typeof body.isActive !== "boolean") {
      return NextResponse.json(
        {
          message: "isActive must be either true or false.",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // FIND LIC ACCOUNT
    // ============================================================

    const licAccount = await User.findById(id);

    if (!licAccount) {
      return NextResponse.json(
        {
          message: "Lab-in-Charge account not found.",
        },
        {
          status: 404,
        }
      );
    }

    // ============================================================
    // MAKE SURE ACCOUNT IS LIC
    // ============================================================

    if (licAccount.role !== "lic") {
      return NextResponse.json(
        {
          message: "This account is not a Lab-in-Charge account.",
        },
        {
          status: 403,
        }
      );
    }

    // ============================================================
    // UPDATE ACCOUNT STATUS
    // ============================================================

    licAccount.isActive = body.isActive;

    await licAccount.save();

    // ============================================================
    // RESPONSE
    // ============================================================

    return NextResponse.json(
      {
        message: body.isActive
          ? "Lab-in-Charge account enabled successfully."
          : "Lab-in-Charge account disabled successfully.",

        account: {
          _id: licAccount._id,
          fullName: licAccount.fullName,
          employeeId: licAccount.employeeId,
          department: licAccount.department,
          contactNumber: licAccount.contactNumber,
          email: licAccount.email,
          emailVerified: licAccount.emailVerified,
          role: licAccount.role,
          mustChangePassword: licAccount.mustChangePassword,
          isActive: licAccount.isActive,
          createdAt: licAccount.createdAt,
          updatedAt: licAccount.updatedAt,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Toggle LIC account status error:", error);

    return NextResponse.json(
      {
        message: "Failed to change LIC account status.",
      },
      {
        status: 500,
      }
    );
  }
}