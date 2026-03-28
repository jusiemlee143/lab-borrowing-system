import connectDB from "@/models/utils/db";
import Tool from "@/models/Tool";

connectDB();

// ✅ GET ALL TOOLS
export async function GET() {
  try {
    const tools = await Tool.find();
    return Response.json(tools);
  } catch (err) {
    return Response.json({ message: "Error fetching tools" }, { status: 500 });
  }
}

// ✅ ADD TOOL
export async function POST(req) {
  try {
    const { name, quantity } = await req.json();

    let status = "available";
    if (quantity === 0) status = "unavailable";
    else if (quantity < 5) status = "low stock";

    const tool = await Tool.create({ name, quantity, status });

    return Response.json(tool);
  } catch (err) {
    return Response.json({ message: "Error creating tool" }, { status: 500 });
  }
}