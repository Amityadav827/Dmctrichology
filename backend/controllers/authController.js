const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const supabase = require("../config/supabase");
const generateToken = require("../utils/generateToken");
const { ensureAdminRole } = require("../utils/roleHelpers");

const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required");
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (existingUser) {
      res.status(400);
      throw new Error("Admin already exists with this email");
    }

    const adminRole = await ensureAdminRole();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email: email.trim().toLowerCase(),
          password: hashedPassword,
          phone: phone || "",
          role_id: adminRole.id,
          status: "active",
        },
      ])
      .select(`
        *,
        role:roles (
          name,
          permissions
        )
      `)
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
        permissions: user.role?.permissions || [],
        token: generateToken({ id: user.id }),
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const { data: admin, error: fetchError } = await supabase
      .from('users')
      .select(`
        *,
        role:roles (
          name,
          permissions
        )
      `)
      .eq('email', email.trim().toLowerCase())
      .single();

    if (fetchError || !admin) {
      res.status(401);
      throw new Error("Invalid admin credentials");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
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
        _id: admin.id,
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        status: admin.status,
        role: admin.role,
        permissions: admin.role?.permissions || [],
        token: generateToken({ id: admin.id }),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminProfile = async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      data: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
        permissions: user.role?.permissions || [],
      },
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

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !user) {
      res.status(404);
      throw new Error("User with this email does not exist");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: updateError } = await supabase
      .from('users')
      .update({
        reset_password_token: hashedToken,
        reset_password_expires: expiry,
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    const resetUrl = `${req.get("origin")}/reset-password/${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
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
      await supabase
        .from('users')
        .update({
          reset_password_token: null,
          reset_password_expires: null,
        })
        .eq('id', user.id);
      
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

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('reset_password_token', hashedToken)
      .single();

    if (fetchError || !user) {
      res.status(400);
      throw new Error("Invalid reset token. Please request a new link.");
    }

    if (new Date(user.reset_password_expires) < new Date()) {
      res.status(400);
      throw new Error("Reset link has expired. Please request a new one.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        reset_password_token: null,
        reset_password_expires: null,
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

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
