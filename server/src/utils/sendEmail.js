const nodemailer = require("nodemailer");

const getTransporters = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return [];
  }

  return [
    // 1. Standard Gmail service transport
    nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    }),
    // 2. Direct SMTP port 587 STARTTLS
    nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    }),
    // 3. Direct SMTP port 465 SSL
    nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    }),
  ];
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporters = getTransporters();

  console.log(`\n📧 [EMAIL REQUEST] To: ${to} | Subject: ${subject}`);
  console.log(`🔑 OTP Content: ${text || html.replace(/<[^>]*>?/gm, "")}\n`);

  if (transporters.length === 0) {
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

  let lastError = null;

  for (let i = 0; i < transporters.length; i++) {
    try {
      console.log(`Attempting email delivery via Transporter #${i + 1}...`);
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
