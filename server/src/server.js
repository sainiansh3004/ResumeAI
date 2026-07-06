const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
console.log("AI ROUTER TYPE:", typeof aiRoutes);

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://resume-ai-six-beta.vercel.app",
  "https://resume-ai-git-main-ansh-saini-s-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Increase request body size for Base64 profile photos
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  console.log("➡️", req.method, req.originalUrl);
  next();
});

// ===== DIAGNOSTIC =====
app.get("/hello-test", (req, res) => {
  res.send("SERVER UPDATED");
});

console.log("AI ROUTER LOADED:", typeof aiRoutes);
// ======================

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.get("/debug-ai", (req, res) => {
  res.json({
    aiRouterType: typeof aiRoutes,
    mounted: true,
  });
});
app.use("/api/ai", aiRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "THIS IS MY NEW SERVER",
  });
});

app.get("/debug-ai", (req, res) => {
  res.json({
    success: true,
    message: "DEBUG ROUTE WORKING",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});