const { generateSummary } = require("../services/geminiService");

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

module.exports = {
  generateResumeSummary,
};