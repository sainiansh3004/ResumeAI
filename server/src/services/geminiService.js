require("dotenv").config();

// ==========================
// Shared Gemini API caller
// ==========================
const callGemini = async (prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return data.candidates[0].content.parts[0].text;
      }

      lastError = data;

      if (response.status !== 503) {
        throw new Error(JSON.stringify(data));
      }

      console.log(`Gemini busy... retry ${attempt}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(JSON.stringify(lastError));
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
- Return ONLY the summary.
`;

  return callGemini(prompt);
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

  return callGemini(prompt);
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

  return callGemini(prompt);
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
- Return ONLY the JSON array, no extra text.
`;

  return callGemini(prompt);
};

module.exports = {
  generateSummary,
  optimizeExperience,
  generateCoverLetter,
  recommendSkills,
};