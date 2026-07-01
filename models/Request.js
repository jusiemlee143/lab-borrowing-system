import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  studentName: String,
  section: String,
  groupNumber: String,
  date: String,
  activityTitle: String,
  instructor: String,
  members: [String],

  // ✅ NEW
  cart: [
    {
      id: String,
      name: String,
      quantity: Number,
    },
  ],

  status: {
    type: String, 
    default: "pending",
  },
});

export default mongoose.models.Request ||
  mongoose.model("Request", requestSchema);