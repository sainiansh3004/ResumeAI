const express = require("express");

const {
  generateResumeSummary,
} = require("../controllers/aiController");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "AI Route Working",
  });
});

router.post("/generate-summary", generateResumeSummary);

module.exports = router;