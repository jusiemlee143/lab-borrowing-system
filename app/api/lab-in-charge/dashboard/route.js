import connectDB from "@/models/utils/db";
import Tool from "@/models/Tool";
import Request from "@/models/Request";

connectDB();

export async function GET() {
  try {
    // Inventory
    const totalTools = await Tool.countDocuments();

    const availableTools = await Tool.countDocuments({
      quantity: { $gte: 5 },
    });

    const lowStock = await Tool.countDocuments({
      quantity: { $gt: 0, $lt: 5 },
    });

    const unavailable = await Tool.countDocuments({
      quantity: 0,
    });

    // Requests
    const pending = await Request.countDocuments({
      status: "pending",
    });

    const approved = await Request.countDocuments({
      status: "approved",
    });

    const released = await Request.countDocuments({
      status: "released",
    });

    const returned = await Request.countDocuments({
      status: "returned",
    });

    const rejected = await Request.countDocuments({
      status: "rejected",
    });

    // Today
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const borrowedToday = await Request.countDocuments({
      releasedDate: {
        $gte: today,
      },
    });

    const returnedToday = await Request.countDocuments({
      returnedDate: {
        $gte: today,
      },
    });

    return Response.json({
      totalTools,
      availableTools,
      lowStock,
      unavailable,

      pending,
      approved,
      released,
      returned,
      rejected,

      borrowedToday,
      returnedToday,
    });

  } catch (err) {
    console.error(err);

    return Response.json(
      {
        message: "Dashboard error",
      },
      {
        status: 500,
      }
    );
  }
}