const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sections: [
      {
        sectionId: { type: String, required: true }, // e.g., 'topbar', 'header', 'hero'
        type: { type: String, required: true },      // section type
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        config: { type: mongoose.Schema.Types.Mixed } // optional section-specific config overrides
      }
    ],
    metadata: {
      title: String,
      description: String,
      keywords: String
    },
    status: { type: String, enum: ['draft', 'published'], default: 'published' }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", pageSchema);
