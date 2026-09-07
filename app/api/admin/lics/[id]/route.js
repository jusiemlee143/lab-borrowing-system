import { NextResponse } from "next/server";
import connectDB from "@/models/utils/db";
import User from "@/models/User";
import mongoose from "mongoose";

// ============================================================
// UPDATE LIC ACCOUNT
// PATCH /api/admin/lics/[id]
// ============================================================

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    // ============================================================
    // GET ACCOUNT ID
    // ============================================================

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Account ID is required.",
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
          message: "Invalid account ID.",
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

    const fullName =
      typeof body.fullName === "string"
        ? body.fullName.trim()
        : "";

    const employeeId =
      typeof body.employeeId === "string"
        ? body.employeeId.trim()
        : "";

    const department =
      typeof body.department === "string"
        ? body.department.trim()
        : "";

    const contactNumber =
      typeof body.contactNumber === "string"
        ? body.contactNumber.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    // ============================================================
    // VALIDATION
    // ============================================================

    if (!fullName) {
      return NextResponse.json(
        {
          message: "Full name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!employeeId) {
      return NextResponse.json(
        {
          message: "Employee ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!department) {
      return NextResponse.json(
        {
          message: "Department is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!contactNumber) {
      return NextResponse.json(
        {
          message: "Contact number is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !/^\d{11}$/.test(contactNumber) ||
      !contactNumber.startsWith("09")
    ) {
      return NextResponse.json(
        {
          message:
            "Contact number must be an 11-digit Philippine mobile number starting with 09.",
        },
        {
          status: 400,
        }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          message: "Email address is required.",
        },
        {
          status: 400,
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          message: "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // FIND LIC ACCOUNT
    // ============================================================

    const existingAccount = await User.findById(id);

    if (!existingAccount) {
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
    // MAKE SURE THIS IS A LIC ACCOUNT
    // ============================================================

    if (existingAccount.role !== "lic") {
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
    // CHECK DUPLICATE EMPLOYEE ID
    // ============================================================

    const duplicateEmployeeId = await User.findOne({
      employeeId,
      _id: {
        $ne: existingAccount._id,
      },
    });

    if (duplicateEmployeeId) {
      return NextResponse.json(
        {
          message:
            "Another account is already using this employee ID.",
        },
        {
          status: 409,
        }
      );
    }

    // ============================================================
    // CHECK DUPLICATE EMAIL
    // ============================================================

    const duplicateEmail = await User.findOne({
      email,
      _id: {
        $ne: existingAccount._id,
      },
    });

    if (duplicateEmail) {
      return NextResponse.json(
        {
          message:
            "Another account is already using this email address.",
        },
        {
          status: 409,
        }
      );
    }

    // ============================================================
    // UPDATE ACCOUNT
    // ============================================================

    const emailChanged = existingAccount.email !== email;

    existingAccount.fullName = fullName;
    existingAccount.employeeId = employeeId;
    existingAccount.department = department;
    existingAccount.contactNumber = contactNumber;
    existingAccount.email = email;

    // ============================================================
    // RESET ACCOUNT STATE IF EMAIL WAS CHANGED
    // ============================================================

    if (emailChanged) {
      // New email must be verified again
      existingAccount.emailVerified = false;

      // LIC must change their password again
      existingAccount.mustChangePassword = true;
    }

    /*
     * IMPORTANT:
     *
     * We intentionally DO NOT modify:
     *
     * - password
     * - role
     * - emailVerified (unless email changed)
     * - mustChangePassword (unless email changed)
     * - resetPasswordToken
     * - resetPasswordExpires
     * - isActive
     *
     * Account activation/deactivation is handled
     * separately through:
     *
     * PATCH /api/admin/toggle-lic/[id]
     */

    await existingAccount.save();

    // ============================================================
    // RESPONSE
    // ============================================================

    return NextResponse.json(
      {
        message: "Lab-in-Charge account updated successfully.",

        account: {
          _id: existingAccount._id,
          fullName: existingAccount.fullName,
          employeeId: existingAccount.employeeId,
          department: existingAccount.department,
          contactNumber: existingAccount.contactNumber,
          email: existingAccount.email,
          emailVerified: existingAccount.emailVerified,
          role: existingAccount.role,
          mustChangePassword: existingAccount.mustChangePassword,
          isActive: existingAccount.isActive,
          createdAt: existingAccount.createdAt,
          updatedAt: existingAccount.updatedAt,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Update LIC account error:", error);

    // ============================================================
    // MONGODB DUPLICATE KEY ERROR
    // ============================================================

    if (error && error.code === 11000) {
      return NextResponse.json(
        {
          message:
            "An account with the same email or employee ID already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // ============================================================
    // GENERAL ERROR
    // ============================================================

    return NextResponse.json(
      {
        message: "Failed to update Lab-in-Charge account.",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// DELETE LIC ACCOUNT
// DELETE /api/admin/lics/[id]
// ============================================================

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // ============================================================
    // GET ACCOUNT ID
    // ============================================================

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Account ID is required.",
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
          message: "Invalid account ID.",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // FIND LIC ACCOUNT
    // ============================================================

    const existingAccount = await User.findById(id);

    if (!existingAccount) {
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
    // MAKE SURE THIS IS A LIC ACCOUNT
    // ============================================================

    if (existingAccount.role !== "lic") {
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
    // SAVE ACCOUNT INFORMATION FOR RESPONSE
    // ============================================================

    const deletedAccount = {
      _id: existingAccount._id,
      fullName: existingAccount.fullName,
      employeeId: existingAccount.employeeId,
      email: existingAccount.email,
    };

    // ============================================================
    // DELETE ACCOUNT
    // ============================================================

    await User.findByIdAndDelete(id);

    // ============================================================
    // RESPONSE
    // ============================================================

    return NextResponse.json(
      {
        message: "Lab-in-Charge account deleted successfully.",
        account: deletedAccount,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Delete LIC account error:", error);

    // ============================================================
    // GENERAL ERROR
    // ============================================================

    return NextResponse.json(
      {
        message: "Failed to delete Lab-in-Charge account.",
      },
      {
        status: 500,
      }
    );
  }
}