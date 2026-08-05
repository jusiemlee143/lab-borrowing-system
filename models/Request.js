import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    groupNumber: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    activityTitle: {
      type: String,
      required: true,
    },

    instructor: {
      type: String,
      required: true,
    },

    members: {
      type: [String],
      default: [],
    },

    cart: [
      {
        id: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    // Request Status
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "released",
        "returned",
        "rejected",
      ],
      default: "pending",
    },

    // Approval Information
    approvedBy: {
      type: String,
      default: "",
    },

    approvedDate: {
      type: Date,
      default: null,
    },

    // Release Information
    releasedBy: {
      type: String,
      default: "",
    },

    releasedDate: {
      type: Date,
      default: null,
    },

    // Return Information
    returnedBy: {
      type: String,
      default: "",
    },

    returnedDate: {
      type: Date,
      default: null,
    },

    // Rejection
    rejectedBy: {
      type: String,
      default: "",
    },

    rejectedDate: {
      type: Date,
      default: null,
    },

    rejectReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Request ||
  mongoose.model("Request", requestSchema);