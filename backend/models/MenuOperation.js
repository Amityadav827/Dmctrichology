const mongoose = require("mongoose");

const menuOperationSchema = new mongoose.Schema(
  {
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: [true, "Menu is required"],
    },
    operationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operation",
      required: [true, "Operation is required"],
    },
  },
  {
    timestamps: true,
  }
);

menuOperationSchema.index({ menuId: 1, operationId: 1 }, { unique: true });

module.exports = mongoose.model("MenuOperation", menuOperationSchema);
