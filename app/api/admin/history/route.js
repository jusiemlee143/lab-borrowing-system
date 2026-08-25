import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/models/utils/db";
import Request from "@/models/Request";
import Teacher from "@/models/Teacher";
import User from "@/models/User";

// ============================================================
// GET ADMIN HISTORY / AUDIT LOGS
// ============================================================

export async function GET() {
  try {
    await connectDB();

    console.log("==============================================");
    console.log("ADMIN HISTORY API");
    console.log("==============================================");

    // ========================================================
    // FETCH REQUESTS
    //
    // IMPORTANT:
    // We intentionally DO NOT populate instructor here.
    //
    // Some older Request documents contain values such as:
    // "Instructor B"
    //
    // while newer documents contain a Teacher ObjectId.
    //
    // Populating directly would cause:
    //
    // Cast to ObjectId failed for value "Instructor B"
    //
    // ========================================================

    const requests = await Request.find({})
      .populate({
        path: "history.performedBy",
        model: User,
        select: "_id fullName email employeeId role",
      })
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log(
      "Requests found:",
      requests.length
    );

    // ========================================================
    // GET ALL TEACHERS
    // ========================================================

    const teachers = await Teacher.find({})
      .select("_id name email")
      .lean();

    console.log(
      "Teachers found:",
      teachers.length
    );

    // ========================================================
    // CREATE TEACHER LOOKUP
    // ========================================================

    const teacherMap = new Map();

    for (const teacher of teachers) {
      if (!teacher?._id) {
        continue;
      }

      teacherMap.set(
        teacher._id.toString(),
        teacher
      );
    }

    // ========================================================
    // CREATE AUDIT LOG ARRAY
    // ========================================================

    const auditLogs = [];

    // ========================================================
    // PROCESS EVERY REQUEST
    // ========================================================

    for (const request of requests) {
      // ------------------------------------------------------
      // GET INSTRUCTOR
      // ------------------------------------------------------

      let instructor = null;

      const rawInstructor =
        request.instructor;

      // ------------------------------------------------------
      // CASE 1:
      // Instructor is an ObjectId
      // ------------------------------------------------------

      if (
        rawInstructor &&
        mongoose.Types.ObjectId.isValid(
          rawInstructor
        )
      ) {
        instructor =
          teacherMap.get(
            rawInstructor.toString()
          ) || null;
      }

      // ------------------------------------------------------
      // CASE 2:
      // Instructor is an object
      //
      // This is useful if some data has already been
      // populated or stored as an object.
      // ------------------------------------------------------

      else if (
        rawInstructor &&
        typeof rawInstructor === "object"
      ) {
        const instructorId =
          rawInstructor._id
            ? rawInstructor._id.toString()
            : null;

        if (instructorId) {
          instructor =
            teacherMap.get(
              instructorId
            ) || rawInstructor;
        }
      }

      // ------------------------------------------------------
      // CASE 3:
      // Old data contains a teacher name directly
      //
      // Example:
      // instructor: "Instructor B"
      // ------------------------------------------------------

      else if (
        typeof rawInstructor === "string" &&
        rawInstructor.trim() !== ""
      ) {
        instructor = {
          _id: null,
          name: rawInstructor,
          email: "",
        };
      }

      // ------------------------------------------------------
      // REQUEST HISTORY
      // ------------------------------------------------------

      const history = Array.isArray(
        request.history
      )
        ? request.history
        : [];

      // ------------------------------------------------------
      // IF REQUEST HAS NO HISTORY
      // ------------------------------------------------------

      if (history.length === 0) {
        continue;
      }

      // ======================================================
      // PROCESS HISTORY ITEMS
      // ======================================================

      for (const historyItem of history) {
        if (!historyItem) {
          continue;
        }

        const performedBy =
          historyItem.performedBy;

        // ----------------------------------------------------
        // PERFORMER ID
        // ----------------------------------------------------

        let performerId = null;

        if (
          performedBy &&
          typeof performedBy === "object"
        ) {
          if (performedBy._id) {
            performerId =
              performedBy._id.toString();
          }
        } else if (performedBy) {
          performerId =
            performedBy.toString();
        }

        // ----------------------------------------------------
        // REQUEST ID
        // ----------------------------------------------------

        const requestId =
          request._id
            ? request._id.toString()
            : null;

        // ----------------------------------------------------
        // AUDIT ID
        // ----------------------------------------------------

        const auditId =
          historyItem._id
            ? historyItem._id.toString()
            : `${requestId}-${historyItem.action}-${historyItem.performedAt}`;

        // ====================================================
        // ADD AUDIT LOG
        // ====================================================

        auditLogs.push({
          // ==================================================
          // AUDIT INFORMATION
          // ==================================================

          _id: auditId,

          action:
            historyItem.action ||
            "created",

          performedBy:
            performerId,

          performedByName:
            historyItem.performedByName ||
            performedBy?.fullName ||
            "N/A",

          performedByEmail:
            historyItem.performedByEmail ||
            performedBy?.email ||
            "",

          performedByEmployeeId:
            historyItem.performedByEmployeeId ||
            performedBy?.employeeId ||
            "",

          performedByRole:
            performedBy?.role ||
            "",

          performedAt:
            historyItem.performedAt ||
            request.createdAt ||
            null,

          reason:
            historyItem.reason ||
            "",

          details:
            historyItem.details ||
            "",

          // ==================================================
          // REQUEST INFORMATION
          // ==================================================

          requestId:

            requestId,

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

          // ==================================================
          // ACTIVITY
          // ==================================================

          date:
            request.date ||
            "",

          activityTitle:
            request.activityTitle ||
            "N/A",

          // ==================================================
          // INSTRUCTOR
          // ==================================================

          instructorName:
            instructor?.name ||
            "N/A",

          instructorEmail:
            instructor?.email ||
            "",

          instructorId:
            instructor?._id
              ? instructor._id.toString()
              : null,

          // ==================================================
          // EQUIPMENT
          // ==================================================

          cart:
            Array.isArray(
              request.cart
            )
              ? request.cart
              : [],

          totalItems:
            Array.isArray(
              request.cart
            )
              ? request.cart.reduce(
                  (total, item) =>
                    total +
                    Number(
                      item?.quantity ||
                        0
                    ),
                  0
                )
              : 0,

          // ==================================================
          // CURRENT REQUEST STATUS
          // ==================================================

          currentStatus:
            request.status ||
            "pending",

          // ==================================================
          // REQUEST TIMESTAMPS
          // ==================================================

          requestCreatedAt:
            request.createdAt ||
            null,

          requestUpdatedAt:
            request.updatedAt ||
            null,
        });
      }
    }

    // ========================================================
    // SORT AUDIT LOGS
    // NEWEST ACTION FIRST
    // ========================================================

    auditLogs.sort(
      (a, b) => {
        const dateA =
          a.performedAt
            ? new Date(
                a.performedAt
              ).getTime()
            : 0;

        const dateB =
          b.performedAt
            ? new Date(
                b.performedAt
              ).getTime()
            : 0;

        return dateB - dateA;
      }
    );

    // ========================================================
    // RESPONSE
    // ========================================================

    console.log(
      "Audit logs generated:",
      auditLogs.length
    );

    console.log(
      "=============================================="
    );

    return NextResponse.json(
      {
        success: true,
        logs: auditLogs,
        total: auditLogs.length,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "=============================================="
    );

    console.error(
      "ADMIN HISTORY API ERROR:"
    );

    console.error(error);

    console.error(
      "=============================================="
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch history and audit records.",
      },
      {
        status: 500,
      }
    );
  }
}