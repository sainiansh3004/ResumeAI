const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html, text }) => {
  const user = (process.env.EMAIL_USER || "sainiansh3004@gmail.com").trim();
  const pass = (process.env.EMAIL_PASS || "akvxicjvxplgaoez").replace(/\s+/g, "");

  console.log(`\n📧 [SENDING REAL EMAIL VIA GMAIL SMTP] To: ${to} | Subject: ${subject}`);
  const cleanOtp = text || html.replace(/<[^>]*>?/gm, "");
  console.log(`🔑 OTP Code: ${cleanOtp}\n`);

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
