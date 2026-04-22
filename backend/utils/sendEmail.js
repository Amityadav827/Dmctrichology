const nodemailer = require("nodemailer");

/**
 * Enhanced Email Utility with robust Gmail SMTP settings and detailed debugging
 */
const sendEmail = async (options) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  console.log("--------------------------------------------------");
  console.log("[DEBUG] EMAIL CONFIGURATION CHECK:");
  console.log(`- EMAIL_USER: ${emailUser || "UNDEFINED ❌"}`);
  console.log(`- EMAIL_PASS: ${emailPass ? "****" + emailPass.slice(-4) : "UNDEFINED ❌"}`);
  console.log("--------------------------------------------------");

  if (!emailUser || !emailPass) {
    const error = new Error("SMTP Credentials (EMAIL_USER/EMAIL_PASS) are missing in .env");
    console.error(`[CRITICAL] ${error.message}`);
    throw error;
  }

  try {
    // 1. Create transporter with explicit Gmail SMTP settings
    // Using Port 587 with STARTTLS (secure: false) is the most compatible with Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass.replace(/\s/g, ""), // Remove any accidental spaces
      },
      tls: {
        rejectUnauthorized: false, // Helps with some network environments
      },
    });

    // 2. Verify connection
    console.log("[DEBUG] Verifying SMTP Transporter...");
    try {
      await transporter.verify();
      console.log("[DEBUG] Transporter is ready to take our messages ✅");
    } catch (verifyError) {
      console.error("[ERROR] SMTP Verification Failed ❌");
      console.error(`- Error Code: ${verifyError.code}`);
      console.error(`- Message: ${verifyError.message}`);
      throw verifyError;
    }

    // 3. Define email options
    const mailOptions = {
      from: `"DMC Trichology Admin" <${emailUser}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    // 4. Send email
    console.log(`[DEBUG] Attempting to send email to: ${options.to}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[DEBUG] Email sent successfully! MessageId: ${info.messageId} ✅`);
    
    return info;
  } catch (error) {
    console.error("[FATAL ERROR] sendEmail Utility Failure ❌");
    console.error("--------------------------------------------------");
    console.error(`Status Code: ${error.responseCode || "N/A"}`);
    console.error(`Response: ${error.response || "N/A"}`);
    console.error(`Reason: ${error.message}`);
    console.error("--------------------------------------------------");
    
    if (error.message.includes("Invalid login")) {
      console.error("💡 TIP: Your EMAIL_PASS (App Password) might be incorrect or 2-Step Verification is disabled.");
    }
    
    throw error;
  }
};

module.exports = sendEmail;
