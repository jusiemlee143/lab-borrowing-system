import connectDB from "@/models/utils/db";
import Request from "@/models/Request";
import Tool from "@/models/Tool";

connectDB();

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { action } = await req.json();

    console.log("==================================");
    console.log("PATCH REQUEST RECEIVED");
    console.log("Request ID:", id);
    console.log("Action:", action);

    const request = await Request.findById(id);

    console.log("Request Found:", !!request);

    if (!request) {
      return Response.json(
        { message: "Request not found" },
        { status: 404 }
      );
    }

    console.log("Current Status:", request.status);

    switch (action) {

      case "approve":
        if (request.status !== "pending") {
          return Response.json(
            {
              message: "Only pending requests can be approved.",
            },
            {
              status: 400,
            }
          );
        }

        request.status = "approved";
        request.approvedDate = new Date();

        console.log("Status changed to APPROVED");

        break;

      case "reject":
        if (request.status !== "pending") {
          return Response.json(
            {
              message: "Only pending requests can be rejected.",
            },
            {
              status: 400,
            }
          );
        }

        request.status = "rejected";
        request.rejectedDate = new Date();

        console.log("Status changed to REJECTED");

        break;

      case "release":
        if (request.status !== "approved") {
          return Response.json(
            {
              message: "Only approved requests can be released.",
            },
            {
              status: 400,
            }
          );
        }

        for (const item of request.cart) {
          const tool = await Tool.findById(item.id);

          if (!tool) {
            return Response.json(
              {
                message: `Tool not found: ${item.name}`,
              },
              {
                status: 404,
              }
            );
          }

          if (tool.quantity < item.quantity) {
            return Response.json(
              {
                message: `Not enough stock for ${item.name}`,
              },
              {
                status: 400,
              }
            );
          }
        }

        for (const item of request.cart) {
          const tool = await Tool.findById(item.id);

          tool.quantity -= item.quantity;

          if (tool.quantity === 0)
            tool.status = "unavailable";
          else if (tool.quantity < 5)
            tool.status = "low stock";
          else
            tool.status = "available";

          await tool.save();
        }

        request.status = "released";
        request.releasedDate = new Date();

        console.log("Status changed to RELEASED");

        break;

      case "return":
        if (request.status !== "released") {
          return Response.json(
            {
              message: "Only released requests can be returned.",
            },
            {
              status: 400,
            }
          );
        }

        for (const item of request.cart) {
          const tool = await Tool.findById(item.id);

          if (!tool) continue;

          tool.quantity += item.quantity;

          if (tool.quantity === 0)
            tool.status = "unavailable";
          else if (tool.quantity < 5)
            tool.status = "low stock";
          else
            tool.status = "available";

          await tool.save();
        }

        request.status = "returned";
        request.returnedDate = new Date();

        console.log("Status changed to RETURNED");

        break;

      default:
        return Response.json(
          {
            message: "Invalid action.",
          },
          {
            status: 400,
          }
        );
    }

    await request.save();

    console.log("Saved Successfully");
    console.log("New Status:", request.status);
    console.log("==================================");

    return Response.json({
      success: true,
      message: `Request ${action}d successfully.`,
      request,
    });

  } catch (err) {

    console.error("PATCH ERROR:");
    console.error(err);

    return Response.json(
      {
        success: false,
        message: err.message,
      },
      {
        status: 500,
      }
    );
  }
}