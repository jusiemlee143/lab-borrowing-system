import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },

    employeeId: {
      type: String,
      required: false,
      trim: true,
    },

    studentId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    department: {
      type: String,
    },

    contactNumber: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "lic",
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // PASSWORD RESET
    // =====================================================

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// =====================================================
// HASH PASSWORD BEFORE SAVE
// =====================================================

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// =====================================================
// COMPARE PASSWORD
// =====================================================

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);