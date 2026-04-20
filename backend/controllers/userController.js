const User = require("../models/User");
const Role = require("../models/Role");
const { ensureDefaultUserRole } = require("../utils/roleHelpers");

const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, status } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists with this email");
    }

    let roleId = role;

    if (!roleId) {
      const defaultRole = await ensureDefaultUserRole();
      roleId = defaultRole._id;
    } else {
      const existingRole = await Role.findById(roleId);
      if (!existingRole) {
        res.status(404);
        throw new Error("Role not found");
      }
    }

    const user = await User.create({
      name,
      email,
      phone: phone || "",
      password,
      role: roleId,
      status: status || "active",
    });

    await user.populate("role", "name permissions");

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter)
        .populate("role", "name permissions")
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("role", "name permissions")
      .select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, status } = req.body;
    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        res.status(400);
        throw new Error("Email already in use");
      }
    }

    if (role) {
      const existingRole = await Role.findById(role);
      if (!existingRole) {
        res.status(404);
        throw new Error("Role not found");
      }
      user.role = role;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone !== undefined ? phone : user.phone;
    user.status = status || user.status;

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();
    await updatedUser.populate("role", "name permissions");

    return res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        status: updatedUser.status,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("role", "name permissions")
      .select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
};
