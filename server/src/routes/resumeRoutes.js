const express = require("express");
const router = express.Router();

const {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");

// ==========================
// Create Resume
// ==========================
router.post("/", protect, createResume);

// ==========================
// Get All Resumes
// ==========================
router.get("/", protect, getMyResumes);

// ==========================
// Get Resume By ID
// ==========================
router.get("/:id", protect, getResumeById);

// ==========================
// Update Resume
// ==========================
router.put("/:id", protect, updateResume);

// ==========================
// Delete Resume
// ==========================
router.delete("/:id", protect, deleteResume);

// ==========================
// Duplicate Resume
// ==========================
router.post("/:id/duplicate", protect, duplicateResume);

module.exports = router;