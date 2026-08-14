import mongoose from "mongoose";

const RequestHistorySchema = new mongoose.Schema(
  {
    // =====================================================
    // REQUEST REFERENCE
    // =====================================================

    // The Request document this history entry belongs to
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
      index: true,
    },

    // =====================================================
    // ACTION
    // =====================================================

    action: {
      type: String,
      enum: [
        "created",
        "approved",
        "rejected",
        "released",
        "returned",
        "edited",
        "cancelled",
      ],
      required: true,
    },

    // =====================================================
    // PERFORMED BY
    // =====================================================

    /*
     * Stores information about the person who performed
     * the action.
     *
     * For LIC actions:
     *
     * userId    = authenticated User ID
     * fullName  = LIC full name
     * employeeId = LIC employee ID
     *
     * For student-created requests:
     *
     * userId    = null
     * fullName  = student name
     * employeeId = ""
     */

    performedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      fullName: {
        type: String,
        required: true,
      },

      employeeId: {
        type: String,
        default: "",
      },
    },

    // =====================================================
    // REASON
    // =====================================================

    /*
     * Mainly used for rejected requests.
     *
     * Example:
     *
     * "Requested tools are unavailable"
     */

    reason: {
      type: String,
      default: "",
    },
  },

  // =======================================================
  // TIMESTAMPS
  // =======================================================

  {
    timestamps: true,
  }
);

// =========================================================
// MODEL
// =========================================================

export default mongoose.models.RequestHistory ||
  mongoose.model(
    "RequestHistory",
    RequestHistorySchema
  );