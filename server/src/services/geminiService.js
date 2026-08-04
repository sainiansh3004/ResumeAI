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
  "llama-3.1-8b-instant",
  "llama3-70b-8192",
  "llama3-8b-8192",
  "mixtral-8x7b-32768",
  "llama-3.3-70b-versatile",
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

// ==========================
// Generate Summary
// ==========================
const generateSummary = async (resumeData) => {
  const prompt = `
You are an expert ATS Resume Writer.

Generate a professional ATS-friendly resume summary.

Candidate Details

Name:
${resumeData.personalInfo?.fullName || ""}

Headline:
${resumeData.personalInfo?.headline || ""}

Skills:
${(resumeData.skills || []).join(", ")}

Education:
${(resumeData.education || [])
  .map(
    (edu) =>
      `${edu.degree || ""} ${edu.fieldOfStudy || ""} ${edu.college || ""}`
  )
  .join("\n")}

Experience:
${(resumeData.experience || [])
  .map(
    (exp) =>
`${exp.position || ""}
${exp.company || ""}
${exp.description || ""}`
  )
  .join("\n\n")}

Requirements:
- 4-5 lines
- ATS Friendly
- Professional
- Return ONLY the summary text, no labels or headers.
`;

  return callGroq(prompt);
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
    .substring(0, 4000);

  const prompt = `
Extract and structure candidate details into JSON matching this structure:
{
  "title": "Resume",
  "personalInfo": { "fullName": "", "headline": "", "email": "", "phone": "", "address": "", "linkedin": "", "github": "", "portfolio": "", "summary": "" },
  "education": [{ "college": "", "degree": "", "fieldOfStudy": "", "startYear": "", "endYear": "", "cgpa": "" }],
  "experience": [{ "company": "", "position": "", "location": "", "employmentType": "", "startDate": "", "endDate": "", "currentlyWorking": false, "description": "" }],
  "skills": [],
  "projects": [{ "title": "", "description": "", "technologies": [], "github": "", "liveDemo": "" }],
  "certifications": [{ "name": "", "organization": "", "issueDate": "" }],
  "achievements": [{ "title": "", "description": "" }],
  "languages": [{ "name": "", "proficiency": "" }],
  "interests": [{ "name": "" }]
}

Resume Text:
${cleanedText}

Rules:
- Extract all experience, projects, skills, education, certifications, and achievements.
- Preserve bullet points and descriptions in full text inside "description".
- achievements/languages/interests/projects/education MUST use array of objects with keys specified above.
- Return ONLY valid raw JSON without markdown formatting.
`;

  return callGroq(prompt, { temperature: 0.1, max_tokens: 3000, response_format: { type: "json_object" } });
};

module.exports = {
  generateSummary,
  optimizeExperience,
  generateCoverLetter,
  recommendSkills,
  parseResumeFromText,
};