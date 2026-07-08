import axios from "axios";

const API_URL =
  `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/portfolios`;

const getToken = () => localStorage.getItem("token");

export const getMyPortfolio = async () => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};

export const createOrUpdatePortfolio = async (data: any) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};

export const convertResumeToPortfolio = async (resumeId: string, subdomain: string) => {
  const res = await axios.post(
    `${API_URL}/convert/${resumeId}`,
    { subdomain },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return res.data;
};

export const getPortfolioBySubdomain = async (subdomain: string) => {
  const res = await axios.get(`${API_URL}/subdomain/${subdomain}`);
  return res.data;
};
