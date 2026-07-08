const express = require("express");

const {
  generateResumeSummary,
  optimizeExperience,
  generateCoverLetter,
  recommendSkills,
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

module.exports = router;