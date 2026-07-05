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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  console.log(JSON.stringify(data, null, 2));

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data.candidates[0].content.parts[0].text;
};

module.exports = {
  generateSummary,
};