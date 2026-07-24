const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    isPro: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    resetOtp: {
      type: String,
      default: null,
    },

    resetOtpExpires: {
      type: Date,
      default: null,
    },

    premiumOtp: {
      type: String,
      default: null,
    },

    premiumOtpExpires: {
      type: Date,
      default: null,
    },

    stripeCustomerId: {
      type: String,
      default: "",
    },

    stripeSubscriptionId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);