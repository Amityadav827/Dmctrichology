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

    // In a real app, send email here. For now, log to console.
    const resetUrl = `${req.get("origin")}/reset-password/${resetToken}`;
    console.log("====================================");
    console.log("RESET PASSWORD LINK:", resetUrl);
    console.log("====================================");

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
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

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error("Invalid or expired reset token");
    }

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
