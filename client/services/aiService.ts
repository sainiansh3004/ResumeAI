import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const generateSummary = async (resume: any) => {
  const response = await axios.post(
    `${API_URL}/ai/generate-summary`,
    resume
  );
  return response.data;
};

export const optimizeExperience = async (experienceText: string, jobTitle: string) => {
  const response = await axios.post(
    `${API_URL}/ai/optimize-experience`,
    { experienceText, jobTitle }
  );
  return response.data;
};

export const generateCoverLetter = async (resume: any, jobDescription: string) => {
  const response = await axios.post(
    `${API_URL}/ai/generate-cover-letter`,
    { resume, jobDescription }
  );
  return response.data;
};

export const recommendSkills = async (currentSkills: string[], jobTitle: string) => {
  const response = await axios.post(
    `${API_URL}/ai/recommend-skills`,
    { currentSkills, jobTitle }
  );
  return response.data;
};