const Redirect = require("../models/Redirect");

// @desc    Get all redirects
// @route   GET /api/redirects
// @access  Private/Admin
const getRedirects = async (req, res, next) => {
  try {
    const redirects = await Redirect.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: redirects.length,
      data: redirects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a redirect
// @route   POST /api/redirects
// @access  Private/Admin
const createRedirect = async (req, res, next) => {
  try {
    const { sourceUrl, destinationUrl, type, status } = req.body;

    const existingRedirect = await Redirect.findOne({ sourceUrl: sourceUrl.toLowerCase().trim() });
    if (existingRedirect) {
      res.status(400);
      throw new Error("A redirect for this source URL already exists");
    }

    const redirect = await Redirect.create({
      sourceUrl,
      destinationUrl,
      type: type || 301,
      status: status || "active",
    });

    res.status(201).json({
      success: true,
      data: redirect,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a redirect
// @route   PUT /api/redirects/:id
// @access  Private/Admin
const updateRedirect = async (req, res, next) => {
  try {
    const { sourceUrl, destinationUrl, type, status } = req.body;

    let redirect = await Redirect.findById(req.params.id);

    if (!redirect) {
      res.status(404);
      throw new Error("Redirect not found");
    }

    // Check if new sourceUrl already exists (if changed)
    if (sourceUrl && sourceUrl.toLowerCase().trim() !== redirect.sourceUrl) {
      const existingRedirect = await Redirect.findOne({ sourceUrl: sourceUrl.toLowerCase().trim() });
      if (existingRedirect) {
        res.status(400);
        throw new Error("A redirect for this source URL already exists");
      }
    }

    redirect = await Redirect.findByIdAndUpdate(
      req.params.id,
      { sourceUrl, destinationUrl, type, status },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: redirect,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a redirect
// @route   DELETE /api/redirects/:id
// @access  Private/Admin
const deleteRedirect = async (req, res, next) => {
  try {
    const redirect = await Redirect.findById(req.params.id);

    if (!redirect) {
      res.status(404);
      throw new Error("Redirect not found");
    }

    await redirect.deleteOne();

    res.status(200).json({
      success: true,
      message: "Redirect removed",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle redirect status
// @route   PATCH /api/redirects/:id/status
// @access  Private/Admin
const toggleRedirectStatus = async (req, res, next) => {
  try {
    const redirect = await Redirect.findById(req.params.id);

    if (!redirect) {
      res.status(404);
      throw new Error("Redirect not found");
    }

    redirect.status = redirect.status === "active" ? "inactive" : "active";
    await redirect.save();

    res.status(200).json({
      success: true,
      data: redirect,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRedirects,
  createRedirect,
  updateRedirect,
  deleteRedirect,
  toggleRedirectStatus,
};
