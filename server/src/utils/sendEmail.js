const nodemailer = require("nodemailer");
const axios = require("axios");

const sendEmail = async ({ to, subject, html, text }) => {
  const user = (process.env.EMAIL_USER || "sainiansh3004@gmail.com").trim();
  const pass = (process.env.EMAIL_PASS || "akvxicjvxplgaoez").replace(/\s+/g, "");
  const resendApiKey = (process.env.RESEND_API_KEY || "re_JAjBBwnc_DcX4oaTw1eWXSFcqEGWDPfWh").trim();

  console.log(`\n📧 [SENDING REAL EMAIL] To: ${to} | Subject: ${subject}`);
  const cleanOtp = text || html.replace(/<[^>]*>?/gm, "");
  console.log(`🔑 OTP Code: ${cleanOtp}\n`);

  // Option 1: Resend HTTP REST API over HTTPS port 443 (Cloud Datacenter Compatible)
  if (resendApiKey) {
    try {
      console.log("Attempting delivery via Resend HTTP REST API...");
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
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (resendRes.data && resendRes.data.id) {
        console.log("✅ Email delivered via Resend REST API! ID:", resendRes.data.id);
        return { success: true, info: resendRes.data };
      }
    } catch (err) {
      console.error("❌ Resend API failed, falling back to Gmail SMTP:", err.response?.data || err.message);
    }
  }

  // Option 2: Nodemailer Gmail Transport
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
  });

  const mailOptions = {
    from: user,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ REAL EMAIL DELIVERED VIA GMAIL SMTP! MessageId:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("❌ Gmail SMTP sendMail error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
