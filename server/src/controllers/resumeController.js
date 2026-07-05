const Resume = require("../models/Resume");

// ==========================
// Create Resume
// ==========================
const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
  user: req.user.id,
  title: req.body.title || "Untitled Resume",
});

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume,
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
// Update Resume
// ==========================
const updateResume = async (req, res) => {
  try {
    console.log("========== UPDATE REQUEST ==========");
    console.log(JSON.stringify(req.body, null, 2));

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
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

module.exports = {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
};