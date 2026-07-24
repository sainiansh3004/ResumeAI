const nodemailer = require("nodemailer");

const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  if (process.env.EMAIL_SERVICE === "gmail" || (!process.env.SMTP_HOST && user.includes("@gmail.com"))) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log("\n====================================================================");
    console.log(`[DEV MODE] SMTP credentials not set in server/.env.`);
    console.log(`To send REAL emails to inbox, set EMAIL_USER & EMAIL_PASS in server/.env.`);
    console.log(`Sending MOCK email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`OTP Code:\n${text || html.replace(/<[^>]*>?/gm, "")}`);
    console.log("====================================================================\n");
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
    return { success: true, info };
  } catch (error) {
    console.error("Error sending real email via Nodemailer:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
