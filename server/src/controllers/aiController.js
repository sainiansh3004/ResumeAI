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

  // personalInfo: must use fullName and standard keys
  const pi = safe.personalInfo || {};
  safe.personalInfo = {
    fullName: pi.fullName || pi.name || pi.candidateName || "",
    headline: pi.headline || pi.title || pi.role || pi.designation || "",
    email: pi.email || "",
    phone: pi.phone || pi.mobile || pi.contact || "",
    address: pi.address || pi.location || pi.city || "",
    linkedin: pi.linkedin || "",
    github: pi.github || "",
    portfolio: pi.portfolio || pi.website || "",
    summary: pi.summary || pi.bio || pi.about || "",
  };

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

  // Helper to format descriptions or bullet arrays safely
  const formatDesc = (val) => {
    if (!val) return "";
    if (Array.isArray(val)) {
      return val.map((b) => (typeof b === "string" ? b : JSON.stringify(b))).join("\n• ");
    }
    return String(val);
  };

  // projects: must use title, technologies (array), github, liveDemo
  if (Array.isArray(safe.projects)) {
    safe.projects = safe.projects.map((item) => {
      if (typeof item === "string") return { title: item, description: "", technologies: [], github: "", liveDemo: "" };
      let techs = item.technologies || item.techStack || [];
      if (typeof techs === "string") techs = techs.split(",").map((t) => t.trim()).filter(Boolean);
      return {
        title: item.title || item.name || "",
        description: formatDesc(item.description || item.details || item.bullets || item.highlights),
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
      description: formatDesc(item.description || item.details || item.bullets || item.responsibilities || item.highlights),
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
      console.log("📄 PDF file received, size:", req.file.size, "bytes, mimetype:", req.file.mimetype);

      // Step 1: Try pdfjs-dist text extraction (works for text-based PDFs)
      const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.mjs");
      try {
        const uint8Array = new Uint8Array(req.file.buffer);
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdfDoc = await loadingTask.promise;
        const numPages = pdfDoc.numPages;
        console.log("📄 PDF loaded successfully, pages:", numPages);

        const pageTexts = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => item.str)
            .join(" ");
          pageTexts.push(pageText);
        }
        extractedText = pageTexts.join("\n").trim();
      } catch (pdfjsErr) {
        console.warn("⚠️ pdfjs-dist extraction failed:", pdfjsErr.message);
      }

      console.log("📄 Text extraction result:", extractedText.length, "chars");

      // Step 2: If text is empty/tiny, this is a scanned/image PDF — use OCR
      if (!extractedText || extractedText.trim().length < 50) {
        console.log("📄 Text layer is empty — running Tesseract OCR on PDF images...");
        try {
          const Tesseract = require("tesseract.js");
          const sharp = require("sharp");

          const uint8Array = new Uint8Array(req.file.buffer);
          const pdfDoc = await pdfjsLib.getDocument({ data: uint8Array }).promise;
          const ocrTexts = [];

          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const ops = await page.getOperatorList();

            for (let j = 0; j < ops.fnArray.length; j++) {
              // Operator 85 = paintImageXObject in pdfjs-dist v5
              if (ops.fnArray[j] === 85) {
                try {
                  const imgName = ops.argsArray[j][0];
                  // Use callback-based objs.get for async image retrieval
                  const imgData = await new Promise((resolve, reject) => {
                    page.objs.get(imgName, (data) => resolve(data));
                    setTimeout(() => reject(new Error("Image fetch timeout")), 10000);
                  });

                  if (imgData && imgData.data) {
                    const { width, height, data } = imgData;
                    const channels = Math.round(data.length / (width * height));
                    const pngBuf = await sharp(Buffer.from(data), {
                      raw: { width, height, channels: channels >= 4 ? 4 : 3 },
                    }).png().toBuffer();

                    const { data: { text: ocrText } } = await Tesseract.recognize(pngBuf, "eng");
                    if (ocrText && ocrText.trim()) {
                      ocrTexts.push(ocrText.trim());
                      console.log("📄 OCR page", i, "extracted:", ocrText.trim().length, "chars");
                    }
                  }
                } catch (imgErr) {
                  console.warn("⚠️ OCR image error on page", i, ":", imgErr.message);
                }
              }
            }
          }

          if (ocrTexts.length > 0) {
            extractedText = ocrTexts.join("\n");
            console.log("📄 OCR total extracted:", extractedText.length, "chars");
          }
        } catch (ocrErr) {
          console.error("⚠️ OCR fallback failed:", ocrErr.message);
        }
      }

      console.log("📄 Final extracted text length:", extractedText.length, "chars");
      console.log("📄 Final text preview:", extractedText.substring(0, 500));
    } else if (req.body.text) {
      extractedText = req.body.text;
    }

    if (!extractedText || !extractedText.trim()) {
      return res.status(400).json({
        success: false,
        message: "No readable text found in PDF. If your resume is a scanned image, please use a text-based PDF instead.",
      });
    }

    const rawResult = await parseResumeFromText(extractedText);

    let parsedResume = {};
    try {
      let cleaned = rawResult.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
      try {
        parsedResume = JSON.parse(cleaned);
      } catch (e1) {
        // Fix potential trailing commas or truncated closing braces/brackets
        let repaired = cleaned.replace(/,\s*([\}\]])/g, "$1");
        try {
          parsedResume = JSON.parse(repaired);
        } catch (e2) {
          // Attempt automatic bracket/quote repair for truncated output
          if (repaired.length > 10) {
            const quoteCount = (repaired.match(/"/g) || []).length;
            if (quoteCount % 2 !== 0) repaired += '"';
            let openCurly = (repaired.match(/\{/g) || []).length;
            let closeCurly = (repaired.match(/\}/g) || []).length;
            let openSquare = (repaired.match(/\[/g) || []).length;
            let closeSquare = (repaired.match(/\]/g) || []).length;
            while (openSquare > closeSquare) { repaired += ']'; closeSquare++; }
            while (openCurly > closeCurly) { repaired += '}'; closeCurly++; }
            parsedResume = JSON.parse(repaired);
          } else {
            throw e2;
          }
        }
      }
    } catch (e) {
      console.error("JSON parse error from AI:", e, "\nRaw AI output was:\n", rawResult);
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