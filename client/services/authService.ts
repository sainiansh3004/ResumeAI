import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "https://resumeai-qfs2.onrender.com/api"}/auth`,
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

// Send Premium Email Verification OTP
export const sendPremiumOtp = async (token: string) => {
  const response = await API.post(
    "/send-premium-otp",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Verify Premium Email Verification OTP
export const verifyPremiumOtp = async (token: string, otp: string) => {
  const response = await API.post(
    "/verify-premium-otp",
    { otp },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Social Login (Google / LinkedIn)
export const socialLogin = async (data: {
  provider: "google" | "linkedin";
  email?: string;
  name?: string;
}) => {
  const response = await API.post("/social-login", data);
  return response.data;
};

export default API;