const mongoose = require("mongoose");

const NewsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    subscribedToUpdates: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: "footer-newsletter",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("NewsletterSubscriber", NewsletterSubscriberSchema, "newsletter_subscribers");
