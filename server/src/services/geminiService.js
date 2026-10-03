require("dotenv").config();

const OpenAI = require("openai");

// ==========================
// Groq Client (OpenAI-compatible)
// ==========================
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const MODELS = [
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "allam-2-7b",
];

// ==========================
// Shared Groq API caller with Auto-Fallback
// ==========================
const callGroq = async (prompt, options = {}) => {
  let lastError = null;

  for (const modelName of MODELS) {
    try {
      const response = await groq.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        temperature: options.temperature ?? 0.5,
        max_tokens: options.max_tokens ?? 3072,
        ...(options.response_format ? { response_format: options.response_format } : {}),
      });

      const content = response.choices[0]?.message?.content ?? "";
      if (content && content.trim()) {
        console.log(`✅ Successfully generated response using AI model: ${modelName}`);
        return content;
      }
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} rate limited or failed (${err.message}). Trying fallback model...`);
      lastError = err;
    }
  }

  throw lastError || new Error("All Groq AI models failed to respond.");
};

// Helper to strip heavy fields (like base64 photos) before sending to LLM
const cleanResumeForSummary = (data) => {
  if (!data || typeof data !== "object") return String(data || "");

  const pi = data.personalInfo || {};
  return {
    fullName: pi.fullName || pi.name || "",
    headline: pi.headline || pi.title || "",
    skills: Array.isArray(data.skills) ? data.skills : [],
    experience: Array.isArray(data.experience)
      ? data.experience.map((e) => ({
          company: e.company || "",
          position: e.position || e.role || "",
          description: e.description || "",
        }))
      : [],
    education: Array.isArray(data.education)
      ? data.education.map((e) => ({
          institution: e.college || e.institution || "",
          degree: e.degree || "",
          field: e.fieldOfStudy || e.field || "",
        }))
      : [],
    projects: Array.isArray(data.projects)
      ? data.projects.map((p) => ({
          name: p.title || p.name || "",
          description: p.description || "",
          technologies: p.technologies || [],
        }))
      : [],
    certifications: Array.isArray(data.certifications)
      ? data.certifications.map((c) => (typeof c === "string" ? c : c.name || ""))
      : [],
  };
};

// ==========================
// Generate Summary
// ==========================
const generateSummary = async (resumeData) => {
  const cleanedData =
    typeof resumeData === "object" && resumeData !== null
      ? cleanResumeForSummary(resumeData)
      : resumeData;

  const formattedData =
    typeof cleanedData === "string"
      ? cleanedData
      : JSON.stringify(cleanedData, null, 2);

  const prompt = `You are a professional resume writer.

Generate a strong, ATS-friendly professional summary using the data below.

----------------------------------------

DATA:
${formattedData}

----------------------------------------

RULES:

- Write 3–4 lines only
- Use strong action words
- Highlight:
  - Skills
  - Technologies
  - Experience
  - Impact (metrics if available)
- Make it concise and impactful
- Do NOT add fake information
- Do NOT repeat raw data
- Make it sound like a real resume summary

----------------------------------------

OUTPUT:

Return ONLY the summary text (no JSON, no explanation)`;

  return callGroq(prompt, { temperature: 0.3, max_tokens: 500 });
};

// ==========================
// Optimize Experience Bullets
// ==========================
const optimizeExperience = async (experienceText, jobTitle) => {
  const prompt = `
You are a senior resume consultant and career strategist.

Rewrite the following job experience description using powerful, ATS-friendly language.

Current Description:
${experienceText}

${jobTitle ? `Target Role: ${jobTitle}` : ""}

Requirements:
- Use strong action verbs (Led, Engineered, Spearheaded, Optimized, Architected).
- Include quantified results where possible (%, $, time saved).
- Keep each bullet to 1-2 concise lines.
- Format as bullet points, one per line, starting with "•".
- Return ONLY the rewritten bullet points, nothing else.
`;

  return callGroq(prompt);
};

// ==========================
// Generate Cover Letter
// ==========================
const generateCoverLetter = async (resumeData, jobDescription) => {
  const prompt = `
You are a professional cover letter writer for top-tier companies.

Write a compelling, personalized cover letter.

Candidate Details:
Name: ${resumeData.personalInfo?.fullName || "Candidate"}
Headline: ${resumeData.personalInfo?.headline || ""}
Skills: ${(resumeData.skills || []).join(", ")}
Experience: ${(resumeData.experience || [])
    .map((exp) => `${exp.position} at ${exp.company}: ${exp.description || ""}`)
    .join("; ")}

Target Job Description:
${jobDescription || "General application"}

Requirements:
- Professional tone, 3-4 paragraphs.
- Reference specific skills and experiences from the candidate's profile.
- Tailor to the job description provided.
- Do NOT use placeholder brackets like [Company Name].
- Return ONLY the cover letter body text.
`;

  return callGroq(prompt);
};

// ==========================
// Recommend Skills
// ==========================
const recommendSkills = async (currentSkills, jobTitle) => {
  const prompt = `
You are a career advisor and hiring manager with expertise across technology, business, and design.

Current Skills: ${(currentSkills || []).join(", ")}
Target Job Title: ${jobTitle || "Software Engineer"}

Suggest 10-15 additional skills the candidate should add to their resume for this role.

Requirements:
- Only suggest skills NOT already in the current list.
- Mix technical and soft skills relevant to the job title.
- Return as a JSON array of strings, e.g. ["Skill 1", "Skill 2"].
- Return ONLY the JSON array, no extra text or markdown.
`;

  return callGroq(prompt);
};

// ==========================
// Parse Resume from Text (PDF/Text)
// ==========================
const parseResumeFromText = async (resumeText) => {
  const cleanedText = (resumeText || "")
    .replace(/\n\s*\n+/g, "\n")
    .trim()
    .substring(0, 8000);

  const prompt = `You are an expert resume parser.

Extract all information from the given resume text and convert it into structured JSON.

Return ONLY valid JSON. Do NOT include explanations or extra text.

----------------------------------------

OUTPUT FORMAT (STRICT):

{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "website": "",
    "summary": ""
  },

  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "location": "",
      "description": ""
    }
  ],

  "experience": [
    {
      "company": "",
      "position": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "description": []
    }
  ],

  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "github": "",
      "liveUrl": ""
    }
  ],

  "skills": [],
  "certifications": [],
  "achievements": [],
  "languages": [],
  "interests": []
}

----------------------------------------

RULES:

- Do NOT invent any data
- Extract everything present in the resume
- Keep bullet points as arrays in experience.description
- Preserve numbers, percentages, and metrics
- Internships → experience
- Clean formatting (remove symbols/icons)
- Normalize dates (e.g., June 2025 – July 2025)
- Extract all technologies into skills/projects
- If summary is missing → generate a short professional one

Return valid JSON parsable with JSON.parse()

----------------------------------------

RESUME TEXT:

${cleanedText}`;

  return callGroq(prompt, { temperature: 0.1, max_tokens: 4096, response_format: { type: "json_object" } });
};

module.exports = {
  generateSummary,
  optimizeExperience,
  generateCoverLetter,
  recommendSkills,
  parseResumeFromText,
};