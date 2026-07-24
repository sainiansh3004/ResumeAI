const nodemailer = require("nodemailer");
const dns = require("dns");

// Force IPv4 resolution to prevent cloud host IPv6 ENETUNREACH errors
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  // Ignore if not supported in old node versions
}

const sendEmail = async ({ to, subject, html, text }) => {
  const user = (process.env.EMAIL_USER || "sainiansh3004@gmail.com").trim();
  const pass = (process.env.EMAIL_PASS || "akvxicjvxplgaoez").replace(/\s+/g, "");

  console.log(`\n📧 [SENDING REAL EMAIL] To: ${to} | Subject: ${subject}`);
  const cleanOtp = text || html.replace(/<[^>]*>?/gm, "");
  console.log(`🔑 OTP Code: ${cleanOtp}\n`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    family: 4, // Force IPv4 family only
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
