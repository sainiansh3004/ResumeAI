const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
  sendPremiumOtp,
  verifyPremiumOtp,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/verify-otp", verifyOtp);

router.post("/resend-otp", resendOtp);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get("/profile", protect, getProfile);

router.post("/send-premium-otp", protect, sendPremiumOtp);

router.post("/verify-premium-otp", protect, verifyPremiumOtp);

module.exports = router;