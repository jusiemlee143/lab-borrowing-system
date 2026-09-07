import { NextResponse } from "next/server";
import connectDB from "@/models/utils/db";

import User from "@/models/User";
import Tool from "@/models/Tool";
import Request from "@/models/Request";

export async function GET() {
  try {
    await connectDB();

    // ============================================================
    // ACCOUNT COUNTS
    // ============================================================

    const totalLIC = await User.countDocuments({
      role: "lic",
    });

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    // ============================================================
    // EQUIPMENT
    // ============================================================

    const totalTools = await Tool.countDocuments();

    // Count tools with quantity between 1 and 4 as low stock.
    const lowStockTools = await Tool.countDocuments({
      quantity: {
        $gt: 0,
        $lt: 5,
      },
    });

    // ============================================================
    // BORROWING REQUESTS
    // ============================================================

    const pendingRequests = await Request.countDocuments({
      status: "pending",
    });

    // "released" means the equipment is currently borrowed.
    const activeBorrowings = await Request.countDocuments({
      status: "released",
    });

    // ============================================================
    // AUDIT HISTORY
    // ============================================================

    const historyResult = await Request.aggregate([
      {
        $project: {
          historyCount: {
            $size: {
              $ifNull: ["$history", []],
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$historyCount",
          },
        },
      },
    ]);

    const totalHistory = historyResult[0]?.total || 0;

    // ============================================================
    // RESPONSE
    // ============================================================

    return NextResponse.json({
      success: true,
      stats: {
        totalLIC,
        totalStudents,
        totalTools,
        pendingRequests,
        activeBorrowings,
        lowStockTools,
        totalHistory,
      },
    });
  } catch (error) {
    console.error(
      "Admin dashboard statistics error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard statistics.",
      },
      {
        status: 500,
      }
    );
  }
}
