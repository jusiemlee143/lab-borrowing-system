import connectDB from "@/models/utils/db";
import Request from "@/models/Request";

connectDB();

export async function GET() {
  try {
    const requests = await Request.find({ status: "pending" }).sort({ date: -1 });
    return Response.json(requests);
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Error fetching requests" }, { status: 500 });
  }
}