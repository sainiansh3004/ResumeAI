const nodemailer = require("nodemailer");
const axios = require("axios");

const sendEmail = async ({ to, subject, html, text }) => {
  const user = (process.env.EMAIL_USER || "sainiansh3004@gmail.com").trim();
  const pass = (process.env.EMAIL_PASS || "akvxicjvxplgaoez").replace(/\s+/g, "");

  console.log(`\n📧 [SENDING REAL EMAIL] To: ${to} | Subject: ${subject}`);
  const cleanOtp = text || html.replace(/<[^>]*>?/gm, "");
  console.log(`🔑 OTP Code: ${cleanOtp}\n`);

  // Option 1: Resend HTTP REST API
  if (process.env.RESEND_API_KEY) {
    try {
      const resendRes = await axios.post(
        "https://api.resend.com/emails",
        {
          from: "ResumeAI <onboarding@resend.dev>",
          to: [to],
          subject,
          html,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Email delivered via Resend REST API! ID:", resendRes.data?.id);
      return { success: true, info: resendRes.data };
    } catch (err) {
      console.error("❌ Resend API failed:", err.response?.data || err.message);
    }
  }

  // Option 2: Brevo HTTP REST API
  if (process.env.BREVO_API_KEY) {
    try {
      const brevoRes = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { name: "ResumeAI", email: user },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          textContent: text,
        },
        {
          headers: {
            accept: "application/json",
            "api-key": process.env.BREVO_API_KEY.trim(),
            "content-type": "application/json",
          },
        }
      );
      console.log("✅ Email delivered via Brevo REST API!", brevoRes.data);
      return { success: true, info: brevoRes.data };
    } catch (err) {
      console.error("❌ Brevo API failed:", err.response?.data || err.message);
    }
  }

  // Option 3: Nodemailer Gmail Transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || "ResumeAI"}" <${user}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ REAL EMAIL DELIVERED TO INBOX! MessageId:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("❌ Gmail SMTP sendMail error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
