const Gallery = require("../models/Gallery");
const fs = require("fs");
const path = require("path");

const removeUploadedFile = (imagePath) => {
  if (!imagePath) {
    return;
  }

  try {
    // Extract filename from URL or path
    const filename = imagePath.split("/").pop();
    if (!filename) return;

    const absolutePath = path.join(__dirname, "..", "uploads", "gallery", filename);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (err) {
    console.error("Error removing file:", err);
  }
};

const normalizeImagePath = (req, file) => {
  if (!file) return "";
  
  // If Cloudinary provides a secure_url or path is already a full URL
  const filePath = file.secure_url || file.path || "";
  if (typeof filePath === "string" && filePath.startsWith("http")) {
    return filePath;
  }
  
  // For local uploads, use filename to construct the full public URL
  if (file.filename) {
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${normalizedBaseUrl}/uploads/gallery/${file.filename}`;
  }
  
  return filePath;
};


const transformItem = (req, item) => {
  const doc = item.toObject ? item.toObject() : item;
  let finalUrl = doc.imageUrl || doc.image || "";
  
  // Only prepend BASE_URL if the URL is not already absolute
  if (finalUrl && typeof finalUrl === "string" && !finalUrl.startsWith("http")) {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.get("host");
    const baseUrl = process.env.BASE_URL || `${protocol}://${host}`;
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    
    finalUrl = finalUrl.startsWith("/") 
      ? `${normalizedBaseUrl}${finalUrl}` 
      : `${normalizedBaseUrl}/${finalUrl}`;
  }
  
  doc.imageUrl = finalUrl;
  doc.image = finalUrl; 
  return doc;
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
    const items = files.map((file, index) => {
      const fullUrl = normalizeImagePath(req, file);
      return {
        imageUrl: fullUrl,
        image: fullUrl,
        title,
        altText,
        description,
        order: Number.isFinite(Number(req.body.order)) ? Number(req.body.order) + index : index,
        status: req.body.status || "active",
      };
    });

    const galleryItems = await Gallery.insertMany(items);
    const transformedItems = galleryItems.map(item => transformItem(req, item));

    return res.status(201).json({
      success: true,
      data: transformedItems,
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

    const transformedItems = galleryItems.map(item => transformItem(req, item));

    return res.status(200).json({
      success: true,
      count: transformedItems.length,
      data: transformedItems,
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
      data: transformItem(req, galleryItem),
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
      removeUploadedFile(galleryItem.imageUrl || galleryItem.image);
      const newFullUrl = normalizeImagePath(req, req.files[0]);
      galleryItem.imageUrl = newFullUrl;
      galleryItem.image = newFullUrl;
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
      data: transformItem(req, galleryItem),
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

    removeUploadedFile(galleryItem.imageUrl || galleryItem.image);
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
      data: transformItem(req, galleryItem),
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
