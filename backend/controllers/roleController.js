const Role = require("../models/Role");

const createRole = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Role name is required");
    }

    const existingRole = await Role.findOne({ name: name.trim().toLowerCase() });

    if (existingRole) {
      res.status(400);
      throw new Error("Role already exists");
    }

    const role = await Role.create({
      name,
      permissions: Array.isArray(permissions) ? permissions : [],
    });

    return res.status(201).json({
      success: true,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.findById(req.params.id);

    if (!role) {
      res.status(404);
      throw new Error("Role not found");
    }

    if (name && name.trim().toLowerCase() !== role.name) {
      const existingRole = await Role.findOne({ name: name.trim().toLowerCase() });
      if (existingRole) {
        res.status(400);
        throw new Error("Role already exists");
      }
    }

    role.name = name || role.name;
    role.permissions = Array.isArray(permissions) ? permissions : role.permissions;

    await role.save();

    return res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      res.status(404);
      throw new Error("Role not found");
    }

    if (role.name === "admin") {
      res.status(400);
      throw new Error("Admin role cannot be deleted");
    }

    await role.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
};
