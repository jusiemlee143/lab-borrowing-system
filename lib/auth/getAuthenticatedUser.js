import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User";
import connectDB from "@/models/utils/db";

export default async function getAuthenticatedUser() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get cookies from the current request
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // No authentication cookie
    if (!token) {
      return null;
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make sure the JWT contains a userId
    if (!decoded?.userId) {
      return null;
    }

    // Find the actual user in MongoDB
    const user = await User.findById(decoded.userId).lean();

    // User no longer exists
    if (!user) {
      return null;
    }

    // Return the authenticated user
    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}