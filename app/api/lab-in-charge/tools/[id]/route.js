import connectDB from "@/models/utils/db";
import Tool from "@/models/Tool";

// ==========================
// DELETE TOOL
// ==========================
export async function DELETE(req, { params }) {
  const { id } = await params;

  await connectDB();

  try {
    const deleted = await Tool.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json(
        { error: "Tool not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Tool deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ==========================
// EDIT TOOL
// ==========================
export async function PATCH(req, { params }) {
  const { id } = await params;

  await connectDB();

  try {
    const { name, quantity } = await req.json();

    if (!name || quantity === undefined) {
      return Response.json(
        {
          success: false,
          message: "Name and quantity are required.",
        },
        {
          status: 400,
        }
      );
    }

    const tool = await Tool.findById(id);

    if (!tool) {
      return Response.json(
        {
          success: false,
          message: "Tool not found.",
        },
        {
          status: 404,
        }
      );
    }

    tool.name = name;
    tool.quantity = Number(quantity);

    // Automatically update status
    if (tool.quantity <= 0) {
      tool.status = "unavailable";
    } else if (tool.quantity < 5) {
      tool.status = "low stock";
    } else {
      tool.status = "available";
    }

    await tool.save();

    return Response.json({
      success: true,
      message: "Tool updated successfully.",
      tool,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Server error.",
      },
      {
        status: 500,
      }
    );
  }
}