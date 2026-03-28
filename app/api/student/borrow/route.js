import connectDB from "@/models/utils/db";
import Request from "@/models/Request";

connectDB();

export async function POST(req) {
  try {
    const {
      name,
      section,
      groupNumber,
      date,
      activityTitle,
      instructor,
      members,
      cart,
    } = await req.json();

    if (!cart || cart.length === 0) {
      return Response.json({ message: "No tools selected" }, { status: 400 });
    }

    const request = await Request.create({
      studentName: name,
      section,
      groupNumber,
      date,
      activityTitle,
      instructor,
      members,
      cart, // ✅ store WHOLE cart
      status: "pending",
    });

    return Response.json({ message: "Request submitted", request });

  } catch (err) {
    console.error(err);
    return Response.json({ message: "Failed to submit request" }, { status: 500 });
  }
}