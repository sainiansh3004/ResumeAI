const nodemailer = require("nodemailer");
const axios = require("axios");

const getTransporters = () => {
  const user = (process.env.EMAIL_USER || "sainiansh3004@gmail.com").trim();
  const pass = (process.env.EMAIL_PASS || "akvxicjvxplgaoez").replace(/\s+/g, "");

  if (!user || !pass) {
    return [];
  }

  return [
    // 1. Direct Gmail Service
    nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    }),
    // 2. Direct SMTP port 465 SSL
    nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    }),
    // 3. Direct SMTP port 587 STARTTLS
    nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    }),
  ];
};

const sendEmail = async ({ to, subject, html, text }) => {
  console.log(`\n📧 [EMAIL REQUEST] To: ${to} | Subject: ${subject}`);
  const cleanOtp = text || html.replace(/<[^>]*>?/gm, "");
  console.log(`🔑 OTP Content: ${cleanOtp}\n`);

  // Option A: If RESEND_API_KEY is configured in env, send via Resend REST API
  if (process.env.RESEND_API_KEY) {
    try {
      console.log("Attempting email delivery via Resend API...");
      const resendRes = await axios.post(
        "https://api.resend.com/emails",
        {
          from: process.env.EMAIL_FROM || "ResumeAI <onboarding@resend.dev>",
          to: [to],
          subject: subject,
          html: html,
          text: text,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Email sent successfully via Resend API! ID:", resendRes.data?.id);
      return { success: true, info: resendRes.data };
    } catch (resendErr) {
      console.error("❌ Resend API failed:", resendErr.response?.data || resendErr.message);
    }
  }

  // Option B: Nodemailer SMTP with trimmed credentials
  const transporters = getTransporters();

  if (transporters.length === 0) {
    console.log(`[DEV MODE] SMTP credentials not set. Returning MOCK email success.`);
    return { success: true, mock: true };
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || "ResumeAI"}" <${(process.env.EMAIL_USER || "").trim()}>`,
    to,
    subject,
    text,
    html,
  };

  let lastError = null;

  for (let i = 0; i < transporters.length; i++) {
    try {
      console.log(`Attempting email delivery via Nodemailer Transporter #${i + 1}...`);
      const info = await transporters[i].sendMail(mailOptions);
      console.log(`✅ Email sent successfully via Transporter #${i + 1}! MessageId:`, info.messageId);
      return { success: true, info };
    } catch (err) {
      console.error(`❌ Transporter #${i + 1} failed:`, err.message);
      lastError = err;
    }
  }

  return { success: false, error: lastError?.message || "All email transports failed" };
};

module.exports = sendEmail;
