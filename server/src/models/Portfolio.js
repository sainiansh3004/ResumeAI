const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subdomain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    title: {
      type: String,
      default: "My Portfolio Website",
    },

    theme: {
      type: String,
      enum: ["modern", "sleek", "minimal", "creative"],
      default: "modern",
    },

    themeColor: {
      type: String,
      default: "blue",
    },

    views: {
      type: Number,
      default: 0,
    },

    personalInfo: {
      fullName: { type: String, default: "" },
      headline: { type: String, default: "" },
      photo: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      summary: { type: String, default: "" },
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: [
      {
        company: { type: String, default: "" },
        position: { type: String, default: "" },
        location: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        currentlyWorking: { type: Boolean, default: false },
        description: { type: String, default: "" },
      },
    ],

    education: [
      {
        college: { type: String, default: "" },
        degree: { type: String, default: "" },
        fieldOfStudy: { type: String, default: "" },
        startYear: { type: String, default: "" },
        endYear: { type: String, default: "" },
        cgpa: { type: String, default: "" },
      },
    ],

    projects: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        technologies: { type: [String], default: [] },
        github: { type: String, default: "" },
        liveDemo: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
