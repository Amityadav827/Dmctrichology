const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile is required"],
      trim: true,
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "confirmed", "completed", "cancelled"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
