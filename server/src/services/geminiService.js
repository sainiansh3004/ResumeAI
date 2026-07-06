require("dotenv").config();

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

module.exports = {
  generateSummary,
};