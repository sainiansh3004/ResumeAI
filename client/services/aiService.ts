import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://resumeai-qfs2.onrender.com/api";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const generateSummary = async (resume: any) => {
  const response = await axios.post(
    `${API_URL}/ai/generate-summary`,
    resume,
    getHeaders()
  );
  return response.data;
};

export const optimizeExperience = async (experienceText: string, jobTitle: string) => {
  const response = await axios.post(
    `${API_URL}/ai/optimize-experience`,
    { experienceText, jobTitle },
    getHeaders()
  );
  return response.data;
};

export const generateCoverLetter = async (resume: any, jobDescription: string) => {
  const response = await axios.post(
    `${API_URL}/ai/generate-cover-letter`,
    { resume, jobDescription },
    getHeaders()
  );
  return response.data;
};

export const recommendSkills = async (currentSkills: string[], jobTitle: string) => {
  const response = await axios.post(
    `${API_URL}/ai/recommend-skills`,
    { currentSkills, jobTitle },
    getHeaders()
  );
  return response.data;
};

export const parsePdfResume = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "multipart/form-data",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.post(`${API_URL}/ai/parse-pdf`, formData, { headers });
  return response.data;
};