const fs = require("fs");
const path = require("path");
const Video = require("../models/Video");
const VideoCategory = require("../models/VideoCategory");

const removeUploadedFile = (thumbnailPath) => {
  if (!thumbnailPath) {
    return;
  }

  const absolutePath = path.join(__dirname, "..", thumbnailPath.replace(/^(https?:\/\/[^\/]+)?\//, ""));
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

const normalizeThumbnailPath = (req, file) => {
  if (!file) return "";
  return file.path || file.secure_url;
};

const createVideo = async (req, res, next) => {
  try {
    const { categoryId, title, videoUrl, order, status } = req.body;

    if (!categoryId || !title || !videoUrl) {
      if (req.file) {
        removeUploadedFile(`/uploads/videos/${req.file.filename}`);
      }
      res.status(400);
      throw new Error("categoryId, title and videoUrl are required");
    }

    if (!req.file) {
      res.status(400);
      throw new Error("Thumbnail is required");
    }

    const category = await VideoCategory.findById(categoryId);
    if (!category) {
      removeUploadedFile(`/uploads/videos/${req.file.filename}`);
      res.status(404);
      throw new Error("Video category not found");
    }

    const item = await Video.create({
      categoryId,
      title,
      videoUrl,
      thumbnail: normalizeThumbnailPath(req, req.file),
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      status: status || "active",
    });

    await item.populate("categoryId", "name description status");

    return res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const getVideos = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }

    const items = await Video.find(filter)
      .populate("categoryId", "name description status")
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

const updateVideo = async (req, res, next) => {
  try {
    const { categoryId, title, videoUrl, order, status } = req.body;
    const item = await Video.findById(req.params.id);

    if (!item) {
      if (req.file) {
        removeUploadedFile(`/uploads/videos/${req.file.filename}`);
      }
      res.status(404);
      throw new Error("Video not found");
    }

    const nextCategoryId = categoryId || item.categoryId.toString();
    const category = await VideoCategory.findById(nextCategoryId);
    if (!category) {
      if (req.file) {
        removeUploadedFile(`/uploads/videos/${req.file.filename}`);
      }
      res.status(404);
      throw new Error("Video category not found");
    }

    if (req.file) {
      removeUploadedFile(item.thumbnail);
      item.thumbnail = normalizeThumbnailPath(req, req.file);
    }

    item.categoryId = nextCategoryId;
    item.title = title || item.title;
    item.videoUrl = videoUrl || item.videoUrl;
    item.order = Number.isFinite(Number(order)) ? Number(order) : item.order;
    item.status = status || item.status;

    await item.save();
    await item.populate("categoryId", "name description status");

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    const item = await Video.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Video not found");
    }

    removeUploadedFile(item.thumbnail);
    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleVideoStatus = async (req, res, next) => {
  try {
    const item = await Video.findById(req.params.id).populate(
      "categoryId",
      "name description status"
    );

    if (!item) {
      res.status(404);
      throw new Error("Video not found");
    }

    item.status = item.status === "active" ? "inactive" : "active";
    await item.save();

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const updateVideoOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const item = await Video.findById(req.params.id).populate(
      "categoryId",
      "name description status"
    );

    if (!item) {
      res.status(404);
      throw new Error("Video not found");
    }

    if (!Number.isFinite(Number(order))) {
      res.status(400);
      throw new Error("Valid order is required");
    }

    item.order = Number(order);
    await item.save();

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVideo,
  getVideos,
  updateVideo,
  deleteVideo,
  toggleVideoStatus,
  updateVideoOrder,
};
