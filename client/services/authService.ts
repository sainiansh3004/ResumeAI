import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

// Register User
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await API.post("/register", userData);
  return response.data;
};

// Login User
export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  const response = await API.post("/login", userData);
  return response.data;
};

// Get Profile
export const getProfile = async (token: string) => {
  const response = await API.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export default API;