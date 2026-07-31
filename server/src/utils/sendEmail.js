const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html, text }) => {
  const user = (process.env.EMAIL_USER || "sainiansh3004@gmail.com").trim();
  const pass = (process.env.EMAIL_PASS || "akvxicjvxplgaoez").replace(/\s+/g, "");

  const cleanOtp = text || html.replace(/<[^>]*>?/gm, "");
  console.log(`\n======================================================`);
  console.log(`📧 [SENDING REAL OTP EMAIL] To: ${to} | Subject: ${subject}`);
  console.log(`🔑 OTP CODE: [ ${cleanOtp} ]`);
  console.log(`======================================================\n`);

  const mailOptions = {
    from: `"ResumeAI" <${user}>`,
    to,
    subject,
    text,
    html,
  };

  // Attempt 1: Gmail SMTP Port 465 (SSL)
  try {
    const transporter1 = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 15000,
    });
    const info = await transporter1.sendMail(mailOptions);
    console.log("✅ REAL EMAIL DELIVERED VIA GMAIL SMTP (465)! MessageId:", info.messageId);
    return { success: true, info };
  } catch (err1) {
    console.error("⚠️ Gmail SMTP Port 465 failed:", err1.message);
  }

  // Attempt 2: Nodemailer Built-in Gmail Service
  try {
    const transporter2 = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    const info = await transporter2.sendMail(mailOptions);
    console.log("✅ REAL EMAIL DELIVERED VIA GMAIL SERVICE! MessageId:", info.messageId);
    return { success: true, info };
  } catch (err2) {
    console.error("⚠️ Gmail Service failed:", err2.message);
  }

  // Attempt 3: Gmail SMTP Port 587 (TLS)
  try {
    const transporter3 = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 15000,
    });
    const info = await transporter3.sendMail(mailOptions);
    console.log("✅ REAL EMAIL DELIVERED VIA GMAIL SMTP (587)! MessageId:", info.messageId);
    return { success: true, info };
  } catch (err3) {
    console.error("❌ All Gmail SMTP delivery attempts failed:", err3.message);
    throw new Error(`Email delivery failed: ${err3.message}`);
  }
};

module.exports = sendEmail;

