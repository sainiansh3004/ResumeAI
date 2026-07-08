import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/billing`;

const getToken = () => localStorage.getItem("token");

export const createRazorpayOrder = async () => {
  const res = await axios.post(
    `${API_URL}/razorpay-order`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return res.data;
};

export const verifyRazorpayPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const res = await axios.post(`${API_URL}/razorpay-verify`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};
