import connectDB from "@/models/utils/db";
import Request from "@/models/Request";
import Teacher from "@/models/Teacher";

export async function GET() {
  try {
    await connectDB();

    // =====================================================
    // FETCH REQUESTS
    // =====================================================

    const requests = await Request.find()
      .sort({
        createdAt: -1,
      })
      .lean();

    // =====================================================
    // FETCH TEACHERS
    // =====================================================

    const teachers = await Teacher.find()
      .select("_id name")
      .lean();

    // =====================================================
    // CREATE TEACHER LOOKUP MAP
    // =====================================================

    const teacherMap = new Map(
      teachers.map((teacher) => [
        teacher._id.toString(),
        teacher.name,
      ])
    );

    // =====================================================
    // ADD INSTRUCTOR NAME TO EACH REQUEST
    // =====================================================

    const requestsWithInstructorName = requests.map(
      (request) => {
        const instructorId =
          request.instructor?.toString();

        const instructorName =
          instructorId
            ? teacherMap.get(instructorId)
            : null;

        return {
          ...request,

          instructorName:
            instructorName ||
            request.instructor ||
            "N/A",
        };
      }
    );

    // =====================================================
    // RETURN REQUESTS
    // =====================================================

    return Response.json(
      requestsWithInstructorName
    );
  } catch (err) {
    console.error(
      "Error fetching requests:",
      err
    );

    return Response.json(
      {
        message: "Error fetching requests",
      },
      {
        status: 500,
      }
    );
  }
}