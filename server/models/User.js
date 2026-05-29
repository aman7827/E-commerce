/**
 * User.js
 * Purpose: Mongoose schema for the User model.
 * Handles authentication fields, role-based access, password hashing,
 * email verification, and password reset tokens.
 *
 * Interview Q: Why hash passwords in pre-save middleware instead of the controller?
 * A: Mongoose middleware ensures passwords are ALWAYS hashed, even if
 *    someone calls user.save() from a different part of the codebase.
 *    The controller cannot forget — it's enforced at the model level.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // ─── Basic Info ──────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,           // Creates an index for fast lookups
      lowercase: true,        // Normalize email before saving
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never return password in queries by default
    },

    // ─── Role & Permissions ───────────────────────────────────────────
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ─── Avatar ───────────────────────────────────────────────────────
    avatar: {
      type: String,
      default: "", // Cloudinary URL — empty string means no avatar set
    },

    // ─── Email Verification ────────────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      select: false, // Never expose verification tokens in API responses
    },

    emailVerificationExpiry: {
      type: Date,
      select: false,
    },

    // ─── Password Reset ────────────────────────────────────────────────
    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpiry: {
      type: Date,
      select: false,
    },

    // ─── Relations (populated as needed, not always fetched) ──────────
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
  },
  {
    // ─── Schema Options ────────────────────────────────────────────────
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: {
      // Remove __v from API responses
      transform(doc, ret) {
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────
// email is already indexed via unique: true
// Index resetPasswordToken for fast token lookups during password reset
userSchema.index({ resetPasswordToken: 1 });
userSchema.index({ emailVerificationToken: 1 });

// ─── Pre-Save Middleware: Hash Password ──────────────────────────────────
/**
 * Runs before every user.save() call.
 * Only hashes the password if it was modified (avoids re-hashing on profile update).
 * bcryptjs saltRounds=12 → strong security with acceptable performance.
 */
userSchema.pre("save", async function (next) {
  // Only run if password was actually changed
  if (!this.isModified("password")) return next();

  try {
    // Salt rounds = 12 (higher = more secure but slower)
    // 10 rounds: ~100ms | 12 rounds: ~400ms | 14 rounds: ~1.5s
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ─── Instance Method: Compare Passwords ─────────────────────────────────
/**
 * matchPassword — Compares a plain-text password against the stored hash.
 * Used in authController during login.
 *
 * @param {string} enteredPassword - The plain-text password from login form
 * @returns {Promise<boolean>} true if match, false otherwise
 *
 * Interview Q: Why use bcrypt.compare instead of hashing and comparing?
 * A: bcrypt embeds the salt in the hash. You can't recreate the same hash
 *    from just the password + a new salt. bcrypt.compare re-uses the
 *    embedded salt to produce the same hash for comparison.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  // this.password is normally excluded from queries (select: false)
  // Must explicitly .select("+password") in the controller before calling this
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
