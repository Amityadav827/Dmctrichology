const Role = require("../models/Role");
const { ALL_PERMISSIONS } = require("./permissions");

const ensureAdminRole = async () => {
  let adminRole = await Role.findOne({ name: "admin" });

  if (!adminRole) {
    adminRole = await Role.create({
      name: "admin",
      permissions: ALL_PERMISSIONS,
    });
  } else {
    const mergedPermissions = Array.from(
      new Set([...(adminRole.permissions || []), ...ALL_PERMISSIONS])
    );

    if (mergedPermissions.length !== adminRole.permissions.length) {
      adminRole.permissions = mergedPermissions;
      await adminRole.save();
    }
  }

  return adminRole;
};

const ensureDefaultUserRole = async () => {
  let userRole = await Role.findOne({ name: "user" });

  if (!userRole) {
    userRole = await Role.create({
      name: "user",
      permissions: ["dashboard"],
    });
  }

  return userRole;
};

module.exports = {
  ensureAdminRole,
  ensureDefaultUserRole,
};
