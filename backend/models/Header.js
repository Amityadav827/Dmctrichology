const mongoose = require("mongoose");

const headerSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, default: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/pntwhlftziotd6k0kdkg.png" },
    isSticky: { type: Boolean, default: true },
    appointmentButtonText: { type: String, default: "Book Appointment" },
    appointmentButtonLink: { type: String, default: "/book-appointment" },
    menuItems: [
      {
        label: { type: String, required: true },
        link: { type: String, default: "#" },
        hasDropdown: { type: Boolean, default: false },
        submenu: [
          {
            label: { type: String },
            link: { type: String }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Header", headerSchema);
