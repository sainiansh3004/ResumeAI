import axios from "axios";

const API_URL = "http://localhost:5001/api/ai";

export const generateSummary = async (resume: any) => {
  const response = await axios.post(
    `${API_URL}/generate-summary`,
    resume
  );

  return response.data;
};