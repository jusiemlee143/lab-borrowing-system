import connectDB from "@/models/utils/db";
import Request from "@/models/Request";
import Tool from "@/models/Tool";

connectDB();

export async function PATCH(req, { params }) {
  try {
    const { action } = await req.json(); // "approve" or "reject"

    const request = await Request.findById(params.id);

    if (!request) {
      return Response.json({ message: "Request not found" }, { status: 404 });
    }

    // =========================
    // ✅ APPROVE REQUEST
    // =========================
    if (action === "approve") {
      // 🔒 STEP 1: CHECK ALL STOCK FIRST
      for (const item of request.cart) {
        const tool = await Tool.findById(item.id);

        if (!tool) {
          return Response.json(
            { message: `Tool not found: ${item.name}` },
            { status: 404 }
          );
        }

        if (tool.quantity < item.quantity) {
          return Response.json(
            { message: `Not enough stock for ${item.name}` },
            { status: 400 }
          );
        }
      }

      // 🔒 STEP 2: DEDUCT STOCK (ONLY IF ALL ARE VALID)
      for (const item of request.cart) {
        const tool = await Tool.findById(item.id);

        tool.quantity -= item.quantity;

        // Update status
        if (tool.quantity === 0) tool.status = "unavailable";
        else if (tool.quantity < 5) tool.status = "low stock";
        else tool.status = "available";

        await tool.save();
      }

      request.status = "approved";
    }

    // =========================
    // ❌ REJECT REQUEST
    // =========================
    if (action === "reject") {
      request.status = "rejected";
    }

    await request.save();

    return Response.json({ message: "Request updated successfully" });

  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Error updating request" },
      { status: 500 }
    );
  }
}