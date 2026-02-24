import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import path from "path";

// Load .env.local using absolute path (safe on Windows)
dotenv.config({ path: path.resolve("./.env.local") });

// Debug check
console.log("ENV FILE LOADED:", process.env.MONGO_URI);

const connectDBAndSeed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGODB_URI not found in environment variables!");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Seed users
    await User.deleteMany();

    await User.create({
      name: "Admin User",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
    });

    

    console.log("✅ Users seeded");
    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

// Run the function
connectDBAndSeed();
