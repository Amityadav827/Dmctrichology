const nodemailer = require("nodemailer");

/**
 * Utility to send professional HTML emails via Gmail SMTP
 * @param {Object} options - Email options (to, subject, html)
 */
const sendEmail = async (options) => {
  try {
    console.log(`[DEBUG] Initializing Email Transporter for: ${process.env.EMAIL_USER}`);

    // 1. Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    // 2. Verify connection
    console.log("[DEBUG] Verifying SMTP connection...");
    await transporter.verify();
    console.log("[DEBUG] SMTP Connection Verified ✅");

    // 3. Define email options
    const mailOptions = {
      from: `"DMC Trichology Admin" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    // 4. Send email
    console.log(`[DEBUG] Sending email to: ${options.to}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[DEBUG] Email Sent successfully! MessageId: ${info.messageId} ✅`);
    
    return info;
  } catch (error) {
    console.error("[ERROR] Email Delivery Failed ❌");
    console.error(`- Message: ${error.message}`);
    if (error.code === 'EAUTH') {
      console.error("- Hint: Invalid Gmail App Password or Username. Check .env");
    }
    throw error; // Re-throw to be caught by the controller
  }
};

module.exports = sendEmail;
