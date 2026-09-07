import { NextResponse } from "next/server";
import connectDB from "@/models/utils/db";
import Tool from "@/models/Tool";

// ============================================================
// STATUS HELPER
// ============================================================

function getToolStatus(quantity) {
  if (quantity <= 0) {
    return "unavailable";
  }

  if (quantity <= 4) {
    return "low stock";
  }

  return "available";
}

// ============================================================
// GET
// Fetch all tools
// ============================================================

export async function GET() {
  try {
    await connectDB();

    const tools = await Tool.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(tools, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "ADMIN TOOLS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch equipment.",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// POST
// Create a new tool
// ============================================================

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const quantity = Number(body.quantity);

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!name) {
      return NextResponse.json(
        {
          message:
            "Equipment name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return NextResponse.json(
        {
          message:
            "Quantity must be a valid non-negative integer.",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // CHECK DUPLICATE EQUIPMENT
    // --------------------------------------------------------

    const existingTool =
      await Tool.findOne({
        name: {
          $regex: `^${escapeRegex(name)}$`,
          $options: "i",
        },
      });

    if (existingTool) {
      return NextResponse.json(
        {
          message:
            "Equipment with this name already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // --------------------------------------------------------
    // CREATE TOOL
    // --------------------------------------------------------

    const tool = await Tool.create({
      name,
      quantity,
      status: getToolStatus(quantity),
    });

    return NextResponse.json(
      {
        message:
          "Equipment created successfully.",
        tool,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN TOOLS POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to create equipment.",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// PATCH
// Update an existing tool
// ============================================================

export async function PATCH(request) {
  try {
    await connectDB();

    const body = await request.json();

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const quantity = Number(body.quantity);

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (!id) {
      return NextResponse.json(
        {
          message:
            "Equipment ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // VALIDATE NAME
    // --------------------------------------------------------

    if (!name) {
      return NextResponse.json(
        {
          message:
            "Equipment name is required.",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // VALIDATE QUANTITY
    // --------------------------------------------------------

    if (
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return NextResponse.json(
        {
          message:
            "Quantity must be a valid non-negative integer.",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // FIND TOOL
    // --------------------------------------------------------

    const existingTool =
      await Tool.findById(id);

    if (!existingTool) {
      return NextResponse.json(
        {
          message:
            "Equipment not found.",
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------------------------------
    // CHECK DUPLICATE NAME
    // Don't allow another tool to use the
    // same equipment name.
    // --------------------------------------------------------

    const duplicateTool =
      await Tool.findOne({
        _id: {
          $ne: id,
        },
        name: {
          $regex: `^${escapeRegex(name)}$`,
          $options: "i",
        },
      });

    if (duplicateTool) {
      return NextResponse.json(
        {
          message:
            "Another equipment already uses this name.",
        },
        {
          status: 409,
        }
      );
    }

    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    existingTool.name = name;
    existingTool.quantity = quantity;
    existingTool.status =
      getToolStatus(quantity);

    await existingTool.save();

    return NextResponse.json(
      {
        message:
          "Equipment updated successfully.",
        tool: existingTool,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN TOOLS PATCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update equipment.",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// DELETE
// Delete an existing tool
// ============================================================

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const id =
      searchParams.get("id");

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (!id) {
      return NextResponse.json(
        {
          message:
            "Equipment ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // FIND TOOL
    // --------------------------------------------------------

    const tool =
      await Tool.findById(id);

    if (!tool) {
      return NextResponse.json(
        {
          message:
            "Equipment not found.",
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

    await Tool.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message:
          "Equipment deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN TOOLS DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to delete equipment.",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// ESCAPE REGEX
// Used for safe case-insensitive name matching.
// ============================================================

function escapeRegex(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}