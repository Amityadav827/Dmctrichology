const Menu = require("../models/Menu");
const Operation = require("../models/Operation");
const MenuOperation = require("../models/MenuOperation");

const assignOperationToMenu = async (req, res, next) => {
  try {
    const { menuId, operationId } = req.body;

    if (!menuId || !operationId) {
      res.status(400);
      throw new Error("menuId and operationId are required");
    }

    const [menu, operation] = await Promise.all([
      Menu.findById(menuId),
      Operation.findById(operationId),
    ]);

    if (!menu) {
      res.status(404);
      throw new Error("Menu not found");
    }

    if (!operation) {
      res.status(404);
      throw new Error("Operation not found");
    }

    const mapping = await MenuOperation.create({
      menuId,
      operationId,
    });

    await mapping.populate("menuId", "name url status");
    await mapping.populate("operationId", "name url status");

    return res.status(201).json({
      success: true,
      data: mapping,
    });
  } catch (error) {
    next(error);
  }
};

const getMenuOperations = async (req, res, next) => {
  try {
    const mappings = await MenuOperation.find()
      .populate("menuId", "name url status order")
      .populate("operationId", "name url status order")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: mappings.length,
      data: mappings,
    });
  } catch (error) {
    next(error);
  }
};

const updateMenuOperation = async (req, res, next) => {
  try {
    const { menuId, operationId } = req.body;
    const mapping = await MenuOperation.findById(req.params.id);

    if (!mapping) {
      res.status(404);
      throw new Error("Mapping not found");
    }

    const nextMenuId = menuId || mapping.menuId.toString();
    const nextOperationId = operationId || mapping.operationId.toString();

    const [menu, operation] = await Promise.all([
      Menu.findById(nextMenuId),
      Operation.findById(nextOperationId),
    ]);

    if (!menu) {
      res.status(404);
      throw new Error("Menu not found");
    }

    if (!operation) {
      res.status(404);
      throw new Error("Operation not found");
    }

    const existing = await MenuOperation.findOne({
      _id: { $ne: mapping._id },
      menuId: nextMenuId,
      operationId: nextOperationId,
    });

    if (existing) {
      res.status(400);
      throw new Error("This menu and operation mapping already exists");
    }

    mapping.menuId = nextMenuId;
    mapping.operationId = nextOperationId;
    await mapping.save();
    await mapping.populate("menuId", "name url status order");
    await mapping.populate("operationId", "name url status order");

    return res.status(200).json({
      success: true,
      data: mapping,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuOperation = async (req, res, next) => {
  try {
    const mapping = await MenuOperation.findById(req.params.id);

    if (!mapping) {
      res.status(404);
      throw new Error("Mapping not found");
    }

    await mapping.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Mapping deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  assignOperationToMenu,
  getMenuOperations,
  updateMenuOperation,
  deleteMenuOperation,
};
