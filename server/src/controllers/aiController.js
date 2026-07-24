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
// Sanitize AI-parsed resume to match MongoDB schema
// ==========================
const sanitizeResumeData = (data) => {
  const safe = { ...data };

  // achievements: must be [{ title, description }]
  if (Array.isArray(safe.achievements)) {
    safe.achievements = safe.achievements.map((item) => {
      if (typeof item === "string") return { title: item, description: "" };
      return { title: item.title || item.name || "", description: item.description || "" };
    });
  } else {
    safe.achievements = [];
  }

  // languages: must be [{ name, proficiency }]
  if (Array.isArray(safe.languages)) {
    safe.languages = safe.languages.map((item) => {
      if (typeof item === "string") return { name: item, proficiency: "" };
      return { name: item.name || item.language || "", proficiency: item.proficiency || item.level || "" };
    });
  } else {
    safe.languages = [];
  }

  // interests: must be [{ name }]
  if (Array.isArray(safe.interests)) {
    safe.interests = safe.interests.map((item) => {
      if (typeof item === "string") return { name: item };
      return { name: item.name || "" };
    });
  } else {
    safe.interests = [];
  }

  // projects: must use title, technologies (array), github, liveDemo
  if (Array.isArray(safe.projects)) {
    safe.projects = safe.projects.map((item) => {
      if (typeof item === "string") return { title: item, description: "", technologies: [], github: "", liveDemo: "" };
      let techs = item.technologies || item.techStack || [];
      if (typeof techs === "string") techs = techs.split(",").map((t) => t.trim()).filter(Boolean);
      return {
        title: item.title || item.name || "",
        description: item.description || "",
        technologies: Array.isArray(techs) ? techs : [],
        github: item.github || item.link || "",
        liveDemo: item.liveDemo || "",
      };
    });
  } else {
    safe.projects = [];
  }

  // education: must use startYear, endYear, cgpa
  if (Array.isArray(safe.education)) {
    safe.education = safe.education.map((item) => ({
      college: item.college || item.school || item.institution || "",
      degree: item.degree || "",
      fieldOfStudy: item.fieldOfStudy || item.field || "",
      startYear: item.startYear || item.startDate || "",
      endYear: item.endYear || item.endDate || "",
      cgpa: item.cgpa || item.gpa || "",
    }));
  } else {
    safe.education = [];
  }

  // experience: must use currentlyWorking
  if (Array.isArray(safe.experience)) {
    safe.experience = safe.experience.map((item) => ({
      company: item.company || "",
      position: item.position || item.role || item.title || "",
      location: item.location || "",
      employmentType: item.employmentType || "",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
      currentlyWorking: item.currentlyWorking || item.current || false,
      description: item.description || "",
    }));
  } else {
    safe.experience = [];
  }

  // certifications: must use organization, issueDate
  if (Array.isArray(safe.certifications)) {
    safe.certifications = safe.certifications.map((item) => {
      if (typeof item === "string") return { name: item, organization: "", issueDate: "" };
      return {
        name: item.name || "",
        organization: item.organization || item.issuer || "",
        issueDate: item.issueDate || item.date || "",
      };
    });
  } else {
    safe.certifications = [];
  }

  // skills: must be flat array of strings
  if (Array.isArray(safe.skills)) {
    safe.skills = safe.skills.map((s) => (typeof s === "string" ? s : s.name || String(s)));
  } else {
    safe.skills = [];
  }

  return safe;
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

    // Sanitize to match exact MongoDB schema shapes
    parsedResume = sanitizeResumeData(parsedResume);

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