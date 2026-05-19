const NewsletterSubscriber = require("../models/NewsletterSubscriber");

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

    // Check duplicate
    const existing = await NewsletterSubscriber.findOne({ email: trimmedEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You're already subscribed.",
      });
    }

    // Save subscriber
    const newSubscriber = new NewsletterSubscriber({
      email: trimmedEmail,
      subscribedToUpdates: !!subscribedToUpdates,
      source: "footer-newsletter",
    });

    await newSubscriber.save();

    return res.status(201).json({
      success: true,
      message: "Thank you for subscribing!",
      data: newSubscriber,
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
    const query = {};

    // Search filter
    if (search.trim()) {
      query.email = { $regex: search.trim(), $options: "i" };
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);

    const total = await NewsletterSubscriber.countDocuments(query);
    const data = await NewsletterSubscriber.find(query)
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      total,
      data,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
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
    const subscriber = await NewsletterSubscriber.findByIdAndDelete(id);

    if (!subscriber) {
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

    await NewsletterSubscriber.deleteMany({ _id: { $in: ids } });

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
    const query = {};

    if (search.trim()) {
      query.email = { $regex: search.trim(), $options: "i" };
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const subscribers = await NewsletterSubscriber.find(query).sort({ createdAt: -1 });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="newsletter_subscribers.csv"');

    // Headers
    res.write("Email,Subscribed To Updates,Source,Subscribed At\n");

    subscribers.forEach((sub) => {
      const email = `"${sub.email.replace(/"/g, '""')}"`;
      const updates = sub.subscribedToUpdates ? "Yes" : "No";
      const source = `"${sub.source.replace(/"/g, '""')}"`;
      const date = `"${new Date(sub.createdAt).toLocaleString("en-IN")}"`;
      
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
