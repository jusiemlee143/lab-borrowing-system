import mongoose from "mongoose";

const ToolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "low stock", "unavailable"],
    default: "available",
  },
}, { timestamps: true });

export default mongoose.models.Tool || mongoose.model("Tool", ToolSchema);