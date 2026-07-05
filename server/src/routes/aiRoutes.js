const express = require("express");

const {
  generateResumeSummary,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/generate-summary", generateResumeSummary);

module.exports = router;