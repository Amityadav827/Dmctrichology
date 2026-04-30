const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Debug: log Cloudinary config on startup
console.log("🌩️ Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "SET ✅" : "MISSING ❌",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "SET ✅" : "MISSING ❌",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dmc-trichology",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    resource_type: "image",
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
