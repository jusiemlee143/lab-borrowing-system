import mongoose from "mongoose";

const requestHistorySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "created",
        "approved",
        "rejected",
        "released",
        "returned",
      ],
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    performedByName: {
      type: String,
      required: true,
    },

    performedByEmail: {
      type: String,
      default: "",
    },

    performedByEmployeeId: {
      type: String,
      default: "",
    },

    performedAt: {
      type: Date,
      default: Date.now,
    },

    reason: {
      type: String,
      default: "",
    },

    details: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
  }
);

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

    // =====================================================
    // INSTRUCTOR / TEACHER
    // =====================================================

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    members: {
      type: [String],
      default: [],
    },

    // =====================================================
    // CART
    // =====================================================

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

    // =====================================================
    // REQUEST STATUS
    // =====================================================

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

    // =====================================================
    // APPROVAL INFORMATION
    // =====================================================

    approvedBy: {
      type: String,
      default: "",
    },

    approvedDate: {
      type: Date,
      default: null,
    },

    // =====================================================
    // RELEASE INFORMATION
    // =====================================================

    releasedBy: {
      type: String,
      default: "",
    },

    releasedDate: {
      type: Date,
      default: null,
    },

    // =====================================================
    // RETURN INFORMATION
    // =====================================================

    returnedBy: {
      type: String,
      default: "",
    },

    returnedDate: {
      type: Date,
      default: null,
    },

    // =====================================================
    // REJECTION INFORMATION
    // =====================================================

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

    // =====================================================
    // HISTORY / AUDIT TRAIL
    // =====================================================

    history: {
      type: [requestHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Request ||
  mongoose.model("Request", requestSchema);