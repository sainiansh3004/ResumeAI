require("dotenv").config();

const OpenAI = require("openai");

// ==========================
// Groq Client (OpenAI-compatible)
// ==========================
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const MODEL = "llama-3.3-70b-versatile";

// ==========================
// Shared Groq API caller
// ==========================
const callGroq = async (prompt, options = {}) => {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: options.temperature ?? 0.5,
    max_tokens: options.max_tokens ?? 3072,
    ...(options.response_format ? { response_format: options.response_format } : {}),
  });

  return response.choices[0]?.message?.content ?? "";
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
  const prompt = `
You are an expert AI ATS Resume Parser. Extract and structure all relevant candidate details from the following resume text into a strict JSON object.

Resume Text:
${resumeText}

Return a valid JSON object matching this EXACT structure (field names MUST match exactly):
{
  "title": "Resume",
  "personalInfo": {
    "fullName": "",
    "headline": "",
    "email": "",
    "phone": "",
    "address": "",
    "linkedin": "",
    "github": "",
    "portfolio": "",
    "summary": ""
  },
  "education": [
    {
      "college": "",
      "degree": "",
      "fieldOfStudy": "",
      "startYear": "",
      "endYear": "",
      "cgpa": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "position": "",
      "location": "",
      "employmentType": "",
      "startDate": "",
      "endDate": "",
      "currentlyWorking": false,
      "description": ""
    }
  ],
  "skills": ["skill1", "skill2"],
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": ["tech1", "tech2"],
      "github": "",
      "liveDemo": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "organization": "",
      "issueDate": ""
    }
  ],
  "achievements": [
    {
      "title": "",
      "description": ""
    }
  ],
  "languages": [
    {
      "name": "",
      "proficiency": ""
    }
  ],
  "interests": [
    {
      "name": ""
    }
  ]
}

Requirements:
- Extract 100% of all candidate information, experience bullet points, project descriptions, skills, certifications, and achievements completely without summarizing, truncating, or omitting any details.
- Preserve EVERY bullet point, responsibility, and achievement from work experience and projects in full text inside "description".
- Set title to the person's full name followed by 'Resume' (e.g. "John Doe Resume") if full name is found, otherwise "Uploaded Resume".
- achievements MUST be an array of objects with "title" and "description" keys. Never return plain strings.
- languages MUST be an array of objects with "name" and "proficiency" keys. Never return plain strings.
- interests MUST be an array of objects with a "name" key. Never return plain strings.
- projects MUST use "title" (not "name"), and "technologies" must be an array of strings (not a single string).
- education MUST use "startYear", "endYear", "cgpa" (not startDate, endDate, gpa).
- certifications MUST use "organization" and "issueDate" (not "issuer" or "date").
- experience MUST use "currentlyWorking" (not "current").
- skills MUST be a flat array of strings containing every technical tool, framework, library, and skill listed.
- If a section or field is not present in the text, use an empty string "" or an empty array [].
- Return ONLY valid raw JSON without extra conversational text.
`;

  return callGroq(prompt, { temperature: 0.1, max_tokens: 8192, response_format: { type: "json_object" } });
};

module.exports = {
  generateSummary,
  optimizeExperience,
  generateCoverLetter,
  recommendSkills,
  parseResumeFromText,
};