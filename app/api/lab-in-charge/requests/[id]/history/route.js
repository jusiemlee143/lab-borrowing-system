import { NextResponse } from "next/server";
import connectDB from "@/models/utils/db";
import RequestHistory from "@/models/RequestHistory";
import Request from "@/models/Request";

export async function GET() {
  try {
    await connectDB();

    // =====================================================
    // FETCH HISTORY
    // =====================================================

    const history = await RequestHistory.find()
    .populate({
        path: "requestId",
        select:
        "studentName section groupNumber date activityTitle instructor members cart status",
    })
    .sort({
        createdAt: -1,
    })
    .lean();
    // =====================================================
    // ATTACH REQUEST DETAILS
    // =====================================================

    const historyWithRequests = await Promise.all(
      history.map(async (item) => {
        try {
          const request = await Request.findById(
            item.requestId
          ).lean();

          return {
            ...item,

            request: request
              ? {
                  _id: request._id,
                  studentName:
                    request.studentName,
                  section:
                    request.section,
                  groupNumber:
                    request.groupNumber,
                  date:
                    request.date,
                  activityTitle:
                    request.activityTitle,
                  instructor:
                    request.instructor,
                  members:
                    request.members || [],
                  cart:
                    request.cart || [],
                  status:
                    request.status,

                  approvedBy:
                    request.approvedBy || "",
                  approvedDate:
                    request.approvedDate || null,

                  releasedBy:
                    request.releasedBy || "",
                  releasedDate:
                    request.releasedDate || null,

                  returnedBy:
                    request.returnedBy || "",
                  returnedDate:
                    request.returnedDate || null,

                  rejectedBy:
                    request.rejectedBy || "",
                  rejectedDate:
                    request.rejectedDate || null,

                  rejectReason:
                    request.rejectReason || "",
                }
              : null,
          };
        } catch (error) {
          console.error(
            `Unable to find request ${item.requestId}:`,
            error
          );

          return {
            ...item,
            request: null,
          };
        }
      })
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