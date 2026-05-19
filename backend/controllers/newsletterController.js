const supabase = require("../config/supabase");

// Public subscription handler
exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email, subscribedToUpdates } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check duplicate in Supabase
    const { data: existing, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", trimmedEmail)
      .maybeSingle();

    if (checkError) {
      console.error("[subscribeNewsletter] Check Error:", checkError.message);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    }

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You're already subscribed.",
      });
    }

    // Save subscriber in Supabase
    const { data: newSubscriber, error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email: trimmedEmail,
          subscribed_to_updates: !!subscribedToUpdates,
          source: "footer-newsletter",
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error("[subscribeNewsletter] Insert Error:", insertError.message);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    }

    // Map response keys back to frontend format (camelCase and _id)
    const mappedSubscriber = {
      _id: newSubscriber.id,
      email: newSubscriber.email,
      subscribedToUpdates: newSubscriber.subscribed_to_updates,
      source: newSubscriber.source,
      createdAt: newSubscriber.created_at,
    };

    return res.status(201).json({
      success: true,
      message: "Thank you for subscribing!",
      data: mappedSubscriber,
    });
  } catch (error) {
    console.error("[subscribeNewsletter] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// Admin fetch with filters, search, and pagination
exports.getSubscribers = async (req, res) => {
  try {
    const { search = "", startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact" });

    // Search filter
    if (search.trim()) {
      query = query.ilike("email", `%${search.trim()}%`);
    }

    // Date range filter
    if (startDate) {
      query = query.gte("created_at", new Date(startDate).toISOString());
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query = query.lte("created_at", end.toISOString());
    }

    const limitVal = parseInt(limit) || 10;
    const pageVal = parseInt(page) || 1;
    const skipIndex = (pageVal - 1) * limitVal;

    query = query
      .order("created_at", { ascending: false })
      .range(skipIndex, skipIndex + limitVal - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error("[getSubscribers] Query Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch newsletter subscribers.",
      });
    }

    // Map fields back to frontend camelCase and _id format
    const mappedData = (data || []).map((sub) => ({
      _id: sub.id,
      email: sub.email,
      subscribedToUpdates: sub.subscribed_to_updates,
      source: sub.source,
      createdAt: sub.created_at,
    }));

    return res.status(200).json({
      success: true,
      total: count || 0,
      data: mappedData,
      pages: Math.ceil((count || 0) / limitVal),
      currentPage: pageVal,
    });
  } catch (error) {
    console.error("[getSubscribers] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch newsletter subscribers.",
    });
  }
};

// Admin Delete single
exports.deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("[deleteSubscriber] Delete Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to delete subscriber.",
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subscriber deleted successfully.",
    });
  } catch (error) {
    console.error("[deleteSubscriber] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete subscriber.",
    });
  }
};

// Admin Bulk Delete
exports.bulkDeleteSubscribers = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one subscriber.",
      });
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("[bulkDeleteSubscribers] Bulk Delete Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to bulk delete subscribers.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${ids.length} subscribers deleted successfully.`,
    });
  } catch (error) {
    console.error("[bulkDeleteSubscribers] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk delete subscribers.",
    });
  }
};

// Admin CSV Export
exports.exportSubscribersCsv = async (req, res) => {
  try {
    const { search = "", startDate, endDate } = req.query;

    let query = supabase
      .from("newsletter_subscribers")
      .select("*");

    // Search filter
    if (search.trim()) {
      query = query.ilike("email", `%${search.trim()}%`);
    }

    // Date range filter
    if (startDate) {
      query = query.gte("created_at", new Date(startDate).toISOString());
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query = query.lte("created_at", end.toISOString());
    }

    query = query.order("created_at", { ascending: false });

    const { data: subscribers, error } = await query;

    if (error) {
      console.error("[exportSubscribersCsv] Export Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to export CSV.",
      });
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="newsletter_subscribers.csv"');

    // Headers
    res.write("Email,Subscribed To Updates,Source,Subscribed At\n");

    (subscribers || []).forEach((sub) => {
      const email = `"${sub.email.replace(/"/g, '""')}"`;
      const updates = sub.subscribed_to_updates ? "Yes" : "No";
      const source = `"${sub.source.replace(/"/g, '""')}"`;
      const date = `"${new Date(sub.created_at).toLocaleString("en-IN")}"`;
      
      res.write(`${email},${updates},${source},${date}\n`);
    });

    res.end();
  } catch (error) {
    console.error("[exportSubscribersCsv] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to export CSV.",
    });
  }
};

