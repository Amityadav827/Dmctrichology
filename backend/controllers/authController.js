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
    const { email, password } = req.body;

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

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
};
