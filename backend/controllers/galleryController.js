const Gallery = require("../models/Gallery");
const fs = require("fs");
const path = require("path");

const removeUploadedFile = (imagePath) => {
  if (!imagePath) {
    return;
  }

  const absolutePath = path.join(__dirname, "..", imagePath.replace(/^(https?:\/\/[^\/]+)?\//, ""));
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

const normalizeImagePath = (req, file) => {
  if (!file) {
    return "";
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/gallery/${file.filename}`;
};

const createGalleryItem = async (req, res, next) => {
  try {
    const files = req.files || [];

    if (!files.length) {
      res.status(400);
      throw new Error("At least one image is required");
    }

    const title = req.body.title || "";
    const altText = req.body.altText || "";
    const description = req.body.description || "";
    const items = files.map((file, index) => ({
      image: normalizeImagePath(req, file),
      title,
      altText,
      description,
      order: Number.isFinite(Number(req.body.order)) ? Number(req.body.order) + index : index,
      status: req.body.status || "active",
    }));

    const galleryItems = await Gallery.insertMany(items);

    return res.status(201).json({
      success: true,
      data: galleryItems,
    });
  } catch (error) {
    next(error);
  }
};

const getGalleryItems = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();

    const filter = search
      ? {
          title: { $regex: search, $options: "i" },
        }
      : {};

    const [galleryItems, total] = await Promise.all([
      Gallery.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      Gallery.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: galleryItems.length,
      data: galleryItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getGalleryItemById = async (req, res, next) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      res.status(404);
      throw new Error("Gallery item not found");
    }

    return res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    next(error);
  }
};

const updateGalleryItem = async (req, res, next) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      if (req.files?.length) {
        req.files.forEach((file) => removeUploadedFile(normalizeImagePath(req, file)));
      }
      res.status(404);
      throw new Error("Gallery item not found");
    }

    if (req.files?.length) {
      removeUploadedFile(galleryItem.image);
      galleryItem.image = normalizeImagePath(req, req.files[0]);
    }

    galleryItem.title = req.body.title !== undefined ? req.body.title : galleryItem.title;
    galleryItem.altText = req.body.altText !== undefined ? req.body.altText : galleryItem.altText;
    galleryItem.description = req.body.description !== undefined ? req.body.description : galleryItem.description;
    galleryItem.order = Number.isFinite(Number(req.body.order))
      ? Number(req.body.order)
      : galleryItem.order;
    galleryItem.status = req.body.status || galleryItem.status;

    await galleryItem.save();

    return res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    next(error);
  }
};

const deleteGalleryItem = async (req, res, next) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      res.status(404);
      throw new Error("Gallery item not found");
    }

    removeUploadedFile(galleryItem.image);
    await galleryItem.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleGalleryItemStatus = async (req, res, next) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      res.status(404);
      throw new Error("Gallery item not found");
    }

    galleryItem.status = galleryItem.status === "active" ? "inactive" : "active";
    await galleryItem.save();

    return res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGalleryItem,
  getGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryItemStatus,
};
