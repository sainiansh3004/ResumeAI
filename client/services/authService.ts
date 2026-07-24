import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/auth`,
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

// Verify Signup OTP
export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await API.post("/verify-otp", data);
  return response.data;
};

// Resend Verification OTP
export const resendOtp = async (data: { email: string }) => {
  const response = await API.post("/resend-otp", data);
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

// Request Forgot Password OTP
export const forgotPassword = async (data: { email: string }) => {
  const response = await API.post("/forgot-password", data);
  return response.data;
};

// Reset Password with OTP
export const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const response = await API.post("/reset-password", data);
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