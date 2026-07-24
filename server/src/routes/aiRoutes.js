const express = require("express");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const {
  generateResumeSummary,
  optimizeExperience,
  generateCoverLetter,
  recommendSkills,
  parseResumePdf,
} = require("../controllers/aiController");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "AI Route Working",
  });
});

router.post("/generate-summary", generateResumeSummary);
router.post("/optimize-experience", optimizeExperience);
router.post("/generate-cover-letter", generateCoverLetter);
router.post("/recommend-skills", recommendSkills);
router.post("/parse-pdf", upload.single("file"), parseResumePdf);

module.exports = router;