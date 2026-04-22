const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { ensureAdminRole } = require("../utils/roleHelpers");

const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("Admin already exists with this email");
    }

    const adminRole = await ensureAdminRole();

    const admin = await User.create({
      name,
      email,
      phone: phone || "",
      password,
      role: adminRole._id,
      status: "active",
    });

    await admin.populate("role", "name permissions");

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        status: admin.status,
        role: admin.role,
        permissions: admin.role?.permissions || [],
        token: generateToken({ id: admin._id }),
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { password } = req.body;
    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const admin = await User.findOne({ email })
      .populate("role", "name permissions")
      .select("+password");

    if (!admin || !(await admin.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid admin credentials");
    }

    if (admin.status !== "active") {
      res.status(403);
      throw new Error("User account is inactive");
    }

    if (admin.role?.name !== "admin") {
      res.status(403);
      throw new Error("Access denied. Admin role required");
    }

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        status: admin.status,
        role: admin.role,
        permissions: admin.role?.permissions || [],
        token: generateToken({ id: admin._id }),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

const sendEmail = require("../utils/sendEmail");

const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";

    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }

    console.log(`[DEBUG] ForgotPassword: Searching for email -> "${email}"`);
    const user = await User.findOne({ email });
    console.log(`[DEBUG] ForgotPassword: User found -> ${user ? "YES" : "NO"}`);

    if (!user) {
      res.status(404);
      throw new Error("User with this email does not exist");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash and set reset token + expiry
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Prepare Reset URL
    const resetUrl = `${req.get("origin")}/reset-password/${resetToken}`;
    
    // HTML Template
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #0f172a; text-align: center;">Password Reset Request</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>You are receiving this email because you (or someone else) have requested the reset of a password for your DMC Trichology Admin account.</p>
        <p>Please click on the button below to complete the process:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">This link will expire in 10 minutes.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request - DMC Trichology",
        html,
      });

      return res.status(200).json({
        success: true,
        message: "Password reset link sent to your email successfully",
      });
    } catch (emailError) {
      // If email fails, reset the token fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      res.status(500);
      throw new Error("Unable to send reset email. Please check your SMTP configuration.");
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
      res.status(400);
      throw new Error("New password is required");
    }

    // Hash token from URL to compare with DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log(`[DEBUG] ResetPassword: Attempting reset with token -> ${token.substring(0, 5)}...`);

    // First check if token exists at all
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
    });

    if (!user) {
      console.log("[DEBUG] ResetPassword: No user found with this token ❌");
      res.status(400);
      throw new Error("Invalid reset token. Please request a new link.");
    }

    // Then check if it's expired
    if (user.resetPasswordExpires < Date.now()) {
      console.log("[DEBUG] ResetPassword: Token has expired ❌");
      res.status(400);
      throw new Error("Reset link has expired. Please request a new one.");
    }

    console.log(`[DEBUG] ResetPassword: Token valid for user -> ${user.email} ✅`);

    // Set new password (will be hashed by pre-save hook)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now login.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  forgotPassword,
  resetPassword,
};
