const nodemailer = require("nodemailer");

const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: process.env.SMTP_SECURE !== "false", // true for 465 SSL
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  console.log(`\n📧 [EMAIL REQUEST] To: ${to} | Subject: ${subject}`);
  console.log(`🔑 OTP Content: ${text || html.replace(/<[^>]*>?/gm, "")}\n`);

  if (!transporter) {
    console.log(`[DEV MODE] SMTP credentials not set in server/.env. Returning MOCK email success.`);
    return { success: true, mock: true };
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || "ResumeAI"}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully via Nodemailer! MessageId:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("❌ Error sending real email via Nodemailer:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
