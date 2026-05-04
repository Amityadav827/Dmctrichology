const supabase = require("../config/supabase");

/**
 * Middleware to handle dynamic redirects from database using Supabase
 */
const redirectMiddleware = async (req, res, next) => {
  // We only intercept GET requests that are NOT API calls or static files
  if (req.method !== "GET" || req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return next();
  }

  try {
    const path = req.path.toLowerCase().trim();
    
    // Efficient lookup using Supabase
    const { data: redirect, error } = await supabase
      .from('redirects')
      .select('destination_url, type')
      .eq('source_url', path)
      .eq('status', 'active')
      .single();

    if (redirect && !error) {
      console.log(`[REDIRECT] Matched: ${path} -> ${redirect.destination_url} (${redirect.type})`);
      return res.redirect(parseInt(redirect.type), redirect.destination_url);
    }

    next();
  } catch (error) {
    console.error("[REDIRECT ERROR]", error.message);
    next();
  }
};

module.exports = redirectMiddleware;
