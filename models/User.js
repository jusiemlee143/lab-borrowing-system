import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC INFORMATION
    // =====================================================

    fullName: {
      type: String,
      required: true,
    },

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

    course: {
      type: String,
      required: false,
      trim: true,
    },

    department: {
      type: String,
    },

    contactNumber: {
      type: String,
    },

    // =====================================================
    // EMAIL
    // =====================================================

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // PASSWORD
    // =====================================================

    password: {
      type: String,
      required: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // ROLE
    // =====================================================

    role: {
      type: String,
      default: "lic",
    },

    // =====================================================
    // ACCOUNT STATUS
    // =====================================================
    // true  = account can log in
    // false = account is disabled
    //
    // Default is true so existing/new accounts remain active
    // unless the Admin specifically disables them.
    // =====================================================

    isActive: {
      type: Boolean,
      default: true,
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
  {
    timestamps: true,
  }
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

// =====================================================
// EXPORT MODEL
// =====================================================

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);