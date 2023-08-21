const mongoose = require("mongoose");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      default: "",
      trim: true,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
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
      trim: true,
    },
    role: {
      type: String,
      enum: [
        "admin",
        "user",
        "referee",
        "coach",
        "parent",
        "player",
        "gameStaff",
        "programStaff",
        "fan",
      ],
      default: "user",
    },
    birthdate: {
      type: Date,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    loginType: {
      type: String,
      enum: ["email", "google", "twitter", "facebook", "apple"],
      default: "email",
    },
    refreshToken: {
      type: String,
      default: null,
    },
    refreshTokenExpireAt: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    facebookId: {
      type: String,
    },
    appleId: {
      type: String,
    },
    twitterId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "active",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    gender: {
      type: String,
    },
    accessPermissions: {
      type: [String],
      enum: ["events", "staffing", "venues", "teams"],
    },
    fcmToken: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
// Join name from the firstName lastName
userSchema.pre("save", function (next) {
  if (!this.isModified("firstName lastName")) {
    next();
  }
  this.name = this.firstName + " " + this.lastName;
  next();
});
// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
// get age of person
userSchema.virtual("age").get(function () {
  if (this.birthdate)
    return Math.floor(
      (Date.now() - this.birthdate.getTime()) / (1000 * 3600 * 24 * 365)
    );
});
const user = mongoose.model("user", userSchema);
module.exports = user;
