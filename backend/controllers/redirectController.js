const Redirect = require("../models/Redirect");

const createRedirect = async (req, res, next) => {
  try {
    const { fromUrl, toUrl, type, status } = req.body;

    if (!fromUrl || !toUrl) {
      res.status(400);
      throw new Error("fromUrl and toUrl are required");
    }

    if (fromUrl === toUrl) {
      res.status(400);
      throw new Error("fromUrl and toUrl cannot be the same");
    }

    const redirect = await Redirect.create({
      fromUrl,
      toUrl,
      type,
      status,
    });

    return res.status(201).json({
      success: true,
      data: redirect,
    });
  } catch (error) {
    next(error);
  }
};

const getRedirects = async (req, res, next) => {
  try {
    const redirects = await Redirect.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: redirects.length,
      data: redirects,
    });
  } catch (error) {
    next(error);
  }
};

const updateRedirect = async (req, res, next) => {
  try {
    const { fromUrl, toUrl, type, status } = req.body;
    const redirect = await Redirect.findById(req.params.id);

    if (!redirect) {
      res.status(404);
      throw new Error("Redirect not found");
    }

    const nextFromUrl = fromUrl || redirect.fromUrl;
    const nextToUrl = toUrl || redirect.toUrl;

    if (nextFromUrl === nextToUrl) {
      res.status(400);
      throw new Error("fromUrl and toUrl cannot be the same");
    }

    redirect.fromUrl = nextFromUrl;
    redirect.toUrl = nextToUrl;
    redirect.type = type || redirect.type;
    redirect.status = status || redirect.status;

    const updatedRedirect = await redirect.save();

    return res.status(200).json({
      success: true,
      data: updatedRedirect,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRedirect = async (req, res, next) => {
  try {
    const redirect = await Redirect.findById(req.params.id);

    if (!redirect) {
      res.status(404);
      throw new Error("Redirect not found");
    }

    await redirect.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Redirect deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleRedirectStatus = async (req, res, next) => {
  try {
    const redirect = await Redirect.findById(req.params.id);

    if (!redirect) {
      res.status(404);
      throw new Error("Redirect not found");
    }

    redirect.status = redirect.status === "active" ? "inactive" : "active";
    await redirect.save();

    return res.status(200).json({
      success: true,
      data: redirect,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRedirect,
  getRedirects,
  updateRedirect,
  deleteRedirect,
  toggleRedirectStatus,
};
