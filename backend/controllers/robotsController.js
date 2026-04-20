const Robots = require("../models/Robots");

const getOrCreateRobots = async () => {
  let robots = await Robots.findOne();

  if (!robots) {
    robots = await Robots.create({
      content: "User-agent: *\nAllow: /",
    });
  }

  return robots;
};

const getRobotsContent = async (req, res, next) => {
  try {
    const robots = await getOrCreateRobots();

    return res.status(200).json({
      success: true,
      data: robots,
    });
  } catch (error) {
    next(error);
  }
};

const updateRobotsContent = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || !String(content).trim()) {
      res.status(400);
      throw new Error("content is required");
    }

    const robots = await getOrCreateRobots();
    robots.content = content;
    await robots.save();

    return res.status(200).json({
      success: true,
      data: robots,
    });
  } catch (error) {
    next(error);
  }
};

const serveRobotsTxt = async (req, res, next) => {
  try {
    const robots = await getOrCreateRobots();

    return res
      .status(200)
      .set("Content-Type", "text/plain; charset=utf-8")
      .send(robots.content);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRobotsContent,
  updateRobotsContent,
  serveRobotsTxt,
};
