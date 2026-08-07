import connectDB from "@/models/utils/db";
import Tool from "@/models/Tool";

connectDB();

// ✅ GET ALL TOOLS
export async function GET() {
  try {
    const tools = await Tool.find().sort({ name: 1 });

    return Response.json(tools);
  } catch (err) {
    console.error(err);

    return Response.json(
      { message: "Error fetching tools" },
      { status: 500 }
    );
  }
}

// ✅ ADD TOOL
export async function POST(req) {
  try {
    const { name, quantity } = await req.json();

    // Validate input
    if (!name || quantity === undefined) {
      return Response.json(
        { message: "Tool name and quantity are required." },
        { status: 400 }
      );
    }

    const toolName = name.trim();

    // Check if tool already exists (case-insensitive)
    const existingTool = await Tool.findOne({
      name: {
        $regex: new RegExp(`^${toolName}$`, "i"),
      },
    });

    if (existingTool) {
      return Response.json(
        {
          message: `"${toolName}" already exists in the inventory.`,
        },
        {
          status: 400,
        }
      );
    }

    // Determine status
    let status = "available";

    if (Number(quantity) === 0) {
      status = "unavailable";
    } else if (Number(quantity) < 5) {
      status = "low stock";
    }

    const tool = await Tool.create({
      name: toolName,
      quantity: Number(quantity),
      status,
    });

    return Response.json(tool, { status: 201 });

  } catch (err) {
    console.error(err);

    return Response.json(
      { message: "Error creating tool." },
      { status: 500 }
    );
  }
}