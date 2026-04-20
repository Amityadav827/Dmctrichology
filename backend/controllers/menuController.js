const Menu = require("../models/Menu");

const createMenu = async (req, res, next) => {
  try {
    const { name, url, order, status } = req.body;

    if (!name || !url) {
      res.status(400);
      throw new Error("name and url are required");
    }

    const menu = await Menu.create({
      name,
      url,
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

const getMenus = async (req, res, next) => {
  try {
    const menus = await Menu.find().sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    next(error);
  }
};

const updateMenu = async (req, res, next) => {
  try {
    const { name, url, order, status } = req.body;
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      res.status(404);
      throw new Error("Menu not found");
    }

    menu.name = name || menu.name;
    menu.url = url || menu.url;
    menu.order = Number.isFinite(Number(order)) ? Number(order) : menu.order;
    menu.status = status || menu.status;

    await menu.save();

    return res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      res.status(404);
      throw new Error("Menu not found");
    }

    await menu.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleMenuStatus = async (req, res, next) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      res.status(404);
      throw new Error("Menu not found");
    }

    menu.status = menu.status === "active" ? "inactive" : "active";
    await menu.save();

    return res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

const updateMenuOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      res.status(404);
      throw new Error("Menu not found");
    }

    if (!Number.isFinite(Number(order))) {
      res.status(400);
      throw new Error("Valid order is required");
    }

    menu.order = Number(order);
    await menu.save();

    return res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
  toggleMenuStatus,
  updateMenuOrder,
};
