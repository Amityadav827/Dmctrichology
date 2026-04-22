const Redirect = require("../models/Redirect");

/**
 * Middleware to handle dynamic redirects from database
 */
const redirectMiddleware = async (req, res, next) => {
  // We only intercept GET requests that are NOT API calls or static files
  if (req.method !== "GET" || req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return next();
  }

  try {
    const path = req.path.toLowerCase().trim();
    
    // Efficient lookup using indexed sourceUrl
    const redirect = await Redirect.findOne({ 
      sourceUrl: path, 
      status: "active" 
    });

    if (redirect) {
      console.log(`[REDIRECT] Matched: ${path} -> ${redirect.destinationUrl} (${redirect.type})`);
      return res.redirect(parseInt(redirect.type), redirect.destinationUrl);
    }

    next();
  } catch (error) {
    console.error("[REDIRECT ERROR]", error.message);
    next();
  }
};

module.exports = redirectMiddleware;
