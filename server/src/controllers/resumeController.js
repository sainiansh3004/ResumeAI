const Resume = require("../models/Resume");

// ==========================
// Create Resume
// ==========================
const createResume = async (req, res) => {
  try {
    let payload = {};

    if (req.body && typeof req.body === "object") {
      if (typeof req.body.title === "string" && !req.body.personalInfo) {
        // Simple title payload: { title: "Untitled Resume" }
        payload = {
          user: req.user.id,
          title: req.body.title || "Untitled Resume",
        };
      } else {
        // Full resume object payload (e.g. imported PDF resume)
        payload = { ...req.body, user: req.user.id };
        delete payload._id;
        delete payload.createdAt;
        delete payload.updatedAt;
        delete payload.__v;
        if (typeof payload.title !== "string") {
          payload.title = "Uploaded Resume";
        }
      }
    } else {
      payload = {
        user: req.user.id,
        title: "Untitled Resume",
      };
    }

    const resume = await Resume.create(payload);

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    console.error("CREATE RESUME ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get All Resumes
// ==========================
const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get Resume By ID
// ==========================
const getResumeById = async (req, res) => {
  try {
    console.log("======================================");
    console.log("Requested Resume ID :", req.params.id);
    console.log("Logged In User ID   :", req.user.id);

    const resume = await Resume.findById(req.params.id);

    console.log("Resume Found:", resume);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found in database",
      });
    }

    console.log("Resume Owner :", resume.user.toString());

    if (resume.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Resume belongs to another user",
        resumeOwner: resume.user.toString(),
        loggedInUser: req.user.id,
      });
    } 

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("GET RESUME ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get Public Resume By ID (No auth required)
// ==========================
const getPublicResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("GET PUBLIC RESUME ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Update Resume
// ==========================
const updateResume = async (req, res) => {
  try {
    console.log("========== UPDATE REQUEST ==========");
    console.log(JSON.stringify(req.body, null, 2));

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.user;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    // Helper to strip subdocument _id if not valid ObjectId
    const cleanArray = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.map((item) => {
        if (typeof item !== "object" || item === null) return item;
        const cleaned = { ...item };
        delete cleaned._id;
        delete cleaned.id;
        return cleaned;
      });
    };

    if (updateData.education) updateData.education = cleanArray(updateData.education);
    if (updateData.experience) updateData.experience = cleanArray(updateData.experience);
    if (updateData.projects) updateData.projects = cleanArray(updateData.projects);
    if (updateData.certifications) updateData.certifications = cleanArray(updateData.certifications);
    if (updateData.achievements) updateData.achievements = cleanArray(updateData.achievements);
    if (updateData.languages) updateData.languages = cleanArray(updateData.languages);
    if (updateData.interests) updateData.interests = cleanArray(updateData.interests);

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    console.log("========== SAVED RESUME ==========");
    console.log(JSON.stringify(resume, null, 2));

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

// ==========================
// Delete Resume
// ==========================
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Duplicate Resume
// ==========================
const duplicateResume = async (req, res) => {
  try {
    const originalResume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const resumeObj = originalResume.toObject();
    delete resumeObj._id;
    delete resumeObj.createdAt;
    delete resumeObj.updatedAt;

    resumeObj.title = `${resumeObj.title} (Copy)`;

    const duplicated = await Resume.create(resumeObj);

    res.status(201).json({
      success: true,
      message: "Resume duplicated successfully",
      resume: duplicated,
    });
  } catch (error) {
    console.error("DUPLICATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createResume,
  getMyResumes,
  getResumeById,
  getPublicResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
};