// app/api/lab-in-charge/tools/[id]/route.js

import connectDB from "@/models/utils/db";
import Tool from "@/models/Tool";

export async function DELETE(req, { params }) {
  // params is a promise in Next.js App Router
  const resolvedParams = await params;
  const { id } = resolvedParams;

  await connectDB();

  try {
    const deleted = await Tool.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Tool not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ message: "Deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}