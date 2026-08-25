import connectDB from "@/models/utils/db";
import Request from "@/models/Request";
import User from "@/models/User";
import Teacher from "@/models/Teacher";

export async function GET(req) {
  try {
    // =====================================================
    // CONNECT DATABASE
    // =====================================================

    await connectDB();

    // =====================================================
    // GET STUDENT ID
    // =====================================================

    const { searchParams } = new URL(req.url);

    const studentId = searchParams.get("studentId");

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

    const cleanStudentId = studentId.trim();

    // =====================================================
    // FIND STUDENT
    // =====================================================

    const student = await User.findOne({
      studentId: cleanStudentId,
    })
      .select("fullName studentId email course")
      .lean();

    // =====================================================
    // CHECK IF STUDENT EXISTS
    // =====================================================

    if (!student) {
      return Response.json(
        {
          success: false,
          message: "Student account not found.",
          history: [],
        },
        {
          status: 404,
        }
      );
    }

    // =====================================================
    // FIND STUDENT REQUESTS
    // =====================================================

    const requests = await Request.find({
      studentId: cleanStudentId,
    })
      .populate("instructor", "name email")
      .sort({
        createdAt: -1,
      })
      .lean();

    // =====================================================
    // RETURN STUDENT + HISTORY
    // =====================================================

    return Response.json(
      {
        success: true,

        student: {
          fullName: student.fullName || "",
          studentId: student.studentId || cleanStudentId,
          email: student.email || "",
          course: student.course || "",
        },

        history: requests,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("STUDENT HISTORY ERROR:", error);

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