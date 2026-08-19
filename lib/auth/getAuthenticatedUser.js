import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User";
import connectDB from "@/models/utils/db";

export default async function getAuthenticatedUser() {
  try {
    // =====================================================
    // CONNECT TO DATABASE
    // =====================================================

    await connectDB();

    // =====================================================
    // GET COOKIES
    // =====================================================

    const cookieStore = await cookies();

    const adminToken =
      cookieStore.get("token")?.value;

    const licToken =
      cookieStore.get("licToken")?.value;

    // =====================================================
    // DETERMINE WHICH TOKEN TO USE
    //
    // LIC has priority when licToken exists.
    // This allows admin + LIC to be logged in at the
    // same time on the same browser.
    // =====================================================

    let token = null;

    if (licToken) {
      token = licToken;
    } else if (adminToken) {
      token = adminToken;
    }

    // =====================================================
    // NO TOKEN
    // =====================================================

    if (!token) {
      console.log(
        "AUTH: No authentication token found."
      );

      return null;
    }

    // =====================================================
    // JWT SECRET CHECK
    // =====================================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "AUTH: JWT_SECRET is not configured."
      );

      return null;
    }

    // =====================================================
    // VERIFY JWT
    // =====================================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // =====================================================
    // MAKE SURE PAYLOAD IS AN OBJECT
    // =====================================================

    if (typeof decoded === "string") {
      console.error(
        "AUTH: Invalid JWT payload."
      );

      return null;
    }

    // =====================================================
    // CHECK USER ID
    // =====================================================

    if (!decoded.userId) {
      console.error(
        "AUTH: JWT does not contain userId."
      );

      return null;
    }

    // =====================================================
    // FIND USER IN DATABASE
    // =====================================================

    const user = await User.findById(
      decoded.userId
    ).lean();

    // =====================================================
    // USER DOES NOT EXIST
    // =====================================================

    if (!user) {
      console.error(
        "AUTH: User no longer exists."
      );

      return null;
    }

    // =====================================================
    // AUTHENTICATION SUCCESS
    // =====================================================

    console.log("==================================");
    console.log("AUTHENTICATED USER");
    console.log("User:", user.fullName);
    console.log("Role:", user.role);
    console.log(
      "Token Used:",
      licToken ? "licToken" : "token"
    );
    console.log("==================================");

    return user;
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    return null;
  }
}