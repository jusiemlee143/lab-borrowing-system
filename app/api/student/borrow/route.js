import connectDB from "@/models/utils/db";
import Request from "@/models/Request";
import RequestHistory from "@/models/RequestHistory";

export async function POST(req) {
  try {
    // =====================================================
    // CONNECT DATABASE
    // =====================================================

    await connectDB();

    // =====================================================
    // GET REQUEST DATA
    // =====================================================

    const {
      name,
      section,
      groupNumber,
      date,
      activityTitle,
      instructor,
      members,
      cart,
    } = await req.json();

    // =====================================================
    // VALIDATE REQUIRED FIELDS
    // =====================================================

    if (!name || !name.trim()) {
      return Response.json(
        {
          success: false,
          message: "Student name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!section || !section.trim()) {
      return Response.json(
        {
          success: false,
          message: "Section is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!groupNumber || !String(groupNumber).trim()) {
      return Response.json(
        {
          success: false,
          message: "Group number is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!date || !date.trim()) {
      return Response.json(
        {
          success: false,
          message: "Date is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!activityTitle || !activityTitle.trim()) {
      return Response.json(
        {
          success: false,
          message: "Activity title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!instructor || !instructor.trim()) {
      return Response.json(
        {
          success: false,
          message: "Instructor is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // VALIDATE CART
    // =====================================================

    if (!Array.isArray(cart) || cart.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No tools selected.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // VALIDATE CART ITEMS
    // =====================================================

    for (const item of cart) {
      if (!item.id || !String(item.id).trim()) {
        return Response.json(
          {
            success: false,
            message: "A selected tool is missing its ID.",
          },
          {
            status: 400,
          }
        );
      }

      if (!item.name || !String(item.name).trim()) {
        return Response.json(
          {
            success: false,
            message: "A selected tool is missing its name.",
          },
          {
            status: 400,
          }
        );
      }

      const quantity = Number(item.quantity);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        return Response.json(
          {
            success: false,
            message: `Invalid quantity for ${item.name}.`,
          },
          {
            status: 400,
          }
        );
      }
    }

    // =====================================================
    // CREATE REQUEST
    // =====================================================

    const request = await Request.create({
      studentName: name.trim(),
      section: section.trim(),
      groupNumber: String(groupNumber).trim(),
      date: date.trim(),
      activityTitle: activityTitle.trim(),
      instructor: instructor.trim(),
      members: Array.isArray(members) ? members : [],
      cart,
      status: "pending",
    });

    console.log("==================================");
    console.log("REQUEST CREATED");
    console.log("Request ID:", request._id.toString());
    console.log("Student:", request.studentName);
    console.log("Section:", request.section);
    console.log("Group Number:", request.groupNumber);
    console.log("Activity:", request.activityTitle);
    console.log("Instructor:", request.instructor);
    console.log("==================================");

    // =====================================================
    // CREATE HISTORY / AUDIT RECORD
    // =====================================================

    await RequestHistory.create({
      requestId: request._id,

      // This records the initial submission.
      action: "created",

      // ===================================================
      // STUDENT ACTOR
      // ===================================================
      //
      // Students currently do not use the authenticated
      // User model in this route.
      //
      // Therefore:
      //
      // userId     = null
      // fullName   = student name
      // employeeId = ""
      //
      // This preserves a snapshot of who submitted the
      // request even if the request is viewed later.
      // ===================================================

      performedBy: {
        userId: null,
        fullName: request.studentName,
        employeeId: "",
      },

      reason: "",
    });

    console.log("==================================");
    console.log("CREATED HISTORY");
    console.log("Request ID:", request._id.toString());
    console.log("Action: created");
    console.log("Performed By:", request.studentName);
    console.log("==================================");

    // =====================================================
    // RESPONSE
    // =====================================================

    return Response.json(
      {
        success: true,
        message: "Request submitted successfully.",
        request,
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error("==================================");
    console.error("BORROW REQUEST ERROR:");
    console.error(err);
    console.error("==================================");

    return Response.json(
      {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Failed to submit request.",
      },
      {
        status: 500,
      }
    );
  }
}