import { NextResponse } from "next/server";
import connectDB from "@/models/utils/db";
import RequestHistory from "@/models/RequestHistory";
import Request from "@/models/Request";
import Teacher from "@/models/Teacher";

export async function GET() {
  try {
    await connectDB();

    // =====================================================
    // FETCH HISTORY
    // =====================================================

    const history = await RequestHistory.find()
      .sort({
        createdAt: -1,
      })
      .lean();

    // =====================================================
    // GET ALL REQUEST IDS
    // =====================================================

    const requestIds = history
      .map((item) => item.requestId)
      .filter(Boolean);

    // =====================================================
    // FETCH REQUESTS
    // =====================================================

    const requests =
      requestIds.length > 0
        ? await Request.find({
            _id: {
              $in: requestIds,
            },
          }).lean()
        : [];

    // =====================================================
    // CREATE REQUEST LOOKUP
    // =====================================================

    const requestMap = new Map();

    for (const request of requests) {
      requestMap.set(
        request._id.toString(),
        request
      );
    }

    // =====================================================
    // GET TEACHER IDS
    // =====================================================

    const teacherIds = requests
      .map((request) => request.instructor)
      .filter(Boolean);

    // =====================================================
    // FETCH TEACHERS
    // =====================================================

    const teachers =
      teacherIds.length > 0
        ? await Teacher.find({
            _id: {
              $in: teacherIds,
            },
          })
            .select("_id name email")
            .lean()
        : [];

    // =====================================================
    // CREATE TEACHER LOOKUP
    // =====================================================

    const teacherMap = new Map();

    for (const teacher of teachers) {
      teacherMap.set(
        teacher._id.toString(),
        teacher
      );
    }

    // =====================================================
    // NORMALIZE PERFORMER ROLE
    // =====================================================

    function normalizePerformerRole(performedBy) {
      if (!performedBy) {
        return "student";
      }

      const rawRole = String(
        performedBy.role || ""
      )
        .toLowerCase()
        .trim();

      // ---------------------------------------------------
      // LAB-IN-CHARGE
      // ---------------------------------------------------

      if (
        rawRole === "lab-in-charge" ||
        rawRole === "lab_in_charge" ||
        rawRole === "labincharge" ||
        rawRole === "lic" ||
        performedBy.employeeId
      ) {
        return "lab-in-charge";
      }

      // ---------------------------------------------------
      // STUDENT
      // ---------------------------------------------------

      if (
        rawRole === "student" ||
        rawRole === "students"
      ) {
        return "student";
      }

      // ---------------------------------------------------
      // DEFAULT
      // ---------------------------------------------------

      return "student";
    }

    // =====================================================
    // BUILD FINAL HISTORY RESPONSE
    // =====================================================

    const historyWithRequests = history.map(
      (item) => {
        const requestId =
          item.requestId?.toString();

        const request =
          requestMap.get(requestId) || null;

        // =================================================
        // NORMALIZE PERFORMER
        // =================================================

        const originalPerformedBy =
          item.performedBy || null;

        const performerRole =
          normalizePerformerRole(
            originalPerformedBy
          );

        const normalizedPerformedBy =
          originalPerformedBy
            ? {
                ...originalPerformedBy,
                role: performerRole,
              }
            : {
                role: "student",
              };

        // =================================================
        // REQUEST NOT FOUND
        // =================================================

        if (!request) {
          return {
            ...item,

            requestId,

            performedBy:
              normalizedPerformedBy,

            request: null,
          };
        }

        // =================================================
        // GET TEACHER
        // =================================================

        const teacher =
          request.instructor
            ? teacherMap.get(
                request.instructor.toString()
              )
            : null;

        // =================================================
        // RETURN HISTORY
        // =================================================

        return {
          ...item,

          requestId,

          performedBy:
            normalizedPerformedBy,

          request: {
            ...request,

            instructor: teacher
              ? {
                  _id: teacher._id,
                  name: teacher.name,
                  email: teacher.email,
                }
              : null,
          },
        };
      }
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,
      history: historyWithRequests,
    });
  } catch (error) {
    console.error(
      "GET /api/lab-in-charge/history ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch request history.",
      },
      {
        status: 500,
      }
    );
  }
}