import { NextResponse } from "next/server";
import connectDB from "@/models/utils/db";
import Request from "@/models/Request";
import Teacher from "@/models/Teacher";
import mongoose from "mongoose";

// ============================================================
// GET ADMIN BORROWING RECORDS
// ============================================================

export async function GET() {
  try {
    await connectDB();

    // ========================================================
    // FETCH REQUESTS
    // ========================================================

    const requests = await Request.find({})
      .sort({
        createdAt: -1,
      })
      .lean();

    // ========================================================
    // FORMAT RECORDS
    // ========================================================

    const records = await Promise.all(
      requests.map(async (request) => {
        // ----------------------------------------------------
        // INSTRUCTOR VALUE
        // ----------------------------------------------------

        let instructor = null;

        const instructorValue = request.instructor;

        // ====================================================
        // CASE 1:
        // instructor is a valid MongoDB ObjectId
        // ====================================================

        if (
          instructorValue &&
          mongoose.Types.ObjectId.isValid(
            instructorValue
          )
        ) {
          instructor = await Teacher.findById(
            instructorValue
          )
            .select(
              "_id name email department"
            )
            .lean();
        }

        // ====================================================
        // CASE 2:
        // instructor is stored as a teacher name
        // Example: "Instructor B"
        // ====================================================

        if (
          !instructor &&
          typeof instructorValue ===
            "string" &&
          instructorValue.trim()
        ) {
          instructor =
            await Teacher.findOne({
              name: {
                $regex: `^${escapeRegex(
                  instructorValue.trim()
                )}$`,
                $options: "i",
              },
            })
              .select(
                "_id name email department"
              )
              .lean();
        }

        // ====================================================
        // CASE 3:
        // Try partial name matching
        // ====================================================

        if (
          !instructor &&
          typeof instructorValue ===
            "string" &&
          instructorValue.trim()
        ) {
          instructor =
            await Teacher.findOne({
              name: {
                $regex: escapeRegex(
                  instructorValue.trim()
                ),
                $options: "i",
              },
            })
              .select(
                "_id name email department"
              )
              .lean();
        }

        // ====================================================
        // INSTRUCTOR NAME FALLBACK
        // ====================================================

        const instructorName =
          instructor?.name ||
          (typeof instructorValue ===
          "string"
            ? instructorValue
            : "N/A");

        // ====================================================
        // CART
        // ====================================================

        const cart = Array.isArray(
          request.cart
        )
          ? request.cart.map((item) => ({
              id:
                item.id?.toString?.() ||
                item._id?.toString?.() ||
                "",
              name:
                item.name || "Unknown Item",
              quantity:
                Number(
                  item.quantity || 0
                ),
            }))
          : [];

        // ====================================================
        // TOTAL ITEMS
        // ====================================================

        const totalItems =
          cart.reduce(
            (total, item) =>
              total +
              Number(
                item.quantity || 0
              ),
            0
          );

        // ====================================================
        // HISTORY
        // ====================================================

        const history = Array.isArray(
          request.history
        )
          ? request.history.map(
              (item) => ({
                _id:
                  item._id?.toString?.() ||
                  undefined,

                action:
                  item.action || "created",

                performedBy:
                  item.performedBy
                    ? item.performedBy.toString()
                    : null,

                performedByName:
                  item.performedByName ||
                  "Unknown",

                performedByEmail:
                  item.performedByEmail ||
                  "",

                performedByEmployeeId:
                  item.performedByEmployeeId ||
                  "",

                performedAt:
                  item.performedAt ||
                  null,

                reason:
                  item.reason || "",

                details:
                  item.details || "",
              })
            )
          : [];

        // ====================================================
        // RETURN FORMATTED RECORD
        // ====================================================

        return {
          _id:
            request._id.toString(),

          // --------------------------------------------------
          // BORROWER
          // --------------------------------------------------

          studentName:
            request.studentName ||
            "N/A",

          section:
            request.section ||
            "N/A",

          groupNumber:
            request.groupNumber ||
            "N/A",

          members:
            Array.isArray(
              request.members
            )
              ? request.members
              : [],

          // --------------------------------------------------
          // ACTIVITY
          // --------------------------------------------------

          date:
            request.date || "",

          activityTitle:
            request.activityTitle ||
            "N/A",

          // --------------------------------------------------
          // INSTRUCTOR
          // --------------------------------------------------

          instructorName,

          instructorEmail:
            instructor?.email ||
            request.instructorEmail ||
            "",

          instructorDepartment:
            instructor?.department ||
            request.instructorDepartment ||
            "",

          instructorId:
            instructor?._id
              ? instructor._id.toString()
              : null,

          // --------------------------------------------------
          // EQUIPMENT
          // --------------------------------------------------

          cart,

          totalItems,

          // --------------------------------------------------
          // STATUS
          // --------------------------------------------------

          status:
            request.status ||
            "pending",

          // --------------------------------------------------
          // APPROVAL
          // --------------------------------------------------

          approvedBy:
            request.approvedBy ||
            "",

          approvedDate:
            request.approvedDate ||
            null,

          // --------------------------------------------------
          // RELEASE
          // --------------------------------------------------

          releasedBy:
            request.releasedBy ||
            "",

          releasedDate:
            request.releasedDate ||
            null,

          // --------------------------------------------------
          // RETURN
          // --------------------------------------------------

          returnedBy:
            request.returnedBy ||
            "",

          returnedDate:
            request.returnedDate ||
            null,

          // --------------------------------------------------
          // REJECTION
          // --------------------------------------------------

          rejectedBy:
            request.rejectedBy ||
            "",

          rejectedDate:
            request.rejectedDate ||
            null,

          rejectReason:
            request.rejectReason ||
            "",

          // --------------------------------------------------
          // HISTORY
          // --------------------------------------------------

          history,

          // --------------------------------------------------
          // TIMESTAMPS
          // --------------------------------------------------

          createdAt:
            request.createdAt ||
            null,

          updatedAt:
            request.updatedAt ||
            null,
        };
      })
    );

    // ========================================================
    // RETURN
    // ========================================================

    return NextResponse.json(
      {
        success: true,
        records,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "============================================================"
    );

    console.error(
      "ADMIN BORROWING RECORDS GET ERROR:"
    );

    console.error(error);

    console.error(
      "============================================================"
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch borrowing records.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// ESCAPE REGEX
// ============================================================

function escapeRegex(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}