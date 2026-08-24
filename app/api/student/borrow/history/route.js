import connectDB from "@/models/utils/db";
import Request from "@/models/Request";

export async function GET(req) {
  try {
    // =====================================================
    // CONNECT DATABASE
    // =====================================================

    await connectDB();

    // =====================================================
    // GET STUDENT ID
    // =====================================================

    const { searchParams } =
      new URL(req.url);

    const studentId =
      searchParams.get("studentId");

    // =====================================================
    // VALIDATE STUDENT ID
    // =====================================================

    if (!studentId || !studentId.trim()) {
      return Response.json(
        {
          success: false,
          message: "Student ID is required.",
          history: [],
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // FIND STUDENT REQUESTS
    // =====================================================

    const requests = await Request.find({
      studentId: studentId.trim(),
    })
      .populate(
        "instructor",
        "name email"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    // =====================================================
    // RETURN HISTORY
    // =====================================================

    return Response.json(
      {
        success: true,
        history: requests,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "STUDENT HISTORY ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load borrowing history.",
        history: [],
      },
      {
        status: 500,
      }
    );
  }
}