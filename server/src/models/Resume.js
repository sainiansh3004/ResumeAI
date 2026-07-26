const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    template: {
      type: String,
      enum: ["modern", "minimal", "ats", "creative", "executive", "tech", "academic", "sleek", "offcampus"],
      default: "offcampus",
    },

    themeColor: {
      type: String,
      enum: ["blue", "purple", "green", "black", "red"],
      default: "blue",
    },

    title: {
      type: String,
      required: true,
      default: "Untitled Resume",
    },

    personalInfo: {
      fullName: {
        type: String,
        default: "",
      },

      // Professional Headline
      headline: {
        type: String,
        default: "",
      },

      // Profile Photo (Base64)
      photo: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },

      github: {
        type: String,
        default: "",
      },

      portfolio: {
        type: String,
        default: "",
      },

      summary: {
        type: String,
        default: "",
      },
    },

    education: [
      {
        college: {
          type: String,
          default: "",
        },

        degree: {
          type: String,
          default: "",
        },

        fieldOfStudy: {
          type: String,
          default: "",
        },

        startYear: {
          type: String,
          default: "",
        },

        endYear: {
          type: String,
          default: "",
        },

        cgpa: {
          type: String,
          default: "",
        },
      },
    ],

    experience: [
      {
        company: {
          type: String,
          default: "",
        },

        position: {
          type: String,
          default: "",
        },

        location: {
          type: String,
          default: "",
        },

        employmentType: {
          type: String,
          default: "",
        },

        startDate: {
          type: String,
          default: "",
        },

        endDate: {
          type: String,
          default: "",
        },

        currentlyWorking: {
          type: Boolean,
          default: false,
        },

        description: {
          type: String,
          default: "",
        },
      },
    ],

    skills: {
      type: [String],
      default: [],
    },

    projects: [
      {
        title: {
          type: String,
          default: "",
        },

        description: {
          type: String,
          default: "",
        },

        technologies: {
          type: [String],
          default: [],
        },

        github: {
          type: String,
          default: "",
        },

        liveDemo: {
          type: String,
          default: "",
        },
      },
    ],

        certifications: [
      {
        name: {
          type: String,
          default: "",
        },

        organization: {
          type: String,
          default: "",
        },

        issueDate: {
          type: String,
          default: "",
        },
      },
    ],

    achievements: [
      {
        title: {
          type: String,
          default: "",
        },

        description: {
          type: String,
          default: "",
        },
      },
    ],

    languages: [
      {
        name: {
          type: String,
          default: "",
        },

        proficiency: {
          type: String,
          default: "",
        },
      },
    ],

    interests: [
      {
        name: {
          type: String,
          default: "",
        },
      },
    ],

    settings: {
      fontFamily: {
        type: String,
        default: "Inter",
      },
      fontSize: {
        type: String,
        enum: ["sm", "md", "lg"],
        default: "md",
      },
      lineHeight: {
        type: String,
        enum: ["snug", "normal", "relaxed"],
        default: "normal",
      },
      margin: {
        type: String,
        enum: ["compact", "normal", "spacious"],
        default: "normal",
      },
      accentColor: {
        type: String,
        default: "",
      },
      showPageNumbers: {
        type: Boolean,
        default: true,
      },
    },

    customTitles: {
      type: Map,
      of: String,
      default: {},
    },

    hiddenSections: {
      type: [String],
      default: [],
    },

    sectionOrder: {
      type: [String],
      default: ["experience", "education", "skills", "projects", "certifications", "achievements", "languages", "interests"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);