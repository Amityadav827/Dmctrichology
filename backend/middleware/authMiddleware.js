const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");
// const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // const user = await User.findById(decoded.id).populate("role", "name permissions").select("-password");
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        role:roles (
          name,
          permissions
        )
      `)
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role?.name !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only",
    });
  }

  next();
};

const checkPermission = (permission) => (req, res, next) => {
  const permissions = req.user?.role?.permissions || [];

  if (req.user?.role?.name === "admin" || permissions.includes(permission)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: `Access denied. Missing permission: ${permission}`,
  });
};

module.exports = {
  protect,
  adminOnly,
  checkPermission,
};
