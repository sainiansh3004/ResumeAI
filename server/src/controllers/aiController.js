const { PDFParse } = require("pdf-parse");
const {
  generateSummary,
  optimizeExperience: optimizeExpService,
  generateCoverLetter: coverLetterService,
  recommendSkills: recommendSkillsService,
  parseResumeFromText,
} = require("../services/geminiService");

// ==========================
// Generate Summary
// ==========================
const generateResumeSummary = async (req, res) => {
  try {
    const resume = req.body;

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Resume data is required.",
      });
    }

    const summary = await generateSummary(resume);

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate summary.",
      error: error.message,
    });
  }
};

// ==========================
// Optimize Experience Bullets
// ==========================
const optimizeExperience = async (req, res) => {
  try {
    const { experienceText, jobTitle } = req.body;

    if (!experienceText) {
      return res.status(400).json({
        success: false,
        message: "Experience text is required.",
      });
    }

    const optimized = await optimizeExpService(experienceText, jobTitle || "");

    return res.status(200).json({
      success: true,
      optimized,
    });
  } catch (error) {
    console.error("Optimize Experience Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to optimize experience.",
      error: error.message,
    });
  }
};

// ==========================
// Generate Cover Letter
// ==========================
const generateCoverLetter = async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Resume data is required.",
      });
    }

    const coverLetter = await coverLetterService(resume, jobDescription || "");

    return res.status(200).json({
      success: true,
      coverLetter,
    });
  } catch (error) {
    console.error("Cover Letter Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate cover letter.",
      error: error.message,
    });
  }
};

// ==========================
// Recommend Skills
// ==========================
const recommendSkills = async (req, res) => {
  try {
    const { currentSkills, jobTitle } = req.body;

    const rawResult = await recommendSkillsService(
      currentSkills || [],
      jobTitle || "Software Engineer"
    );

    // Parse the JSON array from the AI response
    let skills = [];
    try {
      const cleaned = rawResult.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      skills = JSON.parse(cleaned);
    } catch {
      // Fallback: split by newlines if JSON parsing fails
      skills = rawResult
        .split("\n")
        .map((s) => s.replace(/^[-•*]\s*/, "").replace(/"/g, "").trim())
        .filter(Boolean);
    }

    return res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    console.error("Recommend Skills Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to recommend skills.",
      error: error.message,
    });
  }
};

// ==========================
// Parse PDF Resume
// ==========================
const parseResumePdf = async (req, res) => {
  try {
    let extractedText = "";

    if (req.file) {
      const parser = new PDFParse({ data: req.file.buffer });
      const parsedData = await parser.getText();
      extractedText = parsedData.text || "";
    } else if (req.body.text) {
      extractedText = req.body.text;
    }

    if (!extractedText || !extractedText.trim()) {
      return res.status(400).json({
        success: false,
        message: "No readable text found in PDF resume file.",
      });
    }

    const rawResult = await parseResumeFromText(extractedText);

    let parsedResume = {};
    try {
      const cleaned = rawResult.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      parsedResume = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON parse error from AI:", e);
      return res.status(500).json({
        success: false,
        message: "Failed to format structured resume data from AI response.",
      });
    }

    return res.status(200).json({
      success: true,
      resume: parsedResume,
    });
  } catch (error) {
    console.error("Parse PDF Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to parse PDF resume.",
      error: error.message,
    });
  }
};

module.exports = {
  generateResumeSummary,
  optimizeExperience,
  generateCoverLetter,
  recommendSkills,
  parseResumePdf,
};