const express = require("express");
const router = express.Router();

const {
  getMyPortfolio,
  createOrUpdatePortfolio,
  getPortfolioBySubdomain,
  convertResumeToPortfolio,
} = require("../controllers/portfolioController");

const protect = require("../middleware/authMiddleware");

// Private CRUD
router.get("/me", protect, getMyPortfolio);
router.post("/", protect, createOrUpdatePortfolio);
router.post("/convert/:resumeId", protect, convertResumeToPortfolio);

// Public Subdomain Fetch
router.get("/subdomain/:subdomain", getPortfolioBySubdomain);

module.exports = router;
