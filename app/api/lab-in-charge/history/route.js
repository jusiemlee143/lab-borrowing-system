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

    const requests = await Request.find({
      _id: {
        $in: requestIds,
      },
    })
      .lean();

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

    const teachers = await Teacher.find({
      _id: {
        $in: teacherIds,
      },
    })
      .select("_id name email")
      .lean();

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
    // BUILD FINAL HISTORY RESPONSE
    // =====================================================

    const historyWithRequests = history.map(
      (item) => {
        const requestId =
          item.requestId?.toString();

        const request =
          requestMap.get(requestId) || null;

        if (!request) {
          return {
            ...item,

            requestId,

            request: null,
          };
        }

        const teacher =
          request.instructor
            ? teacherMap.get(
                request.instructor.toString()
              )
            : null;

        return {
          ...item,

          requestId,

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