require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const sendEmail = require("../utils/sendEmail");

/**
 * Diagnostic script to test real email delivery
 */
const testEmailDelivery = async () => {
  console.log("🚀 STARTING SMTP DIAGNOSTIC TEST...");
  
  const testOptions = {
    to: process.env.EMAIL_USER || "amityadav98255@gmail.com",
    subject: "SMTP Diagnostic Test - DMC Trichology",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2563eb;">SMTP Connection Test</h2>
        <p>This is a diagnostic email to confirm that your <strong>Nodemailer + Gmail SMTP</strong> configuration is working correctly.</p>
        <p>If you are reading this, delivery is successful! ✅</p>
        <hr>
        <p style="font-size: 12px; color: #777;">Timestamp: ${new Date().toLocaleString()}</p>
      </div>
    `,
  };

  try {
    await sendEmail(testOptions);
    console.log("\n✨ TEST SUCCESSFUL: Email reached the SMTP server.");
    console.log("Please check your inbox (and Spam folder) at:", testOptions.to);
    process.exit(0);
  } catch (error) {
    console.error("\n❌ TEST FAILED: See the logs above for the specific error.");
    process.exit(1);
  }
};

testEmailDelivery();
