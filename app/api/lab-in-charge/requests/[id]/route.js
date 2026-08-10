import connectDB from "@/models/utils/db";
import Request from "@/models/Request";
import Tool from "@/models/Tool";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const { action, rejectReason } = await req.json();

    console.log("==================================");
    console.log("PATCH REQUEST RECEIVED");
    console.log("Request ID:", id);
    console.log("Action:", action);
    console.log("Reject Reason:", rejectReason);

    // =====================================================
    // FIND REQUEST
    // =====================================================

    const request = await Request.findById(id);

    console.log("Request Found:", !!request);

    if (!request) {
      return Response.json(
        {
          success: false,
          message: "Request not found.",
        },
        {
          status: 404,
        }
      );
    }

    console.log("Current Status:", request.status);

    // =====================================================
    // APPROVE
    // =====================================================

    if (action === "approve") {
      if (request.status !== "pending") {
        return Response.json(
          {
            success: false,
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
    }

    // =====================================================
    // REJECT
    // =====================================================

    else if (action === "reject") {
      if (request.status !== "pending") {
        return Response.json(
          {
            success: false,
            message: "Only pending requests can be rejected.",
          },
          {
            status: 400,
          }
        );
      }

      // Make sure a rejection reason was provided
      if (!rejectReason || !rejectReason.trim()) {
        return Response.json(
          {
            success: false,
            message: "A rejection reason is required.",
          },
          {
            status: 400,
          }
        );
      }

      request.status = "rejected";
      request.rejectedDate = new Date();

      // Save rejection reason
      request.rejectReason = rejectReason.trim();

      console.log("Status changed to REJECTED");
      console.log("Reject Reason:", request.rejectReason);
    }

    // =====================================================
    // RELEASE
    // =====================================================

    else if (action === "release") {
      if (request.status !== "approved") {
        return Response.json(
          {
            success: false,
            message: "Only approved requests can be released.",
          },
          {
            status: 400,
          }
        );
      }

      console.log("==================================");
      console.log("CHECKING TOOLS FOR RELEASE");
      console.log("==================================");

      /*
       * We first find and validate ALL requested tools.
       *
       * Some older requests may have:
       *
       * cart.id = "Arduino Uno"
       *
       * instead of:
       *
       * cart.id = "MongoDB ObjectId"
       *
       * Therefore we:
       *
       * 1. Try to find the tool using item.id
       * 2. If that fails, find the tool using item.name
       */

      const toolsToRelease = [];

      // =====================================================
      // STEP 1: FIND AND VALIDATE ALL TOOLS
      // =====================================================

      for (const item of request.cart || []) {
        const itemId = String(item.id || "").trim();
        const itemName = String(item.name || "").trim();
        const requestedQuantity = Number(item.quantity);

        let tool = null;

        console.log("----------------------------------");
        console.log("Requested Tool");
        console.log("ID:", itemId);
        console.log("Name:", itemName);
        console.log("Quantity:", requestedQuantity);

        // -------------------------------------------------
        // Try MongoDB ID first
        // -------------------------------------------------

        if (itemId) {
          try {
            tool = await Tool.findById(itemId);
          } catch (error) {
            /*
             * item.id may not be a valid MongoDB ObjectId.
             *
             * Example:
             *
             * item.id = "Arduino Uno"
             *
             * In that case findById() cannot be used,
             * so we continue and search by name.
             */

            console.log(
              "cart.id is not a valid MongoDB ObjectId."
            );

            console.log(
              "Trying to find tool using its name..."
            );
          }
        }

        // -------------------------------------------------
        // If ID didn't find it, search by tool name
        // -------------------------------------------------

        if (!tool && itemName) {
          tool = await Tool.findOne({
            name: {
              $regex: `^${itemName.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
              )}$`,
              $options: "i",
            },
          });

          if (tool) {
            console.log(
              "Tool found using name:",
              tool.name
            );

            console.log(
              "Actual MongoDB ID:",
              tool._id.toString()
            );
          }
        }

        // -------------------------------------------------
        // Tool does not exist
        // -------------------------------------------------

        if (!tool) {
          console.log("TOOL NOT FOUND");
          console.log("ID:", itemId);
          console.log("Name:", itemName);

          return Response.json(
            {
              success: false,
              message: `Tool not found: ${itemName || itemId}`,
            },
            {
              status: 404,
            }
          );
        }

        // -------------------------------------------------
        // Validate quantity
        // -------------------------------------------------

        if (
          !Number.isFinite(requestedQuantity) ||
          requestedQuantity <= 0
        ) {
          return Response.json(
            {
              success: false,
              message: `Invalid quantity for ${tool.name}.`,
            },
            {
              status: 400,
            }
          );
        }

        // -------------------------------------------------
        // Check available stock
        // -------------------------------------------------

        console.log(
          `${tool.name} current stock:`,
          tool.quantity
        );

        console.log(
          `${tool.name} requested quantity:`,
          requestedQuantity
        );

        if (tool.quantity < requestedQuantity) {
          return Response.json(
            {
              success: false,
              message: `Not enough stock for ${tool.name}. Available: ${tool.quantity}, Requested: ${requestedQuantity}`,
            },
            {
              status: 400,
            }
          );
        }

        // Save the actual MongoDB tool document
        toolsToRelease.push({
          tool,
          quantity: requestedQuantity,
        });
      }

      // =====================================================
      // STEP 2: DEDUCT STOCK
      // =====================================================

      console.log("==================================");
      console.log("ALL TOOLS VALIDATED");
      console.log("UPDATING INVENTORY");
      console.log("==================================");

      for (const item of toolsToRelease) {
        const tool = item.tool;
        const quantity = item.quantity;

        tool.quantity -= quantity;

        // Update status
        if (tool.quantity === 0) {
          tool.status = "unavailable";
        } else if (tool.quantity < 5) {
          tool.status = "low stock";
        } else {
          tool.status = "available";
        }

        await tool.save();

        console.log(
          `Updated ${tool.name}: quantity = ${tool.quantity}`
        );

        console.log(
          `Updated ${tool.name}: status = ${tool.status}`
        );
      }

      // =====================================================
      // STEP 3: UPDATE REQUEST
      // =====================================================

      request.status = "released";
      request.releasedDate = new Date();

      console.log("Status changed to RELEASED");
    }

    // =====================================================
    // RETURN
    // =====================================================

    else if (action === "return") {
      if (request.status !== "released") {
        return Response.json(
          {
            success: false,
            message: "Only released requests can be returned.",
          },
          {
            status: 400,
          }
        );
      }

      console.log("==================================");
      console.log("RETURNING TOOLS");
      console.log("==================================");

      for (const item of request.cart || []) {
        const itemId = String(item.id || "").trim();
        const itemName = String(item.name || "").trim();
        const returnQuantity = Number(item.quantity);

        let tool = null;

        // -------------------------------------------------
        // Try MongoDB ID first
        // -------------------------------------------------

        if (itemId) {
          try {
            tool = await Tool.findById(itemId);
          } catch (error) {
            console.log(
              "Return: cart.id is not a valid MongoDB ObjectId."
            );
          }
        }

        // -------------------------------------------------
        // Fallback to name
        // -------------------------------------------------

        if (!tool && itemName) {
          tool = await Tool.findOne({
            name: {
              $regex: `^${itemName.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
              )}$`,
              $options: "i",
            },
          });
        }

        // -------------------------------------------------
        // If tool cannot be found
        // -------------------------------------------------

        if (!tool) {
          console.log(
            `Return: Tool not found: ${itemName || itemId}`
          );

          continue;
        }

        // -------------------------------------------------
        // Add quantity back
        // -------------------------------------------------

        tool.quantity += returnQuantity;

        // Update status
        if (tool.quantity === 0) {
          tool.status = "unavailable";
        } else if (tool.quantity < 5) {
          tool.status = "low stock";
        } else {
          tool.status = "available";
        }

        await tool.save();

        console.log(
          `Returned ${tool.name}: quantity = ${tool.quantity}`
        );

        console.log(
          `Updated ${tool.name}: status = ${tool.status}`
        );
      }

      request.status = "returned";
      request.returnedDate = new Date();

      console.log("Status changed to RETURNED");
    }

    // =====================================================
    // INVALID ACTION
    // =====================================================

    else {
      return Response.json(
        {
          success: false,
          message: "Invalid action.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // SAVE REQUEST
    // =====================================================

    await request.save();

    console.log("==================================");
    console.log("REQUEST SAVED SUCCESSFULLY");
    console.log("New Status:", request.status);
    console.log("Reject Reason:", request.rejectReason);
    console.log("==================================");

    return Response.json({
      success: true,
      message:
        action === "approve"
          ? "Request approved successfully."
          : action === "reject"
          ? "Request rejected successfully."
          : action === "release"
          ? "Request released successfully."
          : action === "return"
          ? "Tools returned successfully."
          : "Request updated successfully.",
      request,
    });
  } catch (err) {
    console.error("==================================");
    console.error("PATCH ERROR:");
    console.error(err);
    console.error("==================================");

    return Response.json(
      {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred.",
      },
      {
        status: 500,
      }
    );
  }
}
