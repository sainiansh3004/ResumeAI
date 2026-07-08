const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
} = require("../controllers/razorpayController");

const protect = require("../middleware/authMiddleware");

// Private endpoints for Razorpay checkout flow
router.post("/razorpay-order", protect, createOrder);
router.post("/razorpay-verify", protect, verifyPayment);

module.exports = router;
