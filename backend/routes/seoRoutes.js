const express = require("express");
const seoPageRoutes = require("./seoPageRoutes");
const redirectRoutes = require("./redirectRoutes");
const sitemapRoutes = require("./sitemapRoutes");
const robotsRoutes = require("./robotsRoutes");
const { serveRobotsTxt } = require("../controllers/robotsController");

const router = express.Router();

router.use("/pages", seoPageRoutes);
router.use("/redirects", redirectRoutes);
router.use("/sitemap", sitemapRoutes);
router.use("/robots", robotsRoutes);

module.exports = {
  seoRouter: router,
  serveRobotsTxt,
};
