const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const billingRoutes = require("./routes/billingRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://resume-ai-alpha-beige.vercel.app",
      ];

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(null, true); // Fallback: allow request
    },
    credentials: true,
  })
);

// Standard JSON parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  console.log("➡️", req.method, req.originalUrl);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/portfolios", portfolioRoutes);
app.use("/api/billing", billingRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({ success: true, message: "ResumeAI API Server" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});